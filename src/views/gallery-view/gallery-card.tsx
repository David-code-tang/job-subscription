'use client'

import { Building2, MapPin, Calendar, ExternalLink, Users } from 'lucide-react'
import { Job } from '@/lib/stores/job-store'

interface GalleryCardProps {
  job: Job
}

export function GalleryCard({ job }: GalleryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#dee2e6] p-5 hover:shadow-lg hover:border-[#0066ff] transition-all cursor-pointer group">
      {/* 顶部：公司名称和类型标签 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Building2 className="h-5 w-5 text-[#0066ff] flex-shrink-0" />
          <span className="font-semibold text-[#1f2329] truncate">{job.company}</span>
        </div>

        {job.type && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#e8f3ff] text-[#0066ff] flex-shrink-0 ml-2">
            {job.type}
          </span>
        )}
      </div>

      {/* 岗位标题 */}
      <h3 className="text-[#1f2329] font-semibold text-lg mb-4 line-clamp-2 min-h-[56px]">
        {job.title}
      </h3>

      {/* 详情列表 */}
      <div className="space-y-3 mb-4">
        {job.department && (
          <div className="flex items-center text-[#646a73]">
            <Users className="h-4 w-4 mr-3 text-[#8f959e] flex-shrink-0" />
            <span className="text-sm truncate">{job.department}</span>
          </div>
        )}

        {job.location && (
          <div className="flex items-center text-[#646a73]">
            <MapPin className="h-4 w-4 mr-3 text-[#8f959e] flex-shrink-0" />
            <span className="text-sm truncate">{job.location}</span>
          </div>
        )}

        {job.updated_date && (
          <div className="flex items-center text-[#8f959e]">
            <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="text-xs">更新于 {job.updated_date}</span>
          </div>
        )}
      </div>

      {/* 底部：操作按钮 */}
      <div className="flex items-center gap-2 pt-4 border-t border-[#dee2e6]">
        {job.link ? (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-[#0066ff] bg-[#e8f3ff] hover:bg-[#d6e8ff] rounded-md transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            查看详情
          </a>
        ) : (
          <span className="flex-1 flex items-center justify-center py-2 text-sm text-[#8f959e]">
            暂无链接
          </span>
        )}
      </div>
    </div>
  )
}
