'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { useJobStore } from '@/lib/stores/job-store'
import { Job } from '@/lib/stores/job-store'

interface EditableCellProps {
  job: Job
  field: keyof Job
  value: any
  renderCell: (job: Job, colKey: string) => React.ReactNode
}

export function EditableCell({ job, field, value, renderCell }: EditableCellProps) {
  const { editingCell, setEditingCell, updateCellValue } = useJobStore()
  const [internalValue, setInternalValue] = useState(value || '')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const isEditing = editingCell?.rowId === job.id && editingCell?.field === field

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setEditingCell({ rowId: job.id, field })
    setInternalValue(value || '')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleSave = async () => {
    if (internalValue !== value) {
      await updateCellValue(job.id, field, internalValue)
    }
    setEditingCell(null)
  }

  const handleCancel = () => {
    setInternalValue(value || '')
    setEditingCell(null)
  }

  const handleBlur = () => {
    // 延迟保存，以便点击其他单元格时可以正常切换
    setTimeout(() => {
      if (editingCell?.rowId === job.id && editingCell?.field === field) {
        handleSave()
      }
    }, 100)
  }

  // 根据字段类型决定使用什么输入组件
  const getInputElement = () => {
    const baseClassName = "w-full px-2 py-1 text-sm border border-[#0066ff] rounded focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:border-transparent bg-white"

    if (field === 'title' || field === 'company') {
      // 使用 Input
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={baseClassName}
        />
      )
    } else if (field === 'location' || field === 'department' || field === 'type') {
      // 使用 Input
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={baseClassName}
        />
      )
    } else {
      // 默认使用 Input
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={baseClassName}
        />
      )
    }
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`min-h-[36px] flex items-center ${isEditing ? 'bg-[#e8f3ff]' : 'cursor-pointer hover:bg-[#f5f6f7]'} rounded transition-colors`}
    >
      {isEditing ? (
        getInputElement()
      ) : (
        renderCell(job, field)
      )}
    </div>
  )
}
