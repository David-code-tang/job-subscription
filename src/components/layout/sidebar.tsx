'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, Settings, Database, ChevronRight, ChevronDown, Search, Plus } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TableInfo {
  id: string
  name: string
  icon: React.ReactNode
  views: ViewInfo[]
}

interface ViewInfo {
  id: string
  name: string
  type: 'table' | 'kanban' | 'gallery'
}

export function Sidebar({ user }: { user: User }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(['jobs']))

  // 模拟数据表
  const tables: TableInfo[] = [
    {
      id: 'jobs',
      name: '岗位信息',
      icon: <Database className="h-4 w-4" />,
      views: [
        { id: 'table', name: '表格视图', type: 'table' },
        { id: 'kanban', name: '看板视图', type: 'kanban' },
        { id: 'gallery', name: '画册视图', type: 'gallery' },
      ],
    },
  ]

  const toggleTable = (tableId: string) => {
    const newExpanded = new Set(expandedTables)
    if (newExpanded.has(tableId)) {
      newExpanded.delete(tableId)
    } else {
      newExpanded.add(tableId)
    }
    setExpandedTables(newExpanded)
  }

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col">
      {/* Logo区域 */}
      <div className="h-14 flex items-center px-4 border-b border-[#dee2e6]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-[#1f2329]">岗位订阅</span>
        </Link>
      </div>

      {/* 搜索框 */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8f959e]" />
          <Input
            type="text"
            placeholder="搜索数据表..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm border-[#dee2e6] focus:border-[#0066ff] focus:ring-[#0066ff]"
          />
        </div>
      </div>

      {/* 数据表列表 */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {filteredTables.map((table) => (
            <div key={table.id}>
              {/* 表名 */}
              <button
                onClick={() => toggleTable(table.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-[#f5f6f7] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-[#646a73]">{table.icon}</div>
                  <span className="font-medium text-[#1f2329]">{table.name}</span>
                </div>
                {expandedTables.has(table.id) ? (
                  <ChevronDown className="h-4 w-4 text-[#8f959e]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#8f959e]" />
                )}
              </button>

              {/* 视图列表 */}
              {expandedTables.has(table.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {table.views.map((view) => (
                    <Link
                      key={view.id}
                      href={`/dashboard?view=${view.id}`}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#646a73] rounded-md hover:bg-[#f5f6f7] transition-colors"
                    >
                      <div className="w-4 h-4 rounded bg-[#e8f3ff] flex items-center justify-center">
                        <span className="text-[10px] text-[#0066ff] font-medium">
                          {view.type === 'table' ? '表' : view.type === 'kanban' ? '看' : '画'}
                        </span>
                      </div>
                      {view.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部用户信息和设置 */}
      <div className="border-t border-[#dee2e6] p-3 space-y-1">
        <Link
          href="/account"
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#646a73] rounded-md hover:bg-[#f5f6f7] transition-colors"
        >
          <Settings className="h-4 w-4" />
          账户设置
        </Link>
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-[#646a73]">
          <div className="w-6 h-6 rounded-full bg-[#0066ff] flex items-center justify-center text-white text-xs">
            {user.email?.[0].toUpperCase()}
          </div>
          <span className="truncate flex-1">{user.email}</span>
        </div>
      </div>
    </div>
  )
}
