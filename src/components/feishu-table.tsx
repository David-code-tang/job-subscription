'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

export function FeishuTable() {
  const [feishuUrl, setFeishuUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeishuUrl() {
      try {
        const response = await fetch('/api/feishu/proxy')

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login?redirect=/dashboard'
            return
          }
          if (response.status === 403) {
            window.location.href = '/pricing'
            return
          }
          throw new Error('Failed to load Feishu table')
        }

        const data = await response.json()
        setFeishuUrl(data.url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchFeishuUrl()
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

  return (
    <div className="w-full h-[calc(100vh-140px)] bg-white rounded-lg border overflow-hidden relative">
      {/* 工具栏遮挡层 - 设计为看起来像表格的标题栏 */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none bg-white border-b border-gray-200"
        style={{
          height: '120px',
          paddingTop: '16px',
          paddingLeft: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        }}
        aria-hidden="true"
      >
        {/* 模拟表格标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">岗位信息</h2>
            <p className="text-sm text-gray-500 mt-1">实时更新 · 数据来源于飞书多维表格</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              实时同步
            </span>
          </div>
        </div>
      </div>

      {/* iframe - 向下偏移 120px */}
      <div
        className="absolute inset-0"
        style={{ marginTop: '120px' }}
      >
        <iframe
          src={feishuUrl!}
          className="w-full h-full border-0"
          style={{ height: 'calc(100% + 120px)' }}
          title="岗位列表"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads"
          referrerPolicy="no-referrer"
          allowFullScreen
        />
      </div>
    </div>
  )
}
