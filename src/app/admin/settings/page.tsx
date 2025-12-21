'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Settings, Database, Server, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">系统设置</h1>
        <p className="text-gray-600">配置网站和系统参数</p>
      </div>

      {/* 消息提示 */}
      {saved && (
        <div className="p-4 rounded-lg bg-green-50 text-green-800">
          设置已保存
        </div>
      )}

      {/* 网站信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            网站信息
          </CardTitle>
          <CardDescription>配置网站名称和联系方式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>网站名称</Label>
              <Input defaultValue="岗位订阅" />
            </div>
            <div className="space-y-2">
              <Label>网站描述</Label>
              <Input defaultValue="精选海外岗位信息订阅服务" />
            </div>
            <div className="space-y-2">
              <Label>联系微信</Label>
              <Input placeholder="你的微信号" />
            </div>
            <div className="space-y-2">
              <Label>联系邮箱</Label>
              <Input defaultValue="davidtang.20@outlook.com" />
            </div>
          </div>
          <Button onClick={handleSave}>保存设置</Button>
        </CardContent>
      </Card>

      {/* 订阅价格 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            订阅价格
          </CardTitle>
          <CardDescription>配置各套餐的价格（单位：元）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>月度会员价格</Label>
              <Input type="number" defaultValue="49" />
            </div>
            <div className="space-y-2">
              <Label>季度会员价格</Label>
              <Input type="number" defaultValue="129" />
            </div>
            <div className="space-y-2">
              <Label>半年会员价格</Label>
              <Input type="number" defaultValue="239" />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            注意：修改价格后需要重新部署网站才能生效。价格信息存储在代码中。
          </p>
          <Button onClick={handleSave}>保存设置</Button>
        </CardContent>
      </Card>

      {/* 系统信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            系统信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Supabase 项目</span>
              <Badge variant="secondary">pcuvomojzlwmtkyyhihn</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Vercel 项目</span>
              <Badge variant="secondary">job-subscription</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">网站地址</span>
              <a
                href="https://job-subscription.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                job-subscription.vercel.app
              </a>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">GitHub 仓库</span>
              <a
                href="https://github.com/David-code-tang/job-subscription"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                David-code-tang/job-subscription
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 快捷链接 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            管理链接
          </CardTitle>
          <CardDescription>快速访问各服务的管理后台</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://supabase.com/dashboard/project/pcuvomojzlwmtkyyhihn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Supabase 控制台</h3>
              <p className="text-sm text-gray-600">数据库管理、用户认证</p>
            </a>
            <a
              href="https://vercel.com/davidtangs-projects-d94ac03d/job-subscription"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Vercel 控制台</h3>
              <p className="text-sm text-gray-600">部署管理、域名配置</p>
            </a>
            <a
              href="https://github.com/David-code-tang/job-subscription"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">GitHub 仓库</h3>
              <p className="text-sm text-gray-600">代码管理、版本控制</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
