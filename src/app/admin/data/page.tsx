'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Upload, Trash2, RefreshCw, Download, Database } from 'lucide-react'

interface DataStats {
  totalJobs: number
  companies: { name: string; count: number }[]
  types: { name: string; count: number }[]
  locations: { name: string; count: number }[]
}

export default function DataPage() {
  const [stats, setStats] = useState<DataStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/data')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: `成功导入 ${data.imported} 条数据` })
        await fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error || '导入失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '导入失败，请重试' })
    }

    setUploading(false)
    e.target.value = '' // 重置文件输入
  }

  const handleClearData = async () => {
    if (!confirm('确定要清空所有岗位数据吗？此操作不可恢复！')) return

    try {
      const res = await fetch('/api/admin/data', {
        method: 'DELETE',
      })

      if (res.ok) {
        setMessage({ type: 'success', text: '数据已清空' })
        await fetchStats()
      } else {
        setMessage({ type: 'error', text: '清空失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败' })
    }
  }

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/data?action=export')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setMessage({ type: 'error', text: '导出失败' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">数据管理</h1>
        <p className="text-gray-600">导入、导出和管理岗位数据</p>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* 数据操作 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              导入数据
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              上传飞书导出的 CSV 文件，系统会自动解析并导入。
            </p>
            <div className="space-y-2">
              <Label htmlFor="csv-file">选择 CSV 文件</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>
            {uploading && (
              <p className="text-sm text-blue-600">正在导入...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              导出数据
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              将当前所有岗位数据导出为 CSV 文件。
            </p>
            <Button onClick={handleExport} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              导出 CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              清空数据
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              删除所有岗位数据。此操作不可恢复！
            </p>
            <Button onClick={handleClearData} variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              清空所有数据
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 数据统计 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              数据统计
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="text-2xl font-bold">
                共 {stats.totalJobs.toLocaleString()} 条岗位数据
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 按公司统计 */}
                <div>
                  <h3 className="font-medium mb-3">按公司</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stats.companies.map((item) => (
                      <div key={item.name} className="flex justify-between text-sm">
                        <span className="truncate">{item.name}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 按行业统计 */}
                <div>
                  <h3 className="font-medium mb-3">按行业</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stats.types.map((item) => (
                      <div key={item.name} className="flex justify-between text-sm">
                        <span className="truncate">{item.name}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 按地点统计 */}
                <div>
                  <h3 className="font-medium mb-3">按地点</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stats.locations.map((item) => (
                      <div key={item.name} className="flex justify-between text-sm">
                        <span className="truncate">{item.name}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">暂无数据</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
