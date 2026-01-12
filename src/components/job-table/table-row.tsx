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
  const columns = ['type', 'company', 'title', 'department', 'location', 'updated_date', 'link']

  return (
    <tr className="hover:bg-blue-50 transition-colors border-b last:border-b-0">
      {columns.map((col) => (
        <td
          key={col}
          className="px-4 py-3 overflow-hidden"
          style={{ width: `${columnWidths[col]}px` }}
        >
          {col === 'link' ? (
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
            renderCell(job, col)
          )}
        </td>
      ))}
    </tr>
  )
}
