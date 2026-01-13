'use client'

import { useJobStore } from '@/lib/stores/job-store'
import { JobTable } from '@/components/job-table/index'
import { KanbanView } from '@/views/kanban-view'
import { GalleryView } from '@/views/gallery-view'
import { DataLoader } from '@/components/data-loader'

export function ViewSwitcher() {
  const { currentView } = useJobStore()

  // 这个组件现在只用于在页面顶部显示当前视图信息
  // 实际的视图切换在 topbar 中完成
  return null
}

// 根据当前视图类型渲染对应的内容
export function ViewRenderer() {
  const { currentView } = useJobStore()

  return (
    <DataLoader>
      {currentView === 'kanban' && <KanbanView />}
      {currentView === 'gallery' && <GalleryView />}
      {currentView === 'table' && <JobTable />}
    </DataLoader>
  )
}
