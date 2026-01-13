'use client'

import { useState } from 'react'
import { useJobStore } from '@/lib/stores/job-store'
import { TableHeader } from './table-header'
import { TableBody } from './table-body'
import { Download, Mail, Share2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportSelectedJobs, exportFilteredJobs } from '@/lib/utils/export'
import { useTableKeyboard } from '@/hooks/useTableKeyboard'

export function JobTable() {
  const [exporting, setExporting] = useState(false)

  // 从 store 获取数据和方法
  const {
    jobs,
    filteredJobs,
    total,
    page,
    pageSize,
    setPage,
    selectedRows,
    clearRowSelection,
  } = useJobStore()

  // 只在表格视图下启用键盘快捷键
  useTableKeyboard()

  // 计算分页
  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

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

  // 空数据状态
  if (currentJobs.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center">
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
    <div className="h-full flex flex-col gap-4">
      {/* 批量操作栏 - 固定 */}
      {selectedRows.length > 0 && (
        <div className="flex-shrink-0 bg-[#f0f6ff] border border-[#0066ff] rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1f2329]">
              已选择 <span className="text-[#0066ff] font-bold">{selectedRows.length}</span> 个岗位
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-sm border-[#0066ff] text-[#0066ff] hover:bg-[#e8f3ff]"
              onClick={handleExportSelected}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-1" />
              导出选中
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-sm border-[#0066ff] text-[#0066ff] hover:bg-[#e8f3ff]"
              onClick={handleCopyLinks}
            >
              <Share2 className="h-4 w-4 mr-1" />
              复制链接
            </Button>
            <Button variant="ghost" size="sm" onClick={clearRowSelection} className="text-sm text-[#646a73] hover:text-[#1f2329] h-8">
              取消选择
            </Button>
          </div>
        </div>
      )}

      {/* 结果统计 - 固定 */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-[#646a73]">
        <span>
          共找到 <span className="font-semibold text-[#1f2329]">{total.toLocaleString()}</span> 个岗位
          {total !== filteredJobs.length && (
            <span className="ml-2 text-[#8f959e]">
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
              className="text-sm border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6]"
              onClick={handleExportAll}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-1" />
              导出全部
            </Button>
          )}
        </div>
      </div>

      {/* 表格 - 可滚动 */}
      <div className="flex-1 bg-white rounded-lg border border-[#dee2e6] overflow-auto">
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <TableHeader />
          <TableBody jobs={currentJobs} />
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 text-sm rounded-md border border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  className={`w-9 h-9 text-sm rounded-md transition-all ${
                    pageNum === page
                      ? 'bg-[#0066ff] text-white border-0 font-medium'
                      : 'bg-white border border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6]'
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
            className="px-4 py-2 text-sm rounded-md border border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
