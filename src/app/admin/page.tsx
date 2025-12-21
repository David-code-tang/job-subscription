import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, CreditCard, TrendingUp } from 'lucide-react'

async function getStats() {
  const supabase = createAdminClient()

  const [jobs, users, activeSubscriptions] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  // 获取公司数量
  const { data: companiesData } = await supabase.from('jobs').select('company')
  const uniqueCompanies = new Set(companiesData?.map(j => j.company)).size

  return {
    totalJobs: jobs.count || 0,
    totalUsers: users.count || 0,
    activeSubscriptions: activeSubscriptions.count || 0,
    totalCompanies: uniqueCompanies,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { title: '总岗位数', value: stats.totalJobs.toLocaleString(), icon: Briefcase, color: 'text-blue-600 bg-blue-100' },
    { title: '注册用户', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-green-600 bg-green-100' },
    { title: '活跃订阅', value: stats.activeSubscriptions.toLocaleString(), icon: CreditCard, color: 'text-purple-600 bg-purple-100' },
    { title: '收录公司', value: stats.totalCompanies.toLocaleString(), icon: TrendingUp, color: 'text-orange-600 bg-orange-100' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">管理后台</h1>
        <p className="text-gray-600">系统概览和数据统计</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">管理用户订阅</h3>
              <p className="text-sm text-gray-600">开通、续费或取消用户订阅</p>
            </a>
            <a
              href="/admin/data"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">导入数据</h3>
              <p className="text-sm text-gray-600">从 CSV 文件导入新的岗位数据</p>
            </a>
            <a
              href="/admin/settings"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">系统设置</h3>
              <p className="text-sm text-gray-600">配置网站名称、价格等信息</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
