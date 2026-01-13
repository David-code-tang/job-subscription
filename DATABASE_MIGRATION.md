# 数据库迁移脚本

## 添加 custom_fields 字段

如果您的 jobs 表还没有 `custom_fields` 字段，请执行以下 SQL：

```sql
-- 添加 custom_fields 字段
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- 创建 GIN 索引以优化 JSON 查询
CREATE INDEX IF NOT EXISTS idx_jobs_custom_fields ON jobs USING GIN (custom_fields);

-- 验证字段已添加
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'jobs'
  AND column_name = 'custom_fields';
```

## 验证

执行后，您应该能够：

1. **添加自定义字段**
   - 点击工具栏的 "添加字段" 按钮
   - 输入字段名称（如"优先级"）
   - 选择类型（如"标签"）
   - 添加选项（如"高/中/低"）
   - 点击"添加字段"

2. **配置字段显示**
   - 点击工具栏的 "字段" 按钮
   - 勾选/取消勾选字段
   - 点击"应用配置"

3. **编辑自定义字段**
   - 在表格中双击自定义字段单元格
   - 选择或输入值
   - 按 Enter 保存

4. **筛选数据**
   - 点击工具栏的 "筛选" 按钮
   - 选择筛选条件
   - 点击"应用筛选"

## 故障排查

如果功能不工作，请检查：

1. **浏览器控制台**是否有错误
2. **Network 标签**检查 API 请求是否成功
3. **数据库**确认 custom_fields 字段存在
4. **刷新页面**清除旧缓存

## 测试数据

您可以手动插入测试数据：

```sql
UPDATE jobs
SET custom_fields = '{"priority": {"type": "标签", "value": "高"}}'
WHERE id = 'your-job-id';
```
