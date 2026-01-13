'use client'

import { useMemo, useState } from 'react'
import { useJobStore } from '@/lib/stores/job-store'
import { KanbanColumn } from './kanban-column'
import { TopBarActions } from '@/components/layout/topbar-actions'

// 分组字段选项
type GroupByField = 'department' | 'location' | 'company' | 'type' | null

interface GroupedJobs {
  [key: string]: import('@/lib/stores/job-store').Job[]
}

// 颜色配置
const GROUP_COLORS = [
  '#0066ff', // 蓝色
  '#00a670', // 绿色
  '#ff8800', // 橙色
  '#6236ff', // 紫色
  '#e91e63', // 粉色
  '#00bcd4', // 青色
  '#ff5722', // 深橙
  '#9c27b0', // 深紫
]

export function KanbanView() {
  const { filteredJobs } = useJobStore()
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isFieldConfigOpen, setIsFieldConfigOpen] = useState(false)
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)

  // 按部门分组（默认）
  const groupedData = useMemo(() => {
    const groups: GroupedJobs = {}

    filteredJobs.forEach((job) => {
      // 使用部门作为分组字段
      const key = job.department || '未分类'
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(job)
    })

    return groups
  }, [filteredJobs])

  // 获取所有分组并排序
  const groupKeys = useMemo(() => {
    return Object.keys(groupedData).sort((a, b) => {
      // 未分类排在最后
      if (a === '未分类') return 1
      if (b === '未分类') return -1
      // 按数量降序
      return groupedData[b].length - groupedData[a].length
    })
  }, [groupedData])

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 工具栏 */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#dee2e6] bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1f2329]">看板视图</h2>
            <p className="text-sm text-[#646a73] mt-0.5">按部门分组展示岗位</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-[#646a73]">
              共 <span className="font-semibold text-[#1f2329]">{filteredJobs.length}</span> 个岗位，
              <span className="font-semibold text-[#1f2329] ml-1">{groupKeys.length}</span> 个分组
            </div>

            <TopBarActions
              isFilterDialogOpen={isFilterDialogOpen}
              setIsFilterDialogOpen={setIsFilterDialogOpen}
              isFieldConfigOpen={isFieldConfigOpen}
              setIsFieldConfigOpen={setIsFieldConfigOpen}
              isAddFieldOpen={isAddFieldOpen}
              setIsAddFieldOpen={setIsAddFieldOpen}
            />
          </div>
        </div>
      </div>

      {/* 看板区域 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-4 h-full min-w-min">
          {groupKeys.map((key, index) => (
            <KanbanColumn
              key={key}
              title={key}
              jobs={groupedData[key]}
              color={GROUP_COLORS[index % GROUP_COLORS.length]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
