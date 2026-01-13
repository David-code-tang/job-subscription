'use client'

import { useState } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { useJobStore, type JobFilters } from '@/lib/stores/job-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function JobFilters() {
  const { filters, setFilters, total } = useJobStore()
  const [localKeyword, setLocalKeyword] = useState(filters.keyword || '')

  // 获取唯一的过滤选项（从所有工作中）
  const { jobs } = useJobStore()

  const uniqueTypes = Array.from(new Set(jobs.map((j) => j.type).filter(Boolean)))
  const uniqueCompanies = Array.from(new Set(jobs.map((j) => j.company).filter(Boolean)))
  const uniqueLocations = Array.from(new Set(jobs.map((j) => j.location).filter((l): l is string => Boolean(l))))
  const uniqueDepartments = Array.from(new Set(jobs.map((j) => j.department).filter((d): d is string => Boolean(d))))

  const handleKeywordChange = (value: string) => {
    setLocalKeyword(value)
    // 防抖处理，500ms 后应用搜索
    const timer = setTimeout(() => {
      setFilters({ ...filters, keyword: value || undefined })
    }, 500)
    return () => clearTimeout(timer)
  }

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setFilters({ ...filters, keyword: localKeyword || undefined })
    }
  }

  const clearAllFilters = () => {
    setFilters({})
    setLocalKeyword('')
  }

  const hasActiveFilters =
    filters.keyword ||
    filters.types?.length ||
    filters.companies?.length ||
    filters.locations?.length ||
    filters.departments?.length

  const filterCount =
    (filters.keyword ? 1 : 0) +
    (filters.types?.length || 0) +
    (filters.companies?.length || 0) +
    (filters.locations?.length || 0) +
    (filters.departments?.length || 0)

  return (
    <div className="bg-white border border-[#dee2e6] rounded-lg p-5 space-y-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#646a73]" />
          <h3 className="font-semibold text-[#1f2329]">筛选条件</h3>
          {hasActiveFilters && (
            <span className="bg-[#e8f3ff] text-[#0066ff] text-xs font-medium px-2 py-0.5 rounded-full">
              {filterCount} 个条件
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-[#646a73] hover:text-[#1f2329] h-8"
          >
            <X className="h-4 w-4 mr-1" />
            清除全部
          </Button>
        )}
      </div>

      {/* 关键词搜索 */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8f959e]" />
        <Input
          type="text"
          placeholder="搜索关键词（公司名、岗位名称）..."
          value={localKeyword}
          onChange={(e) => {
            setLocalKeyword(e.target.value)
            // 实时搜索，300ms 防抖
            const timer = setTimeout(() => {
              setFilters({ ...filters, keyword: e.target.value || undefined })
            }, 300)
            return () => clearTimeout(timer)
          }}
          onKeyDown={handleKeywordKeyDown}
          className="pl-10 h-10 border-[#dee2e6] focus:border-[#0066ff] focus:ring-[#0066ff]"
        />
        {localKeyword && (
          <button
            onClick={() => {
              setLocalKeyword('')
              setFilters({ ...filters, keyword: undefined })
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f959e] hover:text-[#646a73]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 快速筛选标签 */}
      <div className="flex flex-wrap gap-2">
        {uniqueTypes.slice(0, 5).map((type) => (
          <button
            key={type}
            onClick={() => {
              const currentTypes = filters.types || []
              const newTypes = currentTypes.includes(type)
                ? currentTypes.filter((t) => t !== type)
                : [...currentTypes, type]
              setFilters({ ...filters, types: newTypes.length ? newTypes : undefined })
            }}
            className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
              filters.types?.includes(type)
                ? 'border-[#0066ff] bg-[#e8f3ff] text-[#0066ff] font-medium'
                : 'border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 高级筛选（展开/收起） */}
      <div className="pt-2 border-t space-y-3">
        {/* 公司筛选 */}
        {uniqueCompanies.length > 0 && (
          <div>
            <label className="text-sm font-medium text-[#646a73] mb-2 block">公司</label>
            <div className="flex flex-wrap gap-2">
              {uniqueCompanies.slice(0, 10).map((company) => (
                <button
                  key={company}
                  onClick={() => {
                    const currentCompanies = filters.companies || []
                    const newCompanies = currentCompanies.includes(company)
                      ? currentCompanies.filter((c) => c !== company)
                      : [...currentCompanies, company]
                    setFilters({
                      ...filters,
                      companies: newCompanies.length ? newCompanies : undefined,
                    })
                  }}
                  className={`px-3 py-1 text-xs rounded-md border transition-all ${
                    filters.companies?.includes(company)
                      ? 'border-[#6236ff] bg-[#f5f1ff] text-[#6236ff] font-medium'
                      : 'border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6]'
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 地点筛选 */}
        {uniqueLocations.length > 0 && (
          <div>
            <label className="text-sm font-medium text-[#646a73] mb-2 block">地点</label>
            <div className="flex flex-wrap gap-2">
              {uniqueLocations.slice(0, 8).map((location) => (
                <button
                  key={location}
                  onClick={() => {
                    const currentLocations = filters.locations || []
                    const newLocations = currentLocations.includes(location)
                      ? currentLocations.filter((l) => l !== location)
                      : [...currentLocations, location]
                    setFilters({
                      ...filters,
                      locations: newLocations.length ? newLocations : undefined,
                    })
                  }}
                  className={`px-3 py-1 text-xs rounded-md border transition-all ${
                    filters.locations?.includes(location)
                      ? 'border-[#00a670] bg-[#e8ffea] text-[#00a670] font-medium'
                      : 'border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6]'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 部门筛选 */}
        {uniqueDepartments.length > 0 && (
          <div>
            <label className="text-sm font-medium text-[#646a73] mb-2 block">部门</label>
            <div className="flex flex-wrap gap-2">
              {uniqueDepartments.slice(0, 8).map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    const currentDepts = filters.departments || []
                    const newDepts = currentDepts.includes(dept)
                      ? currentDepts.filter((d) => d !== dept)
                      : [...currentDepts, dept]
                    setFilters({
                      ...filters,
                      departments: newDepts.length ? newDepts : undefined,
                    })
                  }}
                  className={`px-3 py-1 text-xs rounded-md border transition-all ${
                    filters.departments?.includes(dept)
                      ? 'border-[#ff8800] bg-[#fff7e8] text-[#ff8800] font-medium'
                      : 'border-[#dee2e6] text-[#646a73] hover:bg-[#f5f6f7] hover:border-[#cdd0d6]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 结果统计 */}
      {hasActiveFilters && (
        <div className="pt-2 border-t text-sm text-[#646a73]">
          找到 <span className="font-semibold text-[#1f2329]">{total}</span> 个岗位
        </div>
      )}
    </div>
  )
}
