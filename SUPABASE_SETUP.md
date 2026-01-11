# 如何获取 Supabase 凭据

## 步骤 1: 登录 Supabase

1. 访问 https://supabase.com
2. 点击右上角的 "Sign In" 登录你的账号

## 步骤 2: 找到你的项目

1. 登录后会看到 "Projects" 页面
2. 找到你的 JobHub 项目并点击进入

## 步骤 3: 获取 API 密钥

1. 在左侧菜单中点击 **"Settings"** (齿轮图标)
2. 选择 **"API"** 选项卡
3. 在这里你会看到三个重要的信息：

### 需要复制的信息：

1. **Project URL**
   - 格式类似: `https://xxxxx.supabase.co`
   - 复制这个 URL

2. **anon public** key
   - 在 "Project API keys" 部分找到
   - 这是一个公开的密钥，以 `eyJ...` 开头

3. **service_role** key
   - 也在 "Project API keys" 部分找到
   - ⚠️ 这个是私密密钥，要妥善保管
   - 也在 `service_role` 下面，以 `eyJ...` 开头

## 步骤 4: 将信息配置到 Vercel

获取到这些信息后，你需要：

1. 访问你的 Vercel 项目: https://vercel.com/davidtangs-projects-d94ac03d/job-subscription/settings/environment-variables

2. 添加以下环境变量（如果还没有的话）：

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...（你的 anon key）
   SUPABASE_SERVICE_ROLE_KEY=eyJ...（你的 service_role key）
   NEXT_PUBLIC_SITE_URL=https://job-subscription.vercel.app
   ```

3. 确保这些变量添加到：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

## 步骤 5: 检查数据库表

1. 在 Supabase 项目中，点击左侧的 **"Table Editor"**
2. 确认以下表是否存在：
   - `jobs` - 职位信息表
   - `profiles` - 用户资料表
   - `subscriptions` - 订阅表

3. 如果表不存在，点击左边的 **"SQL Editor"**
4. 点击 "New Query"
5. 复制并运行 `supabase/schema.sql` 文件中的内容

## 步骤 6: 查看现有用户

1. 在 Supabase 项目中，点击 **"Authentication"**
2. 点击 **"Users"** 标签
3. 这里你可以看到所有注册的用户

完成这些步骤后，网站就可以正常登录了！
