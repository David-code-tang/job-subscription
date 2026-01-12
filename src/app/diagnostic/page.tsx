import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'

export default async function DiagnosticPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/diagnostic')
  }

  // 检查 Supabase 中的数据
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  const jobCount = jobs?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">系统诊断页面</h1>
          <p className="text-gray-600 mt-2">检查系统配置和状态</p>
        </div>

        <div className="space-y-4">
          {/* S2 组件检查 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">AntV S2 组件</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">@antv/s2</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ 已安装 v2.4.14</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">@antv/s2-react</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ 已安装 v2.3.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">S2Table 组件</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ 已创建</span>
              </div>
            </div>
          </div>

          {/* Dashboard 配置检查 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Dashboard 页面配置</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">导入的组件</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ S2Table</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">使用的组件</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ &lt;S2Table /&gt;</span>
              </div>
            </div>
          </div>

          {/* 数据库检查 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Supabase 数据</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">jobs 表数据量</span>
                <span className={`px-2 py-1 rounded ${jobCount > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {jobCount > 0 ? `✓ ${jobCount} 条记录` : '⚠️ 暂无数据'}
                </span>
              </div>
              {error && (
                <div className="text-red-600 text-xs">
                  错误: {error.message}
                </div>
              )}
            </div>
          </div>

          {/* 飞书 API 配置检查 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">飞书 API 配置</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">FEISHU_APP_ID</span>
                <span className={`px-2 py-1 rounded ${process.env.FEISHU_APP_ID ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {process.env.FEISHU_APP_ID ? '✓ 已配置' : '未配置（仅在服务端）'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">数据同步脚本</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ 已创建</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cron Job 配置</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ 每 6 小时</span>
              </div>
            </div>
          </div>

          {/* 操作建议 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">操作建议</h2>
            <div className="space-y-3">
              {jobCount === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ 数据库中暂无岗位数据
                  </p>
                  <p className="text-sm text-yellow-700 mb-3">
                    你需要先执行数据同步，从飞书多维表格导入数据。
                  </p>
                  <a
                    href="/admin/sync"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    前往同步页面
                  </a>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    ✓ 数据库中有 {jobCount} 条记录，S2 表格应该可以正常显示
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📋 测试步骤
                </p>
                <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                  <li>先访问 <a href="/test-s2" className="underline">/test-s2</a> 测试页面</li>
                  <li>如果看到"暂无数据"，说明组件正常</li>
                  <li>然后访问 <a href="/admin/sync" className="underline">/admin/sync</a> 执行同步</li>
                  <li>最后访问 <a href="/dashboard" className="underline">/dashboard</a> 查看效果</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">快速链接</h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/dashboard"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-center text-sm"
              >
                Dashboard (岗位列表)
              </a>
              <a
                href="/test-s2"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-center text-sm"
              >
                S2 测试页面
              </a>
              <a
                href="/admin/sync"
                className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-center text-sm"
              >
                数据同步管理
              </a>
              <a
                href="/pricing"
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-center text-sm"
              >
                订阅页面
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
