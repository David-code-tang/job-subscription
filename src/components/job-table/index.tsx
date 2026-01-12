'use client'

import { useEffect, useState } from 'react'
import { useJobStore } from '@/lib/stores/job-store'
import { TableHeader } from './table-header'
import { TableBody } from './table-body'
import { TableSkeleton } from './table-skeleton'
import { JobFilters } from './job-filters'
import { ExternalLink, Loader2, Download, Mail, Share2, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportSelectedJobs, exportFilteredJobs } from '@/lib/utils/export'

export function JobTable() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [exporting, setExporting] = useState(false)

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
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        console.error('Failed to fetch jobs:', errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [setJobs, retryCount])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRetryCount((prev) => prev + 1)
  }

  // 导出选中的岗位
  const handleExportSelected = async () => {
    if (selectedRows.length === 0) return

    setExporting(true)
    try {
      const success = exportSelectedJobs(jobs, selectedRows, `selected-jobs-${Date.now()}.csv`)
      if (!success) {
        alert('导出失败，请重试')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  // 导出所有筛选后的岗位
  const handleExportAll = async () => {
    setExporting(true)
    try {
      const success = exportFilteredJobs(filteredJobs, `jobs-${Date.now()}.csv`)
      if (!success) {
        alert('导出失败，请重试')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  // 复制选中岗位的链接到剪贴板
  const handleCopyLinks = async () => {
    if (selectedRows.length === 0) return

    const selectedJobs = jobs.filter((job) => selectedRows.includes(job.id))
    const links = selectedJobs
      .map((job) => {
        if (!job.link) return null
        return `${job.company} - ${job.title}: ${job.link}`
      })
      .filter(Boolean)
      .join('\n')

    try {
      await navigator.clipboard.writeText(links)
      alert(`已复制 ${selectedJobs.length} 个岗位链接到剪贴板`)
    } catch (error) {
      console.error('Copy failed:', error)
      alert('复制失败，请重试')
    }
  }

  // 加载状态 - 使用骨架屏
  if (loading) {
    return (
      <div className="space-y-4">
        <JobFilters />
        <TableSkeleton />
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="space-y-4">
        <JobFilters />
        <div className="bg-white border border-red-200 rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">加载失败</h3>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
            </div>
            <Button onClick={handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              重试
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 空数据状态
  if (currentJobs.length === 0) {
    return (
      <div className="space-y-4">
        <JobFilters />
        <div className="bg-white border border-gray-200 rounded-lg p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">暂无数据</h3>
              <p className="text-sm text-gray-600 mt-1">
                {total > 0
                  ? `共 ${total} 条记录，请调整筛选条件`
                  : '还没有岗位信息，请稍后再来查看'}
              </p>
            </div>
          </div>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">
              已选择 <span className="text-blue-600 font-bold">{selectedRows.length}</span> 个岗位
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={handleExportSelected}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-1" />
              导出选中
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={handleCopyLinks}
            >
              <Share2 className="h-4 w-4 mr-1" />
              复制链接
            </Button>
            <Button variant="ghost" size="sm" onClick={clearRowSelection} className="text-sm text-gray-600">
              取消选择
            </Button>
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
        <span>
          共找到 <span className="font-semibold">{total.toLocaleString()}</span> 个岗位
          {total !== filteredJobs.length && (
            <span className="ml-2 text-gray-400">
              （筛选后 {filteredJobs.length.toLocaleString()} 条）
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <span>
            第 {page} 页，共 {totalPages} 页
          </span>
          {filteredJobs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={handleExportAll}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-1" />
              导出全部
            </Button>
          )}
        </div>
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
