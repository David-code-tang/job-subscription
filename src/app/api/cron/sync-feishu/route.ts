import { syncFeishuData } from '@/lib/sync-feishu-data'
import { NextResponse } from 'next/server'

/**
 * Vercel Cron Job 路由
 *
 * 配置方式：
 * 1. 在项目根目录创建 vercel.json
 * 2. 添加 cron 配置：
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/sync-feishu",
 *       "schedule": "0 * * * *"
 *     }
 *   ]
 * }
 *
 * Cron 表达式说明：
 * - "0 * * * *" - 每小时执行一次
 * - "0 */6 * * *" - 每 6 小时执行一次
 * - "0 0 * * *" - 每天凌晨执行
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
