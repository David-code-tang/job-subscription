'use client'

import { useJobStore } from '@/lib/stores/job-store'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface ColumnConfig {
  key: string
  label: string
  width: number
  sortable: boolean
}

const columns: ColumnConfig[] = [
  { key: 'type', label: '行业', width: 130, sortable: true },
  { key: 'company', label: '公司', width: 150, sortable: true },
  { key: 'title', label: '岗位名称', width: 300, sortable: true },
  { key: 'department', label: '部门', width: 160, sortable: true },
  { key: 'location', label: '地点', width: 110, sortable: true },
  { key: 'updated_date', label: '更新日期', width: 120, sortable: true },
  { key: 'link', label: '申请链接', width: 90, sortable: false },
]

export function TableHeader() {
  const { sortBy, sortDir, columnWidths, setSort, updateColumnWidth } = useJobStore()

  const handleSort = (columnKey: string) => {
    let newDir: 'asc' | 'desc' | null = 'asc'

    if (sortBy === columnKey) {
      if (sortDir === 'asc') {
        newDir = 'desc'
      } else if (sortDir === 'desc') {
        newDir = null
      }
    }

    if (newDir === null) {
      // 取消排序
      setSort('', null)
    } else {
      setSort(columnKey, newDir)
    }
  }

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />
    }
    if (sortDir === 'asc') {
      return <ArrowUp className="h-3 w-3 text-blue-600" />
    }
    return <ArrowDown className="h-3 w-3 text-blue-600" />
  }

  const handleMouseDown = (columnKey: string, startX: number) => {
    const startWidth = columnWidths[columnKey]

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX
      const newWidth = Math.max(80, startWidth + diff)
      updateColumnWidth(columnKey, newWidth)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }

    document.body.style.cursor = 'col-resize'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    try {
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        const [, month, day] = parts
        return `${month}/${day}`
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`relative px-4 py-3 text-left text-sm font-medium text-gray-900 select-none border-b ${
              col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            style={{ width: `${columnWidths[col.key]}px` }}
          >
            <div
              className="flex items-center gap-1"
              onClick={() => col.sortable && handleSort(col.key)}
            >
              <span>{col.label}</span>
              {col.sortable && getSortIcon(col.key)}
            </div>

            {/* 列宽调整手柄 */}
            {col.key !== 'link' && (
              <div
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleMouseDown(col.key, e.clientX)
                }}
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  )
}
