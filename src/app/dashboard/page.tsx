import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionActive } from '@/lib/actions'
import { ViewRenderer } from '@/components/view-switcher'

export default async function DashboardPage() {
  // 注意：认证和订阅检查已在 layout.tsx 中处理
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页面标题和操作栏 */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#dee2e6] bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1f2329]">岗位信息</h1>
            <p className="text-sm text-[#646a73] mt-0.5">浏览和筛选最新招聘岗位</p>
          </div>
        </div>
      </div>

      {/* 内容区域 - 根据当前视图渲染不同内容 */}
      <div className="flex-1 overflow-auto">
        <ViewRenderer />
      </div>
    </div>
  )
}

