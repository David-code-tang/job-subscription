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
      {/* 工具栏遮挡层 - 白色覆盖但添加设计元素 */}
      <div
        className="absolute top-0 left-0 right-0 bg-white z-10 border-b border-gray-200"
        style={{
          height: '120px',
        }}
        aria-hidden="true"
      >
        {/* 设计内容让遮挡看起来是有意的 */}
        <div className="h-full flex items-center justify-between px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">岗位信息库</h3>
            <p className="text-xs text-gray-400 mt-0.5">实时数据 · 自动同步</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs text-gray-400">最后更新</div>
              <div className="text-sm font-medium text-gray-600">刚刚</div>
            </div>
          </div>
        </div>
      </div>

      {/* iframe - 正常显示 */}
      <iframe
        src={feishuUrl!}
        className="w-full h-full border-0"
        title="岗位列表"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads"
        referrerPolicy="no-referrer"
        allowFullScreen
      />
    </div>
  )
}
