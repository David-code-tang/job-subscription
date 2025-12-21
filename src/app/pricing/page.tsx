'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Briefcase, Copy, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/lib/plans'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const features = [
  '访问全部 10,000+ 岗位信息',
  '按公司、部门、地点筛选',
  '关键词搜索',
  '每日数据更新',
  '一键跳转申请链接',
]

// 微信收款信息（后续替换为你的微信）
const WECHAT_ID = '待添加' // 你的微信号
const CONTACT_EMAIL = '待添加' // 你的邮箱

function PricingContent() {
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/login?redirect=/pricing`)
      return
    }

    // 显示付款弹窗
    setSelectedPlan(plan)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">JobHub</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">登录</Button>
            </Link>
            <Link href="/register">
              <Button>注册</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">选择您的订阅套餐</h1>
          <p className="text-xl text-gray-600">
            解锁全部岗位信息，开启求职之旅
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                  最受欢迎
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">¥{plan.price}</span>
                  <span className="text-gray-500">
                    /{plan.duration === 1 ? '月' : `${plan.duration}月`}
                  </span>
                </div>
                {plan.duration > 1 && (
                  <p className="text-sm text-green-600 mt-2">
                    相当于 ¥{Math.round(plan.price / plan.duration)}/月
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleSubscribe(plan)}
                >
                  立即订阅
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">如何付款？</h3>
              <p className="text-gray-600">
                点击订阅后，添加微信转账即可。付款后我们会在24小时内为您开通权限。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">订阅后可以退款吗？</h3>
              <p className="text-gray-600">
                订阅后7天内如未使用过服务，可申请全额退款。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">数据多久更新一次？</h3>
              <p className="text-gray-600">
                我们每天同步更新各大公司的招聘信息，确保数据时效性。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 付款弹窗 */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>订阅 {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              请添加微信完成付款，付款后24小时内开通权限
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ¥{selectedPlan?.price}
              </div>
              <p className="text-gray-500">{selectedPlan?.description}</p>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">微信号：</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{WECHAT_ID}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(WECHAT_ID)}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                或发邮件至：{CONTACT_EMAIL}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <p className="font-medium mb-1">付款备注请填写：</p>
              <p>您的注册邮箱 + {selectedPlan?.name}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 JobHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PricingContent />
    </Suspense>
  )
}
