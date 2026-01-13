'use client'

import { useJobStore } from '@/lib/stores/job-store'
import { Job } from '@/lib/stores/job-store'
import { TableRow } from './table-row'
import { EditableCell } from './editable-cell'
import { CustomFieldCell } from '@/components/custom-field-cell'

interface TableBodyProps {
  jobs: Job[]
}

export function TableBody({ jobs }: TableBodyProps) {
  const { columnWidths, visibleFields } = useJobStore()

  const renderCell = (job: Job, colKey: string) => {
    // 处理内置字段
    switch (colKey) {
      case 'type':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#e8f3ff] text-[#0066ff]">
            {job.type || '-'}
          </span>
        )
      case 'company':
        return <span className="font-medium text-[#1f2329]">{job.company}</span>
      case 'title':
        return <span className="text-[#1f2329]">{job.title}</span>
      case 'department':
        return <span className="text-[#646a73]">{job.department || '-'}</span>
      case 'location':
        return <span className="text-[#646a73]">{job.location || '-'}</span>
      case 'updated_date':
        return <span className="text-[#646a73] text-sm">{job.updated_date || '-'}</span>
      case 'link':
        return null // 在 TableRow 中特殊处理
      default:
        // ✅ 处理自定义字段
        if (colKey.startsWith('custom_')) {
          const field = visibleFields.find(f => f.id === colKey)
          if (field && job.customFields?.[colKey]) {
            return (
              <CustomFieldCell
                fieldId={colKey}
                fieldType={field.type}
                value={job.customFields[colKey]}
                options={field.options}
                onSave={(value) => {
                  // 更新自定义字段值
                  useJobStore.getState().updateJobCustomField(job.id, colKey, value)
                }}
                className=""
                editMode={false}
              />
            )
          }
        }
        return null
    }
  }

  // 可编辑字段列表 - 包含自定义字段
  const editableFields = ['type', 'company', 'title', 'department', 'location', 'updated_date']

  return (
    <tbody>
      {jobs.map((job) => (
        <TableRow
          key={job.id}
          job={job}
          columnWidths={columnWidths}
          renderCell={renderCell}
          editableFields={editableFields}
          EditableCell={EditableCell}
        />
      ))}
    </tbody>
  )
}
