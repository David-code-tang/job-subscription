# 快速开始指南

## 🎉 恭喜！AntV S2 方案已部署

你的网站已经成功部署，并集成了 AntV S2 表格组件。

## 📋 当前状态

✅ **已完成**：
- AntV S2 表格组件已安装并配置
- 飞书 API 数据同步脚本已就绪
- Vercel Cron Jobs 已配置（每 6 小时自动同步）
- 代码已部署到生产环境

## 🚀 下一步操作

### 1. 检查环境变量配置

既然你说已经有飞书应用配置，请确认以下环境变量已在 Vercel 中设置：

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `job-subscription`
3. 进入 **Settings** → **Environment Variables**
4. 确认以下变量已配置：

```env
FEISHU_APP_ID=xxxxx
FEISHU_APP_SECRET=xxxxx
FEISHU_APP_TOKEN=xxxxx
FEISHU_TABLE_ID=xxxxx
CRON_SECRET=xxxxx（可选）
```

如果缺少这些变量，请参考 [FEISHU_API_SETUP.md](FEISHU_API_SETUP.md) 进行配置。

### 2. 手动触发数据同步

有两种方式触发数据同步：

#### 方式 A：使用管理页面（推荐）

1. 访问：`https://job-subscription.vercel.app/admin/sync`
2. 点击"立即同步"按钮
3. 等待同步完成（会显示成功/失败消息）

#### 方式 B：使用 API 调用

```bash
curl -X POST https://job-subscription.vercel.app/api/cron/sync-feishu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

如果没有设置 `CRON_SECRET`，可以去掉 Authorization header。

### 3. 查看岗位列表

同步完成后，访问：
```
https://job-subscription.vercel.app/dashboard
```

你应该能看到使用 AntV S2 渲染的岗位数据表格。

## 🎨 功能特点

### AntV S2 表格
- ✅ 飞书风格设计
- ✅ Canvas 高性能渲染
- ✅ 支持大数据集（100 万级数据）
- ✅ 行号显示
- ✅ 悬停高亮
- ✅ 响应式布局

### 安全性
- ✅ 用户必须登录
- ✅ 用户必须有付费订阅
- ✅ API 速率限制
- ✅ 飞书链接不暴露

### 自动化
- ✅ 每 6 小时自动同步
- ✅ 可手动触发同步
- ✅ 完整的错误处理

## 🔍 故障排查

### 问题 1：访问 dashboard 显示"暂无数据"

**原因**：Supabase 中还没有数据

**解决**：
1. 访问 `/admin/sync` 手动触发同步
2. 检查飞书 API 配置是否正确
3. 查看同步日志确认错误原因

### 问题 2：同步失败

**检查项**：
1. 飞书应用的权限是否已发布
2. App Token 和 Table ID 是否正确
3. 网络连接是否正常

**查看日志**：
- Vercel Dashboard → Functions → `/api/cron/sync-feishu`

### 问题 3：S2 表格样式不对

**原因**：CSS 样式未加载

**解决**：确认已安装 `@antv/s2-react` 的样式文件

```typescript
import '@antv/s2-react/dist/style.min.css'
```

## 📊 监控和维护

### 自动同步监控

Cron Job 会每 6 小时自动运行：
- 00:00 (UTC)
- 06:00 (UTC)
- 12:00 (UTC)
- 18:00 (UTC)

可以在 Vercel Dashboard → Cron Jobs 中查看执行历史。

### 手动同步建议

建议在以下情况手动触发同步：
- 首次配置后
- 飞书表格数据大量更新后
- 发现数据不同步时

## 🎯 下一步优化建议

1. **添加筛选功能**
   - 创建 JobFilters 组件
   - 支持按行业、公司、部门、地点筛选
   - 添加关键词搜索

2. **优化表格配置**
   - 自定义列宽
   - 添加单元格点击链接
   - 自定义主题颜色

3. **增强监控**
   - 添加同步失败邮件通知
   - 创建数据统计面板
   - 记录同步历史

## 📚 相关文档

- [FEISHU_API_SETUP.md](FEISHU_API_SETUP.md) - 飞书 API 详细配置指南
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - 完整实施总结
- [AntV S2 文档](https://s2.antv.antgroup.com/) - S2 官方文档
- [飞书开放平台](https://open.feishu.cn/document) - 飞书 API 文档

## 🆘 获取帮助

如有问题，请：
1. 查看上述文档
2. 检查 Vercel 函数日志
3. 查看 `/admin/sync` 页面的配置状态

---

**项目地址**: https://job-subscription.vercel.app
**管理页面**: https://job-subscription.vercel.app/admin/sync
**最后更新**: 2026-01-11
