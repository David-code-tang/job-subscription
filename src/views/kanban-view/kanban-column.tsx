'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { KanbanCard } from './kanban-card'
import { Job } from '@/lib/stores/job-store'

interface KanbanColumnProps {
  title: string
  jobs: Job[]
  color: string
  onAddJob?: () => void
}

export function KanbanColumn({ title, jobs, color, onAddJob }: KanbanColumnProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="flex-shrink-0 w-80">
      {/* 列标题 */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#646a73] hover:text-[#1f2329] transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* 颜色指示器 */}
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />

          <span className="font-medium text-[#1f2329]">{title}</span>

          {/* 计数 */}
          <span className="text-sm text-[#8f959e] bg-gray-100 px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        </div>

        {/* 添加按钮 */}
        {onAddJob && (
          <button
            onClick={onAddJob}
            className="text-[#8f959e] hover:text-[#0066ff] transition-colors p-1 rounded hover:bg-[#f5f6f7]"
            title="添加新岗位"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 卡片列表 */}
      {isExpanded && (
        <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-[#8f959e] text-sm">
              暂无岗位
            </div>
          ) : (
            jobs.map((job) => <KanbanCard key={job.id} job={job} />)
          )}
        </div>
      )}
    </div>
  )
}
