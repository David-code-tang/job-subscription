'use client'

import { useJobStore } from '@/lib/stores/job-store'
import { Job } from '@/lib/stores/job-store'
import { TableRow } from './table-row'

interface TableBodyProps {
  jobs: Job[]
}

export function TableBody({ jobs }: TableBodyProps) {
  const { columnWidths } = useJobStore()

  const renderCell = (job: Job, colKey: string) => {
    switch (colKey) {
      case 'type':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {job.type || '-'}
          </span>
        )
      case 'company':
        return <span className="font-medium">{job.company}</span>
      case 'title':
        return <span className="text-gray-900">{job.title}</span>
      case 'department':
        return <span className="text-gray-600">{job.department || '-'}</span>
      case 'location':
        return <span className="text-gray-600">{job.location || '-'}</span>
      case 'updated_date':
        return <span className="text-gray-600 text-sm">{job.updated_date || '-'}</span>
      case 'link':
        return null // 在 TableRow 中特殊处理
      default:
        return null
    }
  }

  return (
    <tbody>
      {jobs.map((job) => (
        <TableRow
          key={job.id}
          job={job}
          columnWidths={columnWidths}
          renderCell={renderCell}
        />
      ))}
    </tbody>
  )
}
