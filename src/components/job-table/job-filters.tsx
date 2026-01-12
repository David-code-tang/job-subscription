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
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">筛选条件</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {filterCount} 个条件
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-900 h-8"
          >
            <X className="h-4 w-4 mr-1" />
            清除全部
          </Button>
        )}
      </div>

      {/* 关键词搜索 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
          className="pl-9"
        />
        {localKeyword && (
          <button
            onClick={() => {
              setLocalKeyword('')
              setFilters({ ...filters, keyword: undefined })
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filters.types?.includes(type)
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
            <label className="text-sm font-medium text-gray-700 mb-2 block">公司</label>
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
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.companies?.includes(company)
                      ? 'bg-purple-50 border-purple-300 text-purple-700 font-medium'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
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
            <label className="text-sm font-medium text-gray-700 mb-2 block">地点</label>
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
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.locations?.includes(location)
                      ? 'bg-green-50 border-green-300 text-green-700 font-medium'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
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
            <label className="text-sm font-medium text-gray-700 mb-2 block">部门</label>
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
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.departments?.includes(dept)
                      ? 'bg-orange-50 border-orange-300 text-orange-700 font-medium'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
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
        <div className="pt-2 border-t text-sm text-gray-600">
          找到 <span className="font-semibold text-gray-900">{total}</span> 个岗位
        </div>
      )}
    </div>
  )
}
