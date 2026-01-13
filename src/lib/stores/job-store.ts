import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { CustomFieldValue, FieldConfig, FilterConfig, SortConfig, ViewConfig } from '@/lib/types/pxcharts'

// 数据类型定义
export interface Job {
  id: string
  type: string
  company: string
  title: string
  updated_date: string | null
  department: string | null
  link: string | null
  location: string | null
  // ✅ 新增：支持自定义字段
  customFields?: Record<string, CustomFieldValue>
}

export interface JobFilters {
  keyword?: string
  types?: string[]
  companies?: string[]
  departments?: string[]
  locations?: string[]
}

export type SortDirection = 'asc' | 'desc' | null

// 视图类型
export type ViewType = 'table' | 'kanban' | 'gallery'

// 编辑单元格状态
export interface EditingCell {
  rowId: string
  field: string
}

interface JobStore {
  // 数据状态
  jobs: Job[]
  filteredJobs: Job[]
  total: number

  // 筛选状态
  filters: JobFilters
  activeFilters: boolean

  // 排序状态
  sortBy: string
  sortDir: SortDirection

  // 分页状态
  page: number
  pageSize: number

  // UI 状态
  columnWidths: Record<string, number>
  columnOrder: string[]
  selectedRows: string[]
  isAllSelected: boolean
  frozenColumns: string[]  // 冻结的列
  currentView: ViewType  // 当前视图类型

  // 编辑状态
  editingCell: EditingCell | null

  // ✅ 新增：pxcharts 风格的配置状态
  viewConfig: ViewConfig
  filterConfig: FilterConfig
  sortConfig: SortConfig
  groupBy: string
  visibleFields: FieldConfig[]

  // 操作方法
  setJobs: (jobs: Job[], total: number) => void
  setFilters: (filters: JobFilters) => void
  clearFilters: () => void
  setSort: (sortBy: string, sortDir: SortDirection) => void
  setPage: (page: number) => void
  updateColumnWidth: (columnId: string, width: number) => void
  updateColumnOrder: (columnOrder: string[]) => void
  toggleRowSelection: (rowId: string) => void
  toggleAllRows: () => void
  clearRowSelection: () => void
  setEditingCell: (cell: EditingCell | null) => void
  updateCellValue: (rowId: string, field: string, value: any) => Promise<void>
  deleteJob: (rowId: string) => Promise<void>
  toggleFrozenColumn: (columnKey: string) => void
  setCurrentView: (view: ViewType) => void

  // ✅ 新增：pxcharts 核心方法
  // 视图配置管理
  updateViewConfig: (updates: Partial<ViewConfig>) => void

  // 字段管理
  addField: (field: { id: string; name: string; type: FieldConfig['type']; options?: string[] }) => void
  updateFieldType: (fieldId: string, type: FieldConfig['type']) => void
  setVisibleFields: (fields: FieldConfig[]) => void

  // 自定义字段值更新
  updateJobCustomField: (jobId: string, fieldId: string, value: any) => Promise<void>

  // 高级筛选和排序
  setFilterConfig: (config: FilterConfig) => void
  setSortConfig: (config: SortConfig) => void

  // 分组管理
  setGroupBy: (field: string) => void
}

// Store 配置
const storeConfig: any = (set: any, get: any) => ({
  // 初始状态
  jobs: [],
  filteredJobs: [],
  total: 0,
  filters: {},
  activeFilters: false,
  sortBy: 'updated_date',
  sortDir: 'desc',
  page: 1,
  pageSize: 20,
  columnWidths: {
    select: 50,
    type: 130,
    company: 150,
    title: 300,
    department: 160,
    location: 110,
    updated_date: 120,
    link: 90,
  },
  columnOrder: ['select', 'type', 'company', 'title', 'department', 'location', 'updated_date', 'link'],
  selectedRows: [],
  isAllSelected: false,
  frozenColumns: [],
  currentView: 'table' as ViewType,
  editingCell: null,

  // ✅ 新增：pxcharts 风格的初始配置
  viewConfig: {
    rowHeight: '中等' as const,
    editMode: false,
    expandedGroups: {},
    expandedTasks: {},
    headerDraggable: false,
  },
  filterConfig: {
    conditions: [],
    isActive: false,
  },
  sortConfig: {
    rules: [],
    isActive: false,
  },
  groupBy: 'department',
  visibleFields: [
    { id: 'select', name: '选择', visible: true, width: 50, type: '复选' as const },
    { id: 'type', name: '行业', visible: true, width: 130, type: '标签' as const },
    { id: 'company', name: '公司', visible: true, width: 150, type: '文本' as const },
    { id: 'title', name: '岗位', visible: true, width: 300, type: '文本' as const },
    { id: 'department', name: '部门', visible: true, width: 160, type: '文本' as const },
    { id: 'location', name: '地点', visible: true, width: 110, type: '文本' as const },
    { id: 'updated_date', name: '更新时间', visible: true, width: 120, type: '日期' as const },
    { id: 'link', name: '链接', visible: true, width: 90, type: '链接' as const },
  ],

  // 设置数据
  setJobs: (jobs: Job[], total: number) =>
    set((_state: JobStore) => {
      // ✅ 转换字段名：custom_fields -> customFields
      const processedJobs = jobs.map((job: any) => ({
        ...job,
        customFields: job.custom_fields || undefined,
      }))

      return {
        jobs: processedJobs,
        total,
        filteredJobs: processedJobs,
      }
    }),

  // 设置筛选
  setFilters: (filters: JobFilters) =>
    set((state: JobStore) => {
      const newFilters = { ...state.filters, ...filters }

      // 检查是否有激活的过滤器
      const hasActiveFilters =
        (newFilters.keyword && newFilters.keyword.trim() !== '') ||
        (newFilters.types && newFilters.types.length > 0) ||
        (newFilters.companies && newFilters.companies.length > 0) ||
        (newFilters.departments && newFilters.departments.length > 0) ||
        (newFilters.locations && newFilters.locations.length > 0)

      // 应用筛选
      let filtered = state.jobs

      // 关键词搜索
      if (newFilters.keyword && newFilters.keyword.trim() !== '') {
        const keyword = newFilters.keyword.toLowerCase().trim()
        filtered = filtered.filter((job) => {
          return (
            job.company?.toLowerCase().includes(keyword) ||
            job.title?.toLowerCase().includes(keyword) ||
            job.type?.toLowerCase().includes(keyword) ||
            job.department?.toLowerCase().includes(keyword) ||
            job.location?.toLowerCase().includes(keyword)
          )
        })
      }

      // 行业类型筛选
      if (newFilters.types && newFilters.types.length > 0) {
        filtered = filtered.filter((job) => newFilters.types!.includes(job.type))
      }

      // 公司筛选
      if (newFilters.companies && newFilters.companies.length > 0) {
        filtered = filtered.filter((job) => newFilters.companies!.includes(job.company))
      }

      // 部门筛选
      if (newFilters.departments && newFilters.departments.length > 0) {
        filtered = filtered.filter((job) => job.department && newFilters.departments!.includes(job.department))
      }

      // 地点筛选
      if (newFilters.locations && newFilters.locations.length > 0) {
        filtered = filtered.filter((job) => job.location && newFilters.locations!.includes(job.location))
      }

      // 应用排序
      if (state.sortBy && state.sortDir) {
        filtered = [...filtered].sort((a, b) => {
          const aVal = a[state.sortBy as keyof Job] || ''
          const bVal = b[state.sortBy as keyof Job] || ''
          if (state.sortDir === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
      }

      return {
        filters: newFilters,
        activeFilters: hasActiveFilters,
        filteredJobs: filtered,
        page: 1,
      }
    }),

  // 清除筛选
  clearFilters: () =>
    set((state: JobStore) => ({
      filters: {},
      activeFilters: false,
      filteredJobs: state.jobs,
      page: 1,
    })),

  // 设置排序
  setSort: (sortBy: string, sortDir: SortDirection) =>
    set((state: JobStore) => {
      let sorted = [...state.filteredJobs]

      if (sortDir) {
        sorted.sort((a, b) => {
          const aVal = a[sortBy as keyof Job] || ''
          const bVal = b[sortBy as keyof Job] || ''
          if (sortDir === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
      }

      return {
        sortBy,
        sortDir,
        filteredJobs: sorted,
      }
    }),

  // 设置分页
  setPage: (page: number) => set({ page }),

  // 更新列宽
  updateColumnWidth: (columnId: string, width: number) =>
    set((state: JobStore) => ({
      columnWidths: {
        ...state.columnWidths,
        [columnId]: width,
      },
    })),

  // 更新列顺序
  updateColumnOrder: (columnOrder: string[]) =>
    set({
      columnOrder,
    }),

  // 切换单行选择
  toggleRowSelection: (rowId: string) =>
    set((state: JobStore) => {
      const isSelected = state.selectedRows.includes(rowId)
      const newSelected = isSelected ? state.selectedRows.filter((id) => id !== rowId) : [...state.selectedRows, rowId]
      return {
        selectedRows: newSelected,
        isAllSelected: newSelected.length === state.filteredJobs.length && state.filteredJobs.length > 0,
      }
    }),

  // 切换全选
  toggleAllRows: () =>
    set((state: JobStore) => {
      if (state.isAllSelected) {
        return {
          selectedRows: [],
          isAllSelected: false,
        }
      } else {
        return {
          selectedRows: state.filteredJobs.map((job) => job.id),
          isAllSelected: true,
        }
      }
    }),

  // 清除行选择
  clearRowSelection: () => set({ selectedRows: [], isAllSelected: false }),

  // 设置编辑单元格
  setEditingCell: (cell: EditingCell | null) => set({ editingCell: cell }),

  // 更新单元格值
  updateCellValue: async (rowId: string, field: string, value: any) => {
    try {
      // 调用 API 更新数据库
      const response = await fetch('/api/jobs/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: rowId,
          field,
          value,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update job')
      }

      // 更新本地状态
      const { jobs, filteredJobs } = get()
      const updatedJobs = jobs.map((job: Job) =>
        job.id === rowId ? { ...job, [field]: value } : job
      )
      const updatedFilteredJobs = filteredJobs.map((job: Job) =>
        job.id === rowId ? { ...job, [field]: value } : job
      )

      set({
        jobs: updatedJobs,
        filteredJobs: updatedFilteredJobs,
      })
    } catch (error) {
      console.error('Error updating job:', error)
      throw error
    }
  },

  // 删除工作
  deleteJob: async (rowId: string) => {
    try {
      // 调用 API 删除数据
      const response = await fetch('/api/jobs/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: rowId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete job')
      }

      // 更新本地状态
      const { jobs, filteredJobs } = get()
      const updatedJobs = jobs.filter((job: Job) => job.id !== rowId)
      const updatedFilteredJobs = filteredJobs.filter((job: Job) => job.id !== rowId)

      set({
        jobs: updatedJobs,
        filteredJobs: updatedFilteredJobs,
        total: updatedJobs.length,
      })
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  },

  // 切换列冻结
  toggleFrozenColumn: (columnKey: string) =>
    set((state: JobStore) => {
      const isFrozen = state.frozenColumns.includes(columnKey)
      return {
        frozenColumns: isFrozen
          ? state.frozenColumns.filter((col) => col !== columnKey)
          : [...state.frozenColumns, columnKey],
      }
    }),

  // 设置当前视图
  setCurrentView: (view: ViewType) => set({ currentView: view }),

  // ✅ 新增：更新视图配置
  updateViewConfig: (updates: Partial<ViewConfig>) =>
    set((state: JobStore) => ({
      viewConfig: {
        ...state.viewConfig,
        ...updates,
      },
    })),

  // ✅ 新增：添加字段
  addField: (field: { id: string; name: string; type: FieldConfig['type']; options?: string[] }) =>
    set((state: JobStore) => {
      // 检查字段ID是否已存在
      if (state.visibleFields.some((f) => f.id === field.id)) {
        return state
      }

      // 创建新字段配置
      const newField: FieldConfig = {
        id: field.id,
        name: field.name,
        visible: true,
        width: 150,
        type: field.type,
        options: field.options,
      }

      return {
        visibleFields: [...state.visibleFields, newField],
        columnOrder: [...state.columnOrder, field.id],
        columnWidths: {
          ...state.columnWidths,
          [field.id]: 150,
        },
      }
    }),

  // ✅ 新增：更新字段类型
  updateFieldType: (fieldId: string, type: FieldConfig['type']) =>
    set((state: JobStore) => ({
      visibleFields: state.visibleFields.map((field) =>
        field.id === fieldId ? { ...field, type } : field
      ),
    })),

  // ✅ 新增：设置可见字段
  setVisibleFields: (fields: FieldConfig[]) =>
    set({
      visibleFields: fields,
    }),

  // ✅ 新增：更新自定义字段值
  updateJobCustomField: async (jobId: string, fieldId: string, value: any) => {
    try {
      // 调用 API 更新数据库
      const response = await fetch('/api/jobs/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: jobId,
          field: `customFields.${fieldId}`,
          value,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update custom field')
      }

      // 更新本地状态
      const { jobs, filteredJobs, visibleFields } = get()
      const fieldType = visibleFields.find((f: FieldConfig) => f.id === fieldId)?.type || '文本'

      const updateJob = (job: Job) => {
        if (job.id === jobId) {
          return {
            ...job,
            customFields: {
              ...job.customFields,
              [fieldId]: { type: fieldType, value },
            },
          }
        }
        return job
      }

      set({
        jobs: jobs.map(updateJob),
        filteredJobs: filteredJobs.map(updateJob),
      })
    } catch (error) {
      console.error('Error updating custom field:', error)
      throw error
    }
  },

  // ✅ 新增：设置筛选配置
  setFilterConfig: (config: FilterConfig) =>
    set({
      filterConfig: config,
    }),

  // ✅ 新增：设置排序配置
  setSortConfig: (config: SortConfig) =>
    set({
      sortConfig: config,
    }),

  // ✅ 新增：设置分组字段
  setGroupBy: (field: string) =>
    set({
      groupBy: field,
    }),
})

// 持久化配置
const persistConfig = {
  name: 'job-store',
  partialize: (state: JobStore) => ({
    columnWidths: state.columnWidths,
    columnOrder: state.columnOrder,
    sortBy: state.sortBy,
    sortDir: state.sortDir,
    currentView: state.currentView,
    frozenColumns: state.frozenColumns,
    // ✅ 新增持久化字段
    viewConfig: state.viewConfig,
    visibleFields: state.visibleFields,
    filterConfig: state.filterConfig,
    sortConfig: state.sortConfig,
    groupBy: state.groupBy,
  }),
}

// 创建 store
export const useJobStore = create<JobStore>()(
  devtools(
    typeof window !== 'undefined'
      ? persist(storeConfig, persistConfig)
      : storeConfig
  )
)
