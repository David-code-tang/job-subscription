# 飞书 API 数据同步配置指南

## 📋 概述

本文档介绍如何配置飞书 API 来自动同步多维表格数据到你的应用。

## 🔧 配置步骤

### 步骤 1: 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/app)
2. 点击"创建企业自建应用"
3. 填写应用信息：
   - 应用名称：Job Subscription Sync
   - 应用描述：同步岗位数据
4. 创建后记录以下信息：
   - **App ID**: 在应用凭证页面获取
   - **App Secret**: 在应用凭证页面获取

### 步骤 2: 申请权限

在飞书应用管理后台，进入"权限管理"，申请以下权限：

- `bitable:app` - 查看、评论和管理多维表格
- `bitable:app:readonly` - 只读访问多维表格
- `bitable:app:link` - 获取分享链接（可选）

**注意**：申请权限后需要发布应用版本才能生效。

### 步骤 3: 获取 App Token 和 Table ID

从你的飞书多维表格 URL 中获取：

**URL 格式**：
```
https://my.feishu.cn/base/GrYvbphumaTN17skgUicG7KFnCf?table=tblGLAs5S4rZo59n
```

- **App Token**: `GrYvbphumaTN17skgUicG7KFnCf`（base/后面的部分）
- **Table ID**: `tblGLAs5S4rZo59n`（table=后面的部分）

### 步骤 4: 配置环境变量

在你的 `.env.local` 文件中添加以下环境变量：

```env
# 飞书 API 配置
FEISHU_APP_ID=your_app_id_here
FEISHU_APP_SECRET=your_app_secret_here
FEISHU_APP_TOKEN=GrYvbphumaTN17skgUicG7KFnCf
FEISHU_TABLE_ID=tblGLAs5S4rZo59n

# Cron Job 密钥（用于保护定时任务接口）
CRON_SECRET=your_random_secret_key_here
```

### 步骤 5: 在 Vercel 中配置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加上述所有环境变量

### 步骤 6: 部署和测试

1. 提交代码到 Git
2. Vercel 会自动部署
3. 部署完成后，可以手动触发同步测试：

```bash
curl -X POST https://your-domain.com/api/cron/sync-feishu \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## ⏰ 定时任务配置

项目已经配置了 Vercel Cron Jobs，每 6 小时自动同步一次数据。

**查看和修改**：编辑 `vercel.json` 文件：

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-feishu",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Cron 表达式说明**：
- `0 * * * *` - 每小时
- `0 */6 * * *` - 每 6 小时（默认）
- `0 0 * * *` - 每天凌晨
- `0 */12 * * *` - 每 12 小时

## 🔍 监控和日志

同步任务会在控制台输出日志，可以通过以下方式查看：

1. Vercel Dashboard → Functions → 查看执行日志
2. 或者访问 `/api/cron/sync-feishu` API 端点（需要授权）

## 📝 飞书字段映射

确保你的飞书多维表格包含以下字段（中英文名称都支持）：

| 中文名称 | 英文名称 | 必填 | 说明 |
|---------|---------|------|------|
| 行业 | type | ✅ | 行业分类 |
| 公司 | company | ✅ | 公司名称 |
| 岗位名称 | title | ✅ | 职位名称 |
| 部门 | department | ❌ | 部门名称 |
| 地点 | location | ❌ | 工作地点 |
| 更新日期 | updated_date | ❌ | 更新时间 |
| 链接 | link | ❌ | 申请链接 |

## ⚠️ 注意事项

1. **API 限流**：飞书 API 有调用频率限制，建议不要频繁手动触发
2. **权限发布**：修改权限后必须发布新版本才能生效
3. **数据覆盖**：每次同步会删除旧数据并插入新数据
4. **错误处理**：同步失败会记录错误日志，不会影响现有数据

## 🆘 故障排查

### 同步失败：获取 access token 失败
- 检查 App ID 和 App Secret 是否正确
- 确认应用已发布并且权限已生效

### 同步失败：获取飞书数据失败
- 检查 App Token 和 Table ID 是否正确
- 确认应用有多维表格的读取权限
- 检查网络连接

### 数据没有更新
- 检查 Vercel Cron Jobs 是否正常运行
- 查看 Vercel 函数执行日志
- 尝试手动触发同步测试

## 📚 相关链接

- [飞书开放平台文档](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field)
- [Vercel Cron Jobs 文档](https://vercel.com/docs/cron-jobs)
- [项目 GitHub 仓库](https://github.com/your-repo)
