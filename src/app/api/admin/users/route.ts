import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 管理员邮箱列表
const ADMIN_EMAILS = ['davidtang.20@outlook.com']

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return null
  }
  return user
}

export async function GET() {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // 获取所有用户及其订阅信息
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')

  // 合并数据
  const users = profiles?.map(profile => ({
    ...profile,
    subscription: subscriptions?.find(s => s.user_id === profile.id)
  })) || []

  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const body = await request.json()

  if (body.action === 'updateSubscription') {
    const { userId, plan_id, status, duration } = body

    // 计算到期时间
    const now = new Date()
    const endDate = new Date(now)
    endDate.setMonth(endDate.getMonth() + parseInt(duration))

    // 检查是否已有订阅记录
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existing) {
      // 更新现有订阅
      await supabase
        .from('subscriptions')
        .update({
          plan_id,
          status,
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('user_id', userId)
    } else {
      // 创建新订阅
      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id,
          status,
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
        })
    }

    return NextResponse.json({ success: true })
  }

  if (body.action === 'cancelSubscription') {
    const { userId } = body

    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
