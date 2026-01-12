import { S2Table } from '@/components/s2-table'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'

export default async function TestS2Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/test-s2')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">S2 表格测试页面</h1>
          <p className="text-gray-600 mt-2">这是一个测试页面，用于验证 AntV S2 表格组件</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>说明：</strong>此页面显示 AntV S2 表格组件。如果看到"暂无数据"提示，
            说明组件工作正常，但 Supabase 中还没有数据。需要先执行数据同步。
          </p>
        </div>

        <div className="bg-white rounded-lg border">
          <S2Table />
        </div>

        <div className="mt-6 flex gap-3">
          <a
            href="/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            返回 Dashboard
          </a>
          <a
            href="/admin/sync"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            数据同步管理
          </a>
        </div>
      </main>
    </div>
  )
}
