'use client'

import { KanbanCard } from '../kanban-view/kanban-card'
import { GalleryCard } from './gallery-card'
import { useJobStore } from '@/lib/stores/job-store'

export function GalleryView() {
  const { filteredJobs } = useJobStore()

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 工具栏 */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#dee2e6] bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1f2329]">画册视图</h2>
            <p className="text-sm text-[#646a73] mt-0.5">卡片网格布局展示岗位</p>
          </div>

          <div className="text-sm text-[#646a73]">
            共 <span className="font-semibold text-[#1f2329]">{filteredJobs.length}</span> 个岗位
          </div>
        </div>
      </div>

      {/* 卡片网格 */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredJobs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-[#8f959e] text-lg">暂无岗位数据</p>
              <p className="text-[#646a73] text-sm mt-2">请调整筛选条件或添加新岗位</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredJobs.map((job) => (
              <GalleryCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
