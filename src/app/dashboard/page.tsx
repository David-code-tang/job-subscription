import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionActive } from '@/lib/actions'
import { Header } from '@/components/header'
import { FeishuTable } from '@/components/feishu-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  const isSubscribed = await checkSubscriptionActive()

  // 如果没有有效订阅，显示付费引导
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">升级以访问岗位信息</CardTitle>
              <CardDescription className="text-base">
                订阅会员后，您可以访问全部 10,000+ 精选岗位信息，支持多维度筛选和搜索。
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <ul className="text-left max-w-sm mx-auto space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-sm">✓</span>
                    访问全部岗位信息
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-sm">✓</span>
                    按公司、部门、地点筛选
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-sm">✓</span>
                    关键词搜索
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-sm">✓</span>
                    每日数据更新
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button size="lg" className="mt-4">
                    查看订阅套餐
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header user={user} />

      {/* 无法忽略的红色横幅 */}
      <div className="bg-red-600 text-white text-center py-4 px-4 font-bold text-xl">
        ⚠️ NEW VERSION ALERT: 如果你看到这个红色横幅，说明新代码已部署！
      </div>

      <main className="container mx-auto px-2 py-4">
        {/* 明确的视觉提示 */}
        <div className="mb-3 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-900">🎉 NEW: 岗位列表 (AntV S2)</h1>
            <p className="text-sm text-blue-600">浏览和筛选最新招聘岗位 - 使用开源 AntV S2 表格</p>
          </div>
          <div className="text-sm font-bold text-blue-600 bg-white px-3 py-1 rounded-full">
            ✨ AntV S2 Active
          </div>
        </div>

        {/* 绿色提示框 */}
        <div className="bg-green-100 border-4 border-green-500 p-4 mb-4 rounded-lg">
          <h2 className="text-lg font-bold text-green-800">✅ S2 组件区域</h2>
          <p className="text-green-700 text-sm">下方的表格应该由 AntV S2 渲染，而不是飞书 iframe</p>
          <p className="text-green-600 text-xs mt-2">Git commit: ebffe9e</p>
        </div>

        <FeishuTable />
      </main>
    </div>
  )
}
