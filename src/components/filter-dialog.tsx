'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useJobStore } from '@/lib/stores/job-store'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterDialog({ open, onOpenChange }: FilterDialogProps) {
  const { jobs, filterConfig, setFilterConfig, setFilters } = useJobStore()
  const [localFilters, setLocalFilters] = useState({
    keyword: '',
    types: [] as string[],
    companies: [] as string[],
    departments: [] as string[],
    locations: [] as string[],
  })

  // 当对话框打开时，从 store 初始化本地筛选
  useEffect(() => {
    if (open) {
      const currentFilters = useJobStore.getState().filters
      setLocalFilters({
        keyword: currentFilters.keyword || '',
        types: currentFilters.types || [],
        companies: currentFilters.companies || [],
        departments: currentFilters.departments || [],
        locations: currentFilters.locations || [],
      })
    }
  }, [open])

  // 从所有 jobs 中提取唯一值
  const types = Array.from(new Set(jobs.map((job) => job.type).filter((t): t is string => Boolean(t))))
  const companies = Array.from(new Set(jobs.map((job) => job.company).filter((t): t is string => Boolean(t))))
  const departments = Array.from(new Set(jobs.map((job) => job.department).filter((t): t is string => Boolean(t))))
  const locations = Array.from(new Set(jobs.map((job) => job.location).filter((t): t is string => Boolean(t))))

  const handleApplyFilter = () => {
    setFilters(localFilters)
    onOpenChange(false)
  }

  const handleClearFilter = () => {
    const emptyFilters = {
      keyword: '',
      types: [],
      companies: [],
      departments: [],
      locations: [],
    }
    setLocalFilters(emptyFilters)
    setFilters(emptyFilters)
    onOpenChange(false)
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
  }

  const hasActiveFilters =
    localFilters.keyword ||
    localFilters.types.length > 0 ||
    localFilters.companies.length > 0 ||
    localFilters.departments.length > 0 ||
    localFilters.locations.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>筛选岗位</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* 关键词搜索 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-keyword" className="text-right">
              关键词
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="filter-keyword"
                placeholder="搜索岗位名称..."
                value={localFilters.keyword}
                onChange={(e) => setLocalFilters({ ...localFilters, keyword: e.target.value })}
              />
              {localFilters.keyword && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setLocalFilters({ ...localFilters, keyword: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* 行业 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">行业</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {types.map((type) => (
                <Badge
                  key={type}
                  variant={localFilters.types.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      types: toggleArrayItem(localFilters.types, type),
                    })
                  }
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* 公司 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">公司</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {companies.slice(0, 10).map((company) => (
                <Badge
                  key={company}
                  variant={localFilters.companies.includes(company) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      companies: toggleArrayItem(localFilters.companies, company),
                    })
                  }
                >
                  {company}
                </Badge>
              ))}
              {companies.length > 10 && (
                <span className="text-sm text-gray-500">+{companies.length - 10} 更多</span>
              )}
            </div>
          </div>

          {/* 部门 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">部门</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {departments.map((department) => (
                <Badge
                  key={department}
                  variant={localFilters.departments.includes(department) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      departments: toggleArrayItem(localFilters.departments, department),
                    })
                  }
                >
                  {department}
                </Badge>
              ))}
            </div>
          </div>

          {/* 地点 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">地点</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {locations.map((location) => (
                <Badge
                  key={location}
                  variant={localFilters.locations.includes(location) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      locations: toggleArrayItem(localFilters.locations, location),
                    })
                  }
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClearFilter}>
            清除筛选
          </Button>
          <Button onClick={handleApplyFilter} disabled={!hasActiveFilters}>
            应用筛选 ({hasActiveFilters ? '✓' : '选择条件'})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
