'use client'

import { ExternalLink } from 'lucide-react'
import { Job } from '@/lib/stores/job-store'
import { useJobStore } from '@/lib/stores/job-store'

interface TableRowProps {
  job: Job
  columnWidths: Record<string, number>
  renderCell: (job: Job, colKey: string) => React.ReactNode
}

export function TableRow({ job, columnWidths, renderCell }: TableRowProps) {
  const { columnOrder, selectedRows, toggleRowSelection } = useJobStore()
  const isSelected = selectedRows.includes(job.id)

  return (
    <tr className={`hover:bg-blue-50 transition-colors border-b last:border-b-0 ${isSelected ? 'bg-blue-50' : ''}`}>
      {columnOrder.map((colKey) => {
        if (colKey === 'select') {
          // 选择复选框列
          return (
            <td
              key="select"
              className="px-4 py-3"
              style={{ width: `${columnWidths.select}px` }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleRowSelection(job.id)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </td>
          )
        }

        return (
          <td
            key={colKey}
            className="px-4 py-3 overflow-hidden"
            style={{ width: `${columnWidths[colKey]}px` }}
          >
            {colKey === 'link' ? (
              job.link ? (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
                  title="在新窗口打开"
                >
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                </a>
              ) : (
                <span className="text-gray-400">-</span>
              )
            ) : (
              renderCell(job, colKey)
            )}
          </td>
        )
      })}
    </tr>
  )
}
