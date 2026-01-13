'use client'

import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useJobStore } from '@/lib/stores/job-store'

export function useTableKeyboard() {
  const {
    selectedRows,
    filteredJobs,
    toggleRowSelection,
    clearRowSelection,
    deleteJob,
    setEditingCell,
    editingCell,
  } = useJobStore()

  // 复制选中行的数据
  useHotkeys('mod+c', (e) => {
    if (selectedRows.length > 0) {
      e.preventDefault()
      const selectedJobs = filteredJobs.filter((job) => selectedRows.includes(job.id))
      const text = selectedJobs
        .map((job) => `${job.company}\t${job.title}\t${job.department || ''}\t${job.location || ''}\t${job.type}`)
        .join('\n')
      navigator.clipboard.writeText(text)
      console.log(`已复制 ${selectedRows.length} 行数据`)
    }
  })

  // 删除选中的行
  useHotkeys('delete, backspace', async (e) => {
    // 只有在没有编辑单元格且没有聚焦在输入框时才响应
    if (editingCell === null && document.activeElement?.tagName !== 'INPUT') {
      e.preventDefault()
      if (selectedRows.length > 0) {
        const confirmed = confirm(`确定要删除选中的 ${selectedRows.length} 行吗？`)
        if (confirmed) {
          for (const rowId of selectedRows) {
            await deleteJob(rowId)
          }
          clearRowSelection()
          console.log(`已删除 ${selectedRows.length} 行`)
        }
      }
    }
  })

  // 全选 / 取消全选
  useHotkeys('mod+a', (e) => {
    if (document.activeElement?.tagName !== 'INPUT') {
      e.preventDefault()
      if (selectedRows.length === filteredJobs.length) {
        clearRowSelection()
      } else {
        // 全选所有过滤后的行
        filteredJobs.forEach((job) => {
          if (!selectedRows.includes(job.id)) {
            toggleRowSelection(job.id)
          }
        })
      }
    }
  })

  // Esc - 取消选择或退出编辑模式
  useHotkeys('escape', () => {
    if (editingCell) {
      setEditingCell(null)
    } else if (selectedRows.length > 0) {
      clearRowSelection()
    }
  })

  // Enter - 进入编辑模式（如果有选中的行）
  useHotkeys('enter', () => {
    if (selectedRows.length === 1 && !editingCell) {
      const rowId = selectedRows[0]
      setEditingCell({ rowId, field: 'title' })
    }
  })

  // 方向键导航（简单实现，可以后续扩展为单元格导航）
  useHotkeys('arrowup', (e) => {
    if (document.activeElement?.tagName !== 'INPUT' && !editingCell) {
      e.preventDefault()
      // 这里可以实现向上选择行的逻辑
      console.log('向上导航')
    }
  })

  useHotkeys('arrowdown', (e) => {
    if (document.activeElement?.tagName !== 'INPUT' && !editingCell) {
      e.preventDefault()
      // 这里可以实现向下选择行的逻辑
      console.log('向下导航')
    }
  })
}
