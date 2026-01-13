'use client'

import { useEffect, useState } from 'react'
import { useJobStore } from '@/lib/stores/job-store'
import { Loader2 } from 'lucide-react'

interface DataLoaderProps {
  children: React.ReactNode
}

export function DataLoader({ children }: DataLoaderProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setJobs } = useJobStore()

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
        setJobs(data.jobs || [], data.total || 0)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        console.error('Failed to fetch jobs:', errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [setJobs])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0066ff] mx-auto mb-4" />
          <p className="text-[#646a73]">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载失败: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#0066ff] text-white rounded-md hover:bg-[#0052cc]"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
