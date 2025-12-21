'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

interface JobFiltersProps {
  types: string[]
  companies: string[]
  departments: string[]
  locations: string[]
}

export function JobFilters({ types, companies, departments, locations }: JobFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete('page') // 重置页码
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (name: string, value: string) => {
    router.push(`/dashboard?${createQueryString(name, value)}`)
  }

  const handleSearch = () => {
    router.push(`/dashboard?${createQueryString('search', search)}`)
  }

  const handleClearFilters = () => {
    setSearch('')
    router.push('/dashboard')
  }

  const hasFilters = searchParams.toString() !== ''

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* 搜索框 */}
        <div className="flex-1 min-w-[200px] flex gap-2">
          <Input
            placeholder="搜索岗位名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* 行业筛选 */}
        <Select
          value={searchParams.get('type') || 'all'}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="行业类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部行业</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 公司筛选 */}
        <Select
          value={searchParams.get('company') || 'all'}
          onValueChange={(value) => handleFilterChange('company', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="公司" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部公司</SelectItem>
            {companies.slice(0, 50).map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 部门筛选 */}
        <Select
          value={searchParams.get('department') || 'all'}
          onValueChange={(value) => handleFilterChange('department', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="部门" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部部门</SelectItem>
            {departments.slice(0, 50).map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 地点筛选 */}
        <Select
          value={searchParams.get('location') || 'all'}
          onValueChange={(value) => handleFilterChange('location', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="工作地点" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部地点</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 清除筛选 */}
        {hasFilters && (
          <Button variant="ghost" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-1" />
            清除筛选
          </Button>
        )}
      </div>
    </div>
  )
}
