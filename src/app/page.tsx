import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Search, Filter, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">JobHub</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              订阅套餐
            </Link>
            <Link href="/login">
              <Button variant="outline">登录</Button>
            </Link>
            <Link href="/register">
              <Button>注册</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          每日更新 · 精选岗位
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          获取最新金融科技<br />
          <span className="text-blue-600">招聘岗位信息</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          汇集 J.P. Morgan、Goldman Sachs 等顶级金融机构的最新招聘信息，
          每日更新，助你快速找到理想工作。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/pricing">
            <Button size="lg" className="px-8">
              立即订阅
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="px-8">
              免费注册
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          已有 10,000+ 精选岗位信息
        </p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Search className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>智能搜索</CardTitle>
              <CardDescription>
                支持按公司、部门、地点等多维度筛选，快速定位目标岗位
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Filter className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>每日更新</CardTitle>
              <CardDescription>
                实时同步各大公司招聘官网，确保信息及时准确
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>精选岗位</CardTitle>
              <CardDescription>
                专注金融科技领域，覆盖投行、资管、量化等热门方向
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">灵活的订阅方案</h2>
        <p className="text-gray-600 mb-8">
          选择适合您的订阅周期，随时查看最新岗位
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>月度会员</CardTitle>
              <div className="text-3xl font-bold">¥49<span className="text-sm font-normal text-gray-500">/月</span></div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">适合短期求职</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500 border-2 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">推荐</Badge>
            <CardHeader>
              <CardTitle>季度会员</CardTitle>
              <div className="text-3xl font-bold">¥129<span className="text-sm font-normal text-gray-500">/3月</span></div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">最受欢迎选择</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>半年会员</CardTitle>
              <div className="text-3xl font-bold">¥239<span className="text-sm font-normal text-gray-500">/6月</span></div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">性价比最高</p>
            </CardContent>
          </Card>
        </div>
        <Link href="/pricing" className="inline-block mt-8">
          <Button variant="outline" size="lg">
            查看详细套餐
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 JobHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
