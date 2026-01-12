import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionActive } from '@/lib/actions'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// 简单的内存速率限制（生产环境应使用 Redis）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 10 // 每分钟最大请求数
const RATE_LIMIT_WINDOW = 60 * 1000 // 1分钟

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

export async function GET(request: Request) {
  // 速率限制
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'

  if (!await checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // 认证检查
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // 订阅检查
  const isSubscribed = await checkSubscriptionActive()

  if (!isSubscribed) {
    return NextResponse.json(
      { error: 'Subscription required' },
      { status: 403 }
    )
  }

  // 获取查询参数
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10000') // 默认获取所有数据
  const offset = (page - 1) * pageSize

  // 从 Supabase 获取数据
  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })

  // 应用筛选条件
  const type = searchParams.get('type')
  const company = searchParams.get('company')
  const department = searchParams.get('department')
  const location = searchParams.get('location')
  const search = searchParams.get('search')

  if (type) {
    query = query.eq('type', type)
  }
  if (company) {
    query = query.eq('company', company)
  }
  if (department) {
    query = query.eq('department', department)
  }
  if (location) {
    query = query.eq('location', location)
  }
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // 排序
  const sortBy = searchParams.get('sortBy') || 'updated_date'
  const sortDir = searchParams.get('sortDir') || 'desc'
  query = query.order(sortBy, { ascending: sortDir === 'asc', nullsFirst: false })

  // 分页
  query = query.range(offset, offset + pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    jobs: data || [],
    total: count || 0,
    page,
    pageSize,
  })
}
