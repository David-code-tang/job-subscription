'use client'

import { useEffect, useState } from 'react'
import { SheetComponent } from '@antv/s2-react'
import '@antv/s2-react/dist/style.min.css'

interface Job {
  id: string
  type: string
  company: string
  title: string
  updated_date: string | null
  department: string | null
  link: string | null
  location: string | null
}

export function S2Table() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs')

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login?redirect=/dashboard'
            return
          }
          if (response.status === 403) {
            window.location.href = '/pricing'
            return
          }
          throw new Error('Failed to load jobs')
        }

        const data = await response.json()
        setJobs(data.jobs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-140px)] flex items-center justify-center bg-white rounded-lg border">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-white rounded-lg border">
        <div className="text-red-500 text-center">
          加载失败: {error}
        </div>
      </div>
    )
  }

  // 转换数据为 S2 需要的格式
  const s2Data = jobs.map(job => ({
    id: job.id,
    '行业': job.type,
    '公司': job.company,
    '岗位名称': job.title,
    '部门': job.department || '-',
    '地点': job.location || '-',
    '更新日期': job.updated_date || '-',
    '链接': job.link || '-',
  }))

  // S2 数据配置
  const dataCfg = {
    fields: {
      columns: ['行业', '公司', '岗位名称', '部门', '地点', '更新日期', '链接'],
    },
    data: s2Data,
  }

  // S2 选项配置 - 飞书风格
  const options = {
    width: '100%',
    height: 'calc(100vh-140px)',
    showSeriesNumber: true,
    // 飞书风格配色
    theme: {
      name: 'default',
      background: '#ffffff',
      cornerCell: {
        backgroundColor: '#f5f6f7',
        bolderColor: '#dddddd',
        color: '#1f2329',
        fontSize: 14,
        fontWeight: 'normal',
      },
      rowCell: {
        backgroundColor: '#ffffff',
        backgroundColorDisable: '#f5f6f7',
        backgroundColorFocus: '#e8f3ff',
        bolderColor: '#dee2e6',
        color: '#1f2329',
        colorDisable: '#8f959e',
        colorFocus: '#0066ff',
        fontSize: 14,
        fontWeight: 'normal',
      },
      colCell: {
        backgroundColor: '#f5f6f7',
        backgroundColorFocus: '#e8f3ff',
        bolderColor: '#dee2e6',
        color: '#1f2329',
        colorFocus: '#0066ff',
        fontSize: 14,
        fontWeight: 500,
      },
      dataCell: {
        backgroundColor: '#ffffff',
        backgroundColorFocus: '#e8f3ff',
        bolderColor: '#dee2e6',
        color: '#1f2329',
        fontSize: 14,
      },
      scrollBar: {
        thumbColor: '#c9cdd4',
        thumbHoverColor: '#a8abb2',
        trackColor: '#f5f6f7',
      },
    },
    // 交互配置
    interaction: {
      hoverHighlight: true,
      linkFields: ['链接'],
    },
    // 显示配置
    pagination: {
      pageSize: 20,
      current: 1,
    },
    // 样式配置
    style: {
      layoutWidthType: 'compact',
      cellCfg: {
        height: 40,
      },
    },
  }

  return (
    <div className="w-full bg-white rounded-lg border overflow-hidden">
      <SheetComponent
        dataCfg={dataCfg}
        options={options}
        sheetType="table"
        header={{
          title: '岗位信息库',
          export: false,
          advanced: false,
        }}
      />
    </div>
  )
}
