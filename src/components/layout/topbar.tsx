'use client'

import { useState } from 'react'
import { Search, MoreVertical, Filter, ArrowUpDown, Columns, Settings, LogOut, User as UserIcon, Table, Grid3x3, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useJobStore, ViewType } from '@/lib/stores/job-store'
import { AddFieldDialog } from '@/components/add-field-dialog'
import { FieldConfigDialog } from '@/components/field-config-dialog'
import { FilterDialog } from '@/components/filter-dialog'
import type { FieldType } from '@/lib/types/pxcharts'

interface SimpleUser {
  id: string
  email?: string
}

const VIEW_OPTIONS = [
  { id: 'table' as ViewType, label: '表格视图', icon: Table },
  { id: 'kanban' as ViewType, label: '看板视图', icon: Columns },
  { id: 'gallery' as ViewType, label: '画册视图', icon: Grid3x3 },
]

export function Topbar({ user }: { user: SimpleUser }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
  const [isFieldConfigOpen, setIsFieldConfigOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const { currentView, setCurrentView, addField, visibleFields, setVisibleFields, filters, activeFilters } = useJobStore()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleAddField = (field: { id: string; name: string; type: FieldType; options?: string[] }) => {
    addField(field)
  }

  const currentViewOption = VIEW_OPTIONS.find(v => v.id === currentView) || VIEW_OPTIONS[0]
  const CurrentIcon = currentViewOption.icon

  return (
    <div className="h-full flex items-center justify-between px-4">
      {/* 左侧工具栏 */}
      <div className="flex items-center gap-2">
        {/* 视图切换按钮 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CurrentIcon className="h-4 w-4" />
              <span className="font-medium">{currentViewOption.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {VIEW_OPTIONS.map((view) => {
              const Icon = view.icon
              return (
                <DropdownMenuItem
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={currentView === view.id ? 'bg-[#e8f3ff] text-[#0066ff]' : ''}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {view.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 分组按钮 */}
        <Button variant="ghost" size="sm" className="gap-2 text-[#646a73] hover:text-[#1f2329]">
          <Filter className="h-4 w-4" />
          分组
        </Button>

        {/* 筛选按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 text-[#646a73] hover:text-[#1f2329] ${activeFilters ? 'bg-[#e8f3ff] text-[#0066ff]' : ''}`}
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

        {/* 排序按钮 */}
        <Button variant="ghost" size="sm" className="gap-2 text-[#646a73] hover:text-[#1f2329]">
          <ArrowUpDown className="h-4 w-4" />
          排序
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

      {/* 对话框 */}
      <AddFieldDialog
        open={isAddFieldOpen}
        onOpenChange={setIsAddFieldOpen}
        onAddField={handleAddField}
      />
      <FieldConfigDialog
        open={isFieldConfigOpen}
        onOpenChange={setIsFieldConfigOpen}
        visibleFields={visibleFields}
        setVisibleFields={setVisibleFields}
      />
      <FilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />

      {/* 右侧搜索和用户菜单 */}
      <div className="flex items-center gap-3">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8f959e]" />
          <Input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 h-9 text-sm border-[#dee2e6] focus:border-[#0066ff] focus:ring-[#0066ff]"
          />
        </div>

        {/* 更多选项 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MoreVertical className="h-4 w-4 text-[#646a73]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <UserIcon className="h-4 w-4 mr-2" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
