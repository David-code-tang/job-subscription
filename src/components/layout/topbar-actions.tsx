'use client'

import { useJobStore } from '@/lib/stores/job-store'
import { Filter, Settings, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FilterDialog } from '@/components/filter-dialog'
import { FieldConfigDialog } from '@/components/field-config-dialog'
import { AddFieldDialog } from '@/components/add-field-dialog'

interface TopBarActionsProps {
  isFilterDialogOpen: boolean
  setIsFilterDialogOpen: (open: boolean) => void
  isFieldConfigOpen: boolean
  setIsFieldConfigOpen: (open: boolean) => void
  isAddFieldOpen: boolean
  setIsAddFieldOpen: (open: boolean) => void
}

export function TopBarActions({
  isFilterDialogOpen,
  setIsFilterDialogOpen,
  isFieldConfigOpen,
  setIsFieldConfigOpen,
  isAddFieldOpen,
  setIsAddFieldOpen,
}: TopBarActionsProps) {
  const { filters, activeFilters, visibleFields, setVisibleFields } = useJobStore()

  const handleAddField = (field: { id: string; name: string; type: any; options?: string[] }) => {
    useJobStore.getState().addField(field)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* 筛选按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 text-[#646a73] hover:text-[#1f2329] ${
            activeFilters ? 'bg-[#e8f3ff] text-[#0066ff]' : ''
          }`}
          onClick={() => setIsFilterDialogOpen(true)}
        >
          <Filter className="h-4 w-4" />
          筛选
          {activeFilters && (
            <Badge className="ml-1 bg-[#0066ff] text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
              <Check className="h-3 w-3" />
            </Badge>
          )}
        </Button>

        {/* 字段配置按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-[#646a73] hover:text-[#1f2329]"
          onClick={() => setIsFieldConfigOpen(true)}
        >
          <Settings className="h-4 w-4" />
          字段
        </Button>

        {/* 添加字段按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-[#646a73] hover:text-[#1f2329]"
          onClick={() => setIsAddFieldOpen(true)}
        >
          <Plus className="h-4 w-4" />
          添加字段
        </Button>
      </div>

      {/* 对话框组件 */}
      <FilterDialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen} />

      {visibleFields && (
        <FieldConfigDialog
          open={isFieldConfigOpen}
          onOpenChange={setIsFieldConfigOpen}
          visibleFields={visibleFields}
          setVisibleFields={setVisibleFields}
        />
      )}

      <AddFieldDialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen} onAddField={handleAddField} />
    </>
  )
}
