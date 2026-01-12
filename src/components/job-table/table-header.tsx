'use client'

import { useState } from 'react'
import { useJobStore } from '@/lib/stores/job-store'
import { ArrowUpDown, ArrowUp, ArrowDown, GripVertical, Check } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ColumnConfig {
  key: string
  label: string
  width: number
  sortable: boolean
}

const allColumns: ColumnConfig[] = [
  { key: 'select', label: '', width: 50, sortable: false },
  { key: 'type', label: '行业', width: 130, sortable: true },
  { key: 'company', label: '公司', width: 150, sortable: true },
  { key: 'title', label: '岗位名称', width: 300, sortable: true },
  { key: 'department', label: '部门', width: 160, sortable: true },
  { key: 'location', label: '地点', width: 110, sortable: true },
  { key: 'updated_date', label: '更新日期', width: 120, sortable: true },
  { key: 'link', label: '申请链接', width: 90, sortable: false },
]

// 可拖拽的列头组件
interface DraggableHeaderProps {
  col: ColumnConfig
  onSort: (key: string) => void
  onResizeStart: (key: string, startX: number) => void
}

function DraggableHeader({ col, onSort, onResizeStart }: DraggableHeaderProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: col.key,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`relative px-4 py-3 text-left text-sm font-medium text-gray-900 select-none border-b ${
        col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {/* 拖拽手柄 */}
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* 列内容 */}
        {col.key === 'select' ? (
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onSort('select')
            }}
          >
            <SelectAllCheckbox />
          </div>
        ) : (
          <div
            className="flex items-center gap-1 flex-1"
            onClick={() => col.sortable && onSort(col.key)}
          >
            <span>{col.label}</span>
            {col.sortable && <SortIcon columnKey={col.key} />}
          </div>
        )}
      </div>

      {/* 列宽调整手柄 */}
      {col.key !== 'select' && col.key !== 'link' && (
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onResizeStart(col.key, e.clientX)
          }}
        />
      )}
    </th>
  )
}

// 全选复选框
function SelectAllCheckbox() {
  const { isAllSelected, selectedRows, filteredJobs, toggleAllRows } = useJobStore()
  const isChecked = isAllSelected
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected

  return (
    <div className="relative w-5 h-5">
      <input
        type="checkbox"
        checked={isChecked}
        ref={(input) => {
          if (input) {
            input.indeterminate = isIndeterminate
          }
        }}
        onChange={toggleAllRows}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
    </div>
  )
}

// 排序图标
function SortIcon({ columnKey }: { columnKey: string }) {
  const { sortBy, sortDir } = useJobStore()

  if (sortBy !== columnKey) {
    return <ArrowUpDown className="h-3 w-3 text-gray-400" />
  }
  if (sortDir === 'asc') {
    return <ArrowUp className="h-3 w-3 text-blue-600" />
  }
  return <ArrowDown className="h-3 w-3 text-blue-600" />
}

export function TableHeader() {
  const { sortBy, sortDir, columnWidths, columnOrder, setSort, updateColumnWidth, updateColumnOrder } = useJobStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleSort = (columnKey: string) => {
    if (columnKey === 'select') {
      // 全选逻辑在 SelectAllCheckbox 中处理
      return
    }

    let newDir: 'asc' | 'desc' | null = 'asc'

    if (sortBy === columnKey) {
      if (sortDir === 'asc') {
        newDir = 'desc'
      } else if (sortDir === 'desc') {
        newDir = null
      }
    }

    if (newDir === null) {
      setSort('', null)
    } else {
      setSort(columnKey, newDir)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string)
      const newIndex = columnOrder.indexOf(over.id as string)

      const newOrder = arrayMove(columnOrder, oldIndex, newIndex)
      updateColumnOrder(newOrder)
    }
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

  // 根据 columnOrder 过滤并排序列
  const orderedColumns = columnOrder.map((key) => allColumns.find((col) => col.key === key)!).filter(Boolean)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <thead className="bg-gray-50">
        <tr>
          <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
            {orderedColumns.map((col) => (
              <th
                key={col.key}
                style={{ width: `${columnWidths[col.key]}px` }}
              >
                <DraggableHeader col={col} onSort={handleSort} onResizeStart={handleMouseDown} />
              </th>
            ))}
          </SortableContext>
        </tr>
      </thead>
    </DndContext>
  )
}
