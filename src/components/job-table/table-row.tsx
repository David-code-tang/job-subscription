'use client'

import { ExternalLink } from 'lucide-react'
import { Job } from '@/lib/stores/job-store'
import { useJobStore } from '@/lib/stores/job-store'
import { ComponentType } from 'react'
import { RowContextMenu } from '@/components/context-menu/row-context-menu'

interface TableRowProps {
  job: Job
  columnWidths: Record<string, number>
  renderCell: (job: Job, colKey: string) => React.ReactNode
  editableFields?: string[]
  EditableCell?: ComponentType<any>
}

export function TableRow({ job, columnWidths, renderCell, editableFields = [], EditableCell }: TableRowProps) {
  const { columnOrder, selectedRows, toggleRowSelection, setEditingCell, deleteJob, frozenColumns } = useJobStore()
  const isSelected = selectedRows.includes(job.id)

  const handleEdit = () => {
    // 进入第一个可编辑字段的编辑模式
    const firstEditableField = editableFields[0] as keyof Job
    if (firstEditableField) {
      setEditingCell({ rowId: job.id, field: firstEditableField })
    }
  }

  const handleDelete = async () => {
    if (confirm(`确定要删除 "${job.title}" 吗？`)) {
      await deleteJob(job.id)
    }
  }

  // 计算冻结列的左侧偏移量
  let frozenLeft = 0
  const frozenLeftMap: Record<string, number> = {}

  columnOrder.forEach((key) => {
    if (frozenColumns.includes(key)) {
      frozenLeftMap[key] = frozenLeft
      frozenLeft += columnWidths[key]
    }
  })

  return (
    <RowContextMenu
      job={job}
      onEdit={handleEdit}
      onDelete={handleDelete}
    >
      <tr className={`
        group transition-colors duration-150 border-b border-[#dee2e6] last:border-b-0
        ${isSelected
          ? 'bg-[#f0f6ff] hover:bg-[#e8f3ff]'
          : 'hover:bg-[#e8f3ff]'
        }
      `}>
        {columnOrder.map((colKey) => {
          const isFrozen = frozenColumns.includes(colKey)

          if (colKey === 'select') {
            // 选择复选框列
            return (
              <td
                key="select"
                className="px-4 py-3"
                style={{
                  width: `${columnWidths.select}px`,
                  ...(isFrozen ? { position: 'sticky', left: `${frozenLeftMap[colKey]}px`, zIndex: 5, backgroundColor: isSelected ? '#f0f6ff' : 'white' } : {})
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRowSelection(job.id)}
                  className="w-4 h-4 rounded border-[#dee2e6] text-[#0066ff] focus:ring-[#0066ff] focus:ring-offset-0 cursor-pointer"
                />
              </td>
            )
          }

          const isEditable = editableFields.includes(colKey)

          return (
            <td
              key={colKey}
              className={`px-4 py-3 overflow-hidden ${isFrozen ? 'sticky border-r border-r-[#dee2e6]' : ''}`}
              style={{
                width: `${columnWidths[colKey]}px`,
                ...(isFrozen ? {
                  left: `${frozenLeftMap[colKey]}px`,
                  zIndex: 5,
                  backgroundColor: isSelected ? '#f0f6ff' : 'white'
                } : {})
              }}
            >
              {colKey === 'link' ? (
                job.link ? (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-[#f5f6f7] transition-colors"
                    title="在新窗口打开"
                  >
                    <ExternalLink className="h-4 w-4 text-[#0066ff]" />
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )
              ) : isEditable && EditableCell ? (
                <EditableCell
                  job={job}
                  field={colKey as keyof Job}
                  value={job[colKey as keyof Job]}
                  renderCell={renderCell}
                />
              ) : (
                renderCell(job, colKey)
              )}
            </td>
          )
        })}
      </tr>
    </RowContextMenu>
  )
}
