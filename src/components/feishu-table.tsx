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
    <div className="w-full h-[calc(100vh-140px)] bg-white rounded-lg border overflow-hidden">
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
