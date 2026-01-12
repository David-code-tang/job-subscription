import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'

export default async function AdminSyncPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin/sync')
  }

  // 这里应该检查是否为管理员
  // 暂时简化处理

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">数据同步管理</h1>
          <p className="text-gray-600 mt-2">手动触发飞书数据同步</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">同步状态</h2>
              <p className="text-sm text-gray-600">
                点击下方按钮手动触发数据同步。同步将：
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>从飞书多维表格获取最新数据</li>
                <li>清空 Supabase 中的旧数据</li>
                <li>将新数据写入 Supabase</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>注意：</strong> 同步过程可能需要几秒钟，取决于数据量。
                请不要重复点击按钮。
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  const result = await fetch('/api/cron/sync-feishu', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      // 如果配置了 CRON_SECRET，需要在这里添加
                      // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
                    },
                  })
                  const data = await result.json()
                  alert(data.message)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                立即同步
              </button>

              <a
                href="/dashboard"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                返回岗位列表
              </a>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-2">自动同步设置</h3>
              <p className="text-sm text-gray-600">
                系统已配置为每 6 小时自动同步一次数据。
                下次同步时间：{new Date(Date.now() + 6 * 60 * 60 * 1000).toLocaleString('zh-CN')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">配置检查</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">FEISHU_APP_ID</span>
              <span className={`px-2 py-1 rounded ${process.env.FEISHU_APP_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {process.env.FEISHU_APP_ID ? '✓ 已配置' : '✗ 未配置'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">FEISHU_APP_SECRET</span>
              <span className={`px-2 py-1 rounded ${process.env.FEISHU_APP_SECRET ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {process.env.FEISHU_APP_SECRET ? '✓ 已配置' : '✗ 未配置'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">FEISHU_APP_TOKEN</span>
              <span className={`px-2 py-1 rounded ${process.env.FEISHU_APP_TOKEN ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {process.env.FEISHU_APP_TOKEN ? '✓ 已配置' : '✗ 未配置'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">FEISHU_TABLE_ID</span>
              <span className={`px-2 py-1 rounded ${process.env.FEISHU_TABLE_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {process.env.FEISHU_TABLE_ID ? '✓ 已配置' : '✗ 未配置'}
              </span>
            </div>
          </div>

          {(!process.env.FEISHU_APP_ID || !process.env.FEISHU_APP_SECRET ||
            !process.env.FEISHU_APP_TOKEN || !process.env.FEISHU_TABLE_ID) && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>配置提示：</strong>
                请在 Vercel 项目设置中添加飞书 API 相关的环境变量。
                详细步骤请参考 <a href="/FEISHU_API_SETUP.md" className="underline">配置文档</a>。
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
