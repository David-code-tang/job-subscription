import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/actions'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, AlertCircle } from 'lucide-react'
import { PLANS } from '@/lib/plans'

// 联系方式（后续替换为你的信息）
const WECHAT_ID = '待添加'
const CONTACT_EMAIL = '待添加'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/account')
  }

  const subscription = await getUserSubscription()

  const plan = subscription?.plan_id
    ? PLANS.find(p => p.id === subscription.plan_id)
    : null

  const isActive = subscription?.status === 'active'
  const endDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">账户设置</h1>

        <div className="space-y-6">
          {/* 账户信息 */}
          <Card>
            <CardHeader>
              <CardTitle>账户信息</CardTitle>
              <CardDescription>您的基本账户信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">邮箱</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">注册时间</p>
                <p className="font-medium">
                  {formatDate(new Date(user.created_at))}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 订阅状态 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    订阅状态
                  </CardTitle>
                  <CardDescription>管理您的订阅</CardDescription>
                </div>
                <Badge variant={isActive ? 'default' : 'secondary'}>
                  {isActive ? '有效' : '未订阅'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isActive && plan ? (
                <>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                    <p className="font-semibold">¥{plan.price}</p>
                  </div>

                  {endDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        有效期至：{formatDate(endDate)}
                      </span>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <p className="font-medium text-blue-800 mb-2">续费或修改订阅</p>
                    <p className="text-blue-700">
                      如需续费或修改订阅，请添加微信：<span className="font-medium">{WECHAT_ID}</span>
                    </p>
                    <p className="text-blue-700">
                      或发邮件至：<span className="font-medium">{CONTACT_EMAIL}</span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">您还没有订阅</p>
                  <Link href="/pricing">
                    <Button>查看订阅套餐</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
