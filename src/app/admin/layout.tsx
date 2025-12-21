import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Users, Database, Settings, LayoutDashboard, LogOut } from 'lucide-react'

// 管理员邮箱列表（可以添加多个）
const ADMIN_EMAILS = ['davidtang.20@outlook.com']

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/dashboard')
  }

  return user
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await checkAdmin()

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: '概览' },
    { href: '/admin/users', icon: Users, label: '用户管理' },
    { href: '/admin/data', icon: Database, label: '数据管理' },
    { href: '/admin/settings', icon: Settings, label: '系统设置' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold">
              管理后台
            </Link>
            <span className="text-gray-400 text-sm">|</span>
            <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">
              返回前台
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">{user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-gray-400 hover:text-white">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-56px)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
