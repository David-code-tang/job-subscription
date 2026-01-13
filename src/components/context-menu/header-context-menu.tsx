'use client'

import { ArrowUp, ArrowDown, EyeOff, Columns } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface HeaderContextMenuProps {
  children: React.ReactNode
  columnKey: string
  onSortAsc?: (columnKey: string) => void
  onSortDesc?: (columnKey: string) => void
  onHide?: (columnKey: string) => void
  onFreeze?: (columnKey: string) => void
}

export function HeaderContextMenu({
  children,
  columnKey,
  onSortAsc,
  onSortDesc,
  onHide,
  onFreeze,
}: HeaderContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onSortAsc?.(columnKey)}>
          <ArrowUp className="h-4 w-4 mr-2" />
          升序排列
        </ContextMenuItem>

        <ContextMenuItem onClick={() => onSortDesc?.(columnKey)}>
          <ArrowDown className="h-4 w-4 mr-2" />
          降序排列
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onFreeze?.(columnKey)}>
          <Columns className="h-4 w-4 mr-2" />
          冻结列
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onHide?.(columnKey)}>
          <EyeOff className="h-4 w-4 mr-2" />
          隐藏列
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
