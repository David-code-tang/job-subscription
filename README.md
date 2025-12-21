# JobHub - 岗位信息订阅平台

基于 Next.js + Supabase + Stripe 构建的订阅制招聘信息网站。

## 功能特性

- 用户系统：邮箱注册/登录、密码重置
- 订阅系统：1/3/6 个月订阅套餐，Stripe 支付
- 数据展示：表格视图、多条件筛选、关键词搜索
- 权限控制：仅付费用户可访问数据

## 技术栈

- **前端**: Next.js 14, React, TailwindCSS, shadcn/ui
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **支付**: Stripe Subscriptions
- **部署**: Vercel

## 部署步骤

### 1. 准备工作

注册以下账号：
- [GitHub](https://github.com)
- [Vercel](https://vercel.com)
- [Supabase](https://supabase.com)
- [Stripe](https://stripe.com)

### 2. 创建 Supabase 项目

1. 登录 Supabase，创建新项目
2. 进入 SQL Editor，运行 `supabase/schema.sql` 中的 SQL
3. 复制以下信息：
   - Project URL
   - anon public key
   - service_role key

### 3. 配置 Stripe

1. 登录 Stripe Dashboard
2. 创建 3 个订阅产品（月度、季度、半年）
3. 复制以下信息：
   - Publishable key
   - Secret key
4. 设置 Webhook：
   - 端点 URL: `https://your-domain.com/api/webhooks/stripe`
   - 监听事件：
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
5. 复制 Webhook signing secret

### 4. 部署到 Vercel

1. Fork 本项目到你的 GitHub
2. 登录 Vercel，导入项目
3. 设置环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=你的Supabase service role key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=你的Stripe publishable key
STRIPE_SECRET_KEY=你的Stripe secret key
STRIPE_WEBHOOK_SECRET=你的Stripe webhook secret
NEXT_PUBLIC_SITE_URL=你的网站URL
```

4. 部署

### 5. 导入数据

运行数据导入脚本：

```bash
# 设置环境变量
export NEXT_PUBLIC_SUPABASE_URL=你的URL
export SUPABASE_SERVICE_ROLE_KEY=你的key

# 运行导入脚本
npx tsx scripts/import-csv.ts 岗位信息汇总_数据表_表格.csv
```

## 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量文件
cp .env.local.example .env.local
# 编辑 .env.local 填入你的配置

# 启动开发服务器
npm run dev
```

## 项目结构

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/          # 认证页面
│   ├── api/             # API 路由
│   ├── dashboard/       # 数据浏览页
│   ├── pricing/         # 定价页面
│   └── account/         # 用户账户
├── components/          # React 组件
├── lib/                 # 工具函数
│   ├── supabase/       # Supabase 客户端
│   ├── stripe.ts       # Stripe 配置
│   └── actions.ts      # Server Actions
└── types/              # TypeScript 类型
```

## 更新数据

定期从飞书导出 CSV 后，运行导入脚本更新数据：

```bash
npx tsx scripts/import-csv.ts 新的CSV文件.csv
```

## 自定义

### 修改订阅价格

编辑 `src/lib/stripe.ts` 中的 `PLANS` 数组。

### 修改网站名称

编辑 `src/app/layout.tsx` 中的 metadata 和各页面中的 "JobHub"。

### 修改样式

项目使用 TailwindCSS，可以在 `src/app/globals.css` 中自定义主题。

## License

MIT
