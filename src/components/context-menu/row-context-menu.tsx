'use client'

import { Copy, Trash2, Edit, Plus } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Job } from '@/lib/stores/job-store'

interface RowContextMenuProps {
  children: React.ReactNode
  job: Job
  onCopy?: (job: Job) => void
  onDelete?: (job: Job) => void
  onEdit?: (job: Job) => void
  onInsertAbove?: (job: Job) => void
  onInsertBelow?: (job: Job) => void
}

export function RowContextMenu({
  children,
  job,
  onCopy,
  onDelete,
  onEdit,
  onInsertAbove,
  onInsertBelow,
}: RowContextMenuProps) {
  const handleCopy = () => {
    // 复制行数据到剪贴板
    const rowData = `${job.company}\t${job.title}\t${job.department || ''}\t${job.location || ''}\t${job.type}`
    navigator.clipboard.writeText(rowData)
    onCopy?.(job)
  }

  const handleDelete = () => {
    if (confirm(`确定要删除 "${job.title}" 吗？`)) {
      onDelete?.(job)
    }
  }

  const handleEdit = () => {
    onEdit?.(job)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          复制行
        </ContextMenuItem>

        <ContextMenuItem onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          编辑
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onInsertAbove?.(job)}>
          <Plus className="h-4 w-4 mr-2" />
          在上方插入行
        </ContextMenuItem>

        <ContextMenuItem onClick={() => onInsertBelow?.(job)}>
          <Plus className="h-4 w-4 mr-2" />
          在下方插入行
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          删除行
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
