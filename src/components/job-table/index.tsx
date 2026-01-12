'use client'

import { useEffect, useState } from 'react'
import { useJobStore } from '@/lib/stores/job-store'
import { TableHeader } from './table-header'
import { TableBody } from './table-body'
import { JobFilters } from './job-filters'
import { ExternalLink, Loader2, Download, Mail, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function JobTable() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 从 store 获取数据和方法
  const {
    jobs,
    filteredJobs,
    total,
    page,
    pageSize,
    setJobs,
    setPage,
    selectedRows,
    clearRowSelection,
  } = useJobStore()

  // 计算分页
  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  // 获取数据
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs')

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login?redirect=/dashboard'
            return
          }
          if (response.status === 403) {
            window.location.href = '/pricing'
            return
          }
          throw new Error('Failed to load jobs')
        }

        const data = await response.json()
        setJobs(data.jobs || [], data.total || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [setJobs])

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-140px)] flex items-center justify-center bg-white rounded-lg border">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        <span className="ml-3 text-gray-500">加载中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-white rounded-lg border">
        <div className="text-red-500 text-center">加载失败: {error}</div>
      </div>
    )
  }

  if (currentJobs.length === 0) {
    return (
      <div className="w-full p-8 bg-white rounded-lg border">
        <div className="text-center text-gray-500">
          暂无数据
          {total > 0 && `（共 ${total} 条记录，请调整筛选条件）`}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 筛选组件 */}
      <JobFilters />

      {/* 批量操作栏 */}
      {selectedRows.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">
              已选择 <span className="text-blue-600 font-bold">{selectedRows.length}</span> 个岗位
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-sm">
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <Mail className="h-4 w-4 mr-1" />
              发送邮件
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <Share2 className="h-4 w-4 mr-1" />
              分享
            </Button>
            <Button variant="ghost" size="sm" onClick={clearRowSelection} className="text-sm text-gray-600">
              取消选择
            </Button>
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          共找到 <span className="font-semibold">{total.toLocaleString()}</span> 个岗位
          {total !== filteredJobs.length && (
            <span className="ml-2 text-gray-400">
              （筛选后 {filteredJobs.length.toLocaleString()} 条）
            </span>
          )}
        </span>
        <span>
          第 {page} 页，共 {totalPages} 页
        </span>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <TableHeader />
          <TableBody jobs={currentJobs} />
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>

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
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 text-sm border rounded ${
                    pageNum === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
