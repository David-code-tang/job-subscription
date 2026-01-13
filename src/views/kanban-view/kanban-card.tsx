'use client'

import { ExternalLink, Building2, MapPin, Calendar } from 'lucide-react'
import { Job } from '@/lib/stores/job-store'

interface KanbanCardProps {
  job: Job
}

export function KanbanCard({ job }: KanbanCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#dee2e6] p-4 hover:shadow-md transition-shadow cursor-pointer group">
      {/* 公司名称 */}
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="h-4 w-4 text-[#646a73]" />
        <span className="font-semibold text-[#1f2329] truncate flex-1">{job.company}</span>
      </div>

      {/* 岗位标题 */}
      <h3 className="text-[#1f2329] font-medium mb-3 line-clamp-2 min-h-[40px]">
        {job.title}
      </h3>

      {/* 标签 */}
      {job.type && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#e8f3ff] text-[#0066ff]">
            {job.type}
          </span>
        </div>
      )}

      {/* 详情 */}
      <div className="space-y-2 text-sm">
        {job.department && (
          <div className="flex items-center text-[#646a73]">
            <span className="font-medium mr-2">部门:</span>
            <span className="truncate">{job.department}</span>
          </div>
        )}

        {job.location && (
          <div className="flex items-center text-[#646a73]">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}

        {job.updated_date && (
          <div className="flex items-center text-[#8f959e]">
            <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span className="text-xs">{job.updated_date}</span>
          </div>
        )}
      </div>

      {/* 申请链接 */}
      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center w-full py-2 text-sm text-[#0066ff] hover:bg-[#e8f3ff] rounded-md transition-colors opacity-0 group-hover:opacity-100"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          查看详情
        </a>
      )}
    </div>
  )
}
