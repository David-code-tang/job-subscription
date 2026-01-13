import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionActive } from '@/lib/actions'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  const isSubscribed = await checkSubscriptionActive()

  if (!isSubscribed) {
    redirect('/pricing')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧侧边栏 - 240px */}
      <aside className="w-60 bg-white border-r border-[#dee2e6] flex-shrink-0">
        <Sidebar user={user} />
      </aside>

      {/* 主内容区 - flex-1 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 - 56px */}
        <header className="h-14 bg-white border-b border-[#dee2e6] flex-shrink-0">
          <Topbar user={user} />
        </header>

        {/* 内容区域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 视图区域 */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* 右侧详情面板 - 360px（可折叠）- 暂时隐藏 */}
          {/* <aside className="w-90 bg-white border-l border-[#dee2e6] flex-shrink-0">
            <RightPanel />
          </aside> */}
        </div>
      </main>
    </div>
  )
}
