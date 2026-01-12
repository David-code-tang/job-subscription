import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionActive } from '@/lib/actions'
import { Header } from '@/components/header'
import { JobTable } from '@/components/job-table'
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
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">岗位信息列表</h1>
          <p className="text-sm text-gray-600 mt-1">浏览和筛选最新招聘岗位</p>
        </div>

        <JobTable />
      </main>
    </div>
  )
}
