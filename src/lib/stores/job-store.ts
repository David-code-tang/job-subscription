import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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
}

export interface JobFilters {
  keyword?: string
  types?: string[]
  companies?: string[]
  departments?: string[]
  locations?: string[]
}

export type SortDirection = 'asc' | 'desc' | null

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
  selectedRows: string[]

  // 操作方法
  setJobs: (jobs: Job[], total: number) => void
  setFilters: (filters: JobFilters) => void
  clearFilters: () => void
  setSort: (sortBy: string, sortDir: SortDirection) => void
  setPage: (page: number) => void
  updateColumnWidth: (columnId: string, width: number) => void
  toggleRowSelection: (rowId: string) => void
  clearRowSelection: () => void
}

export const useJobStore = create<JobStore>()(
  devtools(
    persist(
      (set, get) => ({
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
          type: 130,
          company: 150,
          title: 300,
          department: 160,
          location: 110,
          updated_date: 120,
          link: 90,
        },
        selectedRows: [],

        // 设置数据
        setJobs: (jobs, total) =>
          set({
            jobs,
            total,
            filteredJobs: jobs, // 初始时显示所有数据
          }),

        // 设置筛选
        setFilters: (filters) =>
          set((state) => {
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

            // 关键词搜索（公司名、岗位名称）
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

            // 行业类型筛选（多选）
            if (newFilters.types && newFilters.types.length > 0) {
              filtered = filtered.filter((job) =>
                newFilters.types!.includes(job.type)
              )
            }

            // 公司筛选（多选）
            if (newFilters.companies && newFilters.companies.length > 0) {
              filtered = filtered.filter((job) =>
                newFilters.companies!.includes(job.company)
              )
            }

            // 部门筛选（多选）
            if (newFilters.departments && newFilters.departments.length > 0) {
              filtered = filtered.filter((job) =>
                job.department && newFilters.departments!.includes(job.department)
              )
            }

            // 地点筛选（多选）
            if (newFilters.locations && newFilters.locations.length > 0) {
              filtered = filtered.filter((job) =>
                job.location && newFilters.locations!.includes(job.location)
              )
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
              page: 1, // 重置到第一页
            }
          }),

        // 清除筛选
        clearFilters: () =>
          set((state) => ({
            filters: {},
            activeFilters: false,
            filteredJobs: state.jobs,
            page: 1,
          })),

        // 设置排序
        setSort: (sortBy, sortDir) =>
          set((state) => {
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
        setPage: (page) => set({ page }),

        // 更新列宽
        updateColumnWidth: (columnId, width) =>
          set((state) => ({
            columnWidths: {
              ...state.columnWidths,
              [columnId]: width,
            },
          })),

        // 切换行选择
        toggleRowSelection: (rowId) =>
          set((state) => {
            const isSelected = state.selectedRows.includes(rowId)
            if (isSelected) {
              return {
                selectedRows: state.selectedRows.filter((id) => id !== rowId),
              }
            } else {
              return {
                selectedRows: [...state.selectedRows, rowId],
              }
            }
          }),

        // 清除行选择
        clearRowSelection: () => set({ selectedRows: [] }),
      }),
      {
        name: 'job-store',
        // 只持久化 UI 状态，不持久化数据
        partialize: (state) => ({
          columnWidths: state.columnWidths,
          sortBy: state.sortBy,
          sortDir: state.sortDir,
        }),
      }
    )
  )
)
