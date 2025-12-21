'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Job } from '@/types/database'

interface JobTableProps {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
}

export function JobTable({ jobs, total, page, pageSize }: JobTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/dashboard?${params.toString()}`)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    try {
      // 处理 DD/MM/YYYY 格式
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        const [day, month, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-4">
      {/* 结果统计 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          共找到 <span className="font-semibold">{total.toLocaleString()}</span> 个岗位
        </span>
        <span>
          第 {page} 页，共 {totalPages} 页
        </span>
      </div>

      {/* 表格 */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[120px]">行业</TableHead>
              <TableHead className="w-[150px]">公司</TableHead>
              <TableHead>岗位名称</TableHead>
              <TableHead className="w-[150px]">部门</TableHead>
              <TableHead className="w-[100px]">地点</TableHead>
              <TableHead className="w-[110px]">更新日期</TableHead>
              <TableHead className="w-[80px] text-center">申请</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  没有找到匹配的岗位
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{job.company}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <span className="line-clamp-2" title={job.job_title}>
                      {job.job_title}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {job.department || '-'}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {job.location || '-'}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {formatDate(job.update_date)}
                  </TableCell>
                  <TableCell className="text-center">
                    {job.job_url ? (
                      <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            上一页
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            下一页
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
