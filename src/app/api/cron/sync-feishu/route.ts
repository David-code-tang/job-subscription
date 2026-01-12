import { syncFeishuData } from '@/lib/sync-feishu-data'
import { NextResponse } from 'next/server'

/**
 * Vercel Cron Job 路由
 */

export async function GET(request: Request) {
  // 验证 Cron Job 密钥（防止未授权访问）
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  // 执行同步
  const result = await syncFeishuData()

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: result.message,
      count: result.count,
      timestamp: new Date().toISOString(),
    })
  } else {
    return NextResponse.json(
      {
        success: false,
        message: result.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// 允许 POST 请求手动触发同步
export async function POST(request: Request) {
  return GET(request)
}
