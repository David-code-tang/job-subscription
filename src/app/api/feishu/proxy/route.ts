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

export async function GET() {
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

  // 返回飞书 URL
  const feishuUrl = process.env.FEISHU_BASE_URL

  if (!feishuUrl) {
    return NextResponse.json(
      { error: 'Feishu URL not configured' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: feishuUrl })
}
