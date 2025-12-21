'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useRef } from 'react'
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

interface ColumnConfig {
  key: string
  label: string
  minWidth: number
  defaultWidth: number
}

const columns: ColumnConfig[] = [
  { key: 'type', label: '行业', minWidth: 80, defaultWidth: 120 },
  { key: 'company', label: '公司', minWidth: 100, defaultWidth: 150 },
  { key: 'title', label: '岗位名称', minWidth: 150, defaultWidth: 280 },
  { key: 'department', label: '部门', minWidth: 80, defaultWidth: 150 },
  { key: 'location', label: '地点', minWidth: 60, defaultWidth: 100 },
  { key: 'updated_date', label: '更新日期', minWidth: 90, defaultWidth: 110 },
  { key: 'link', label: '申请链接', minWidth: 70, defaultWidth: 80 },
]

export function JobTable({ jobs, total, page, pageSize }: JobTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultWidth }), {})
  )
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null)

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

  const handleMouseDown = useCallback((e: React.MouseEvent, key: string) => {
    e.preventDefault()
    resizingRef.current = {
      key,
      startX: e.clientX,
      startWidth: columnWidths[key],
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return
      const diff = e.clientX - resizingRef.current.startX
      const col = columns.find(c => c.key === resizingRef.current!.key)
      const newWidth = Math.max(col?.minWidth || 50, resizingRef.current.startWidth + diff)
      setColumnWidths(prev => ({ ...prev, [resizingRef.current!.key]: newWidth }))
    }

    const handleMouseUp = () => {
      resizingRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [columnWidths])

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
      <div className="border rounded-lg overflow-x-auto">
        <Table style={{ tableLayout: 'fixed', minWidth: '900px' }}>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map((col, index) => (
                <TableHead
                  key={col.key}
                  style={{ width: columnWidths[col.key], position: 'relative' }}
                  className="select-none"
                >
                  <div className="flex items-center justify-between pr-2">
                    <span>{col.label}</span>
                  </div>
                  {index < columns.length - 1 && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group"
                      onMouseDown={(e) => handleMouseDown(e, col.key)}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-gray-300 rounded group-hover:bg-blue-500" />
                    </div>
                  )}
                </TableHead>
              ))}
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
                  <TableCell style={{ width: columnWidths['type'] }}>
                    <Badge variant="secondary" className="text-xs truncate max-w-full">
                      {job.type || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ width: columnWidths['company'] }} className="font-medium truncate">
                    {job.company}
                  </TableCell>
                  <TableCell style={{ width: columnWidths['title'] }}>
                    <span className="line-clamp-2" title={job.title}>
                      {job.title}
                    </span>
                  </TableCell>
                  <TableCell style={{ width: columnWidths['department'] }} className="text-gray-600 text-sm truncate">
                    {job.department || '-'}
                  </TableCell>
                  <TableCell style={{ width: columnWidths['location'] }} className="text-gray-600 text-sm truncate">
                    {job.location || '-'}
                  </TableCell>
                  <TableCell style={{ width: columnWidths['updated_date'] }} className="text-gray-600 text-sm">
                    {formatDate(job.updated_date)}
                  </TableCell>
                  <TableCell style={{ width: columnWidths['link'] }} className="text-center">
                    {job.link ? (
                      <a
                        href={job.link}
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
