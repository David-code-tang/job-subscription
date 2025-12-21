'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react'

interface User {
  id: string
  email: string
  created_at: string
  subscription?: {
    id: string
    plan_id: string | null
    status: string
    current_period_end: string | null
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    plan_id: 'monthly',
    status: 'active',
    duration: '1', // 月数
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
    setLoading(false)
  }

  const handleOpenDialog = (user: User) => {
    setEditingUser(user)
    if (user.subscription) {
      setFormData({
        plan_id: user.subscription.plan_id || 'monthly',
        status: user.subscription.status,
        duration: '1',
      })
    } else {
      setFormData({
        plan_id: 'monthly',
        status: 'active',
        duration: '1',
      })
    }
    setDialogOpen(true)
  }

  const handleSaveSubscription = async () => {
    if (!editingUser) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateSubscription',
          userId: editingUser.id,
          ...formData,
        }),
      })

      if (res.ok) {
        await fetchUsers()
        setDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to update subscription:', error)
    }
  }

  const handleCancelSubscription = async (userId: string) => {
    if (!confirm('确定要取消该用户的订阅吗？')) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancelSubscription',
          userId,
        }),
      })

      if (res.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('zh-CN')
  }

  const getStatusBadge = (status: string | undefined) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">有效</Badge>
    }
    return <Badge variant="secondary">未订阅</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">用户管理</h1>
        <p className="text-gray-600">管理用户订阅状态</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>用户列表</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索邮箱..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">邮箱</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">注册时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">订阅状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">套餐</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">到期时间</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(user.subscription?.status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.subscription?.plan_id || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(user.subscription?.current_period_end || null)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.subscription?.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelSubscription(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  没有找到用户
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑订阅对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑订阅</DialogTitle>
            <DialogDescription>
              为用户 {editingUser?.email} 设置订阅
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>订阅套餐</Label>
              <Select
                value={formData.plan_id}
                onValueChange={(value) => setFormData({ ...formData, plan_id: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">月度会员 - ¥49</SelectItem>
                  <SelectItem value="quarterly">季度会员 - ¥129</SelectItem>
                  <SelectItem value="biannual">半年会员 - ¥239</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>订阅时长（月）</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 个月</SelectItem>
                  <SelectItem value="3">3 个月</SelectItem>
                  <SelectItem value="6">6 个月</SelectItem>
                  <SelectItem value="12">12 个月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>订阅状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">有效</SelectItem>
                  <SelectItem value="inactive">无效</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveSubscription}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
