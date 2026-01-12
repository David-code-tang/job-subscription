'use client'

import { useJobStore } from '@/lib/stores/job-store'

export function TableSkeleton() {
  const { columnWidths, columnOrder } = useJobStore()

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* 表头骨架 */}
      <div className="bg-gray-50 border-b flex">
        {columnOrder.map((colKey) => (
          <div
            key={colKey}
            className="px-4 py-3 animate-pulse"
            style={{ width: `${columnWidths[colKey]}px` }}
          >
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* 表格行骨架 */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="flex border-b last:border-b-0">
          {columnOrder.map((colKey) => (
            <div
              key={colKey}
              className="px-4 py-3 animate-pulse"
              style={{ width: `${columnWidths[colKey]}px` }}
            >
              {colKey === 'select' ? (
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
              ) : colKey === 'link' ? (
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              ) : colKey === 'type' ? (
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
              ) : (
                <div className="h-4 bg-gray-300 rounded w-full max-w-[200px]"></div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
