# pxcharts 原版 vs 当前实现对比自检报告

## 📊 总体评估

| 维度 | pxcharts 原版 | 当前实现 | 差距评分 |
|------|--------------|----------|----------|
| **功能完整性** | ✅ 100% | ⚠️ 35% | **差距巨大** |
| **架构设计** | Zustand + 自定义字段 | Zustand + 固定字段 | **需要重构** |
| **视图系统** | 3种完整视图 | 3种基础视图 | **70%完成** |
| **交互体验** | 拖拽排序、行内编辑、分组筛选 | 部分实现 | **40%完成** |
| **数据模型** | 灵活自定义字段 | 固定Job结构 | **不兼容** |

---

## 🎯 核心功能差距分析

### 1. 数据模型架构 ⚠️ **根本性差异**

#### pxcharts 原版设计
```typescript
// lib/types.ts - 极其灵活的数据结构
interface Task {
  id: string
  description: string
  summary: string
  assignee: User
  status: TaskStatus  // 枚举
  priority: TaskPriority  // 枚举
  customFields?: Record<string, CustomFieldValue>  // ✅ 动态字段系统
}

interface CustomFieldValue {
  type: FieldType  // "文本" | "数值" | "标签" | "单选" | "复选" | "富文本" | "图片"
  value: any
}

// 字段配置 - 可动态添加
interface FieldConfig {
  id: string
  name: string
  visible: boolean
  width: number
  type: FieldType
  options?: string[]  // 单选/复选的选项
}
```

**关键特性**：
- ✅ `customFields` 支持运行时动态添加任意字段
- ✅ 字段类型系统完善（7种类型）
- ✅ 字段配置独立于数据结构
- ✅ 支持字段选项（单选/复选的下拉选项）

#### 当前实现
```typescript
// lib/stores/job-store.ts
interface Job {
  id: string
  title: string              // 固定字段
  company: string            // 固定字段
  department: string         // 固定字段
  location: string           // 固定字段
  type: string               // 固定字段
  link: string | null        // 固定字段
  updated_date: string       // 固定字段
  // ❌ 没有 customFields
  // ❌ 所有字段都是硬编码的
}
```

**问题**：
- ❌ 字段完全固定，无法动态添加
- ❌ 没有字段类型系统
- ❌ 每次添加新字段都需要修改接口和数据库
- ❌ 不支持用户自定义字段

**影响**：这是**最根本的架构差异**，导致无法实现 pxcharts 的核心功能。

---

### 2. 状态管理差距 ⚠️ **功能不完整**

#### pxcharts 的 TaskStore 功能清单

| 功能类别 | pxcharts 原版 | 当前实现 | 状态 |
|---------|--------------|----------|------|
| **基础CRUD** | ✅ addTask, updateTask | ✅ addJob, updateJob | ✅ 相同 |
| **批量操作** | ✅ addMultipleTasks | ❌ 缺失 | ❌ 需要添加 |
| **用户管理** | ✅ addUser, deleteUser, reorderUsers | ❌ 无用户概念 | ❌ 不同场景 |
| **任务移动** | ✅ moveTask (跨组拖拽) | ❌ 缺失 | ❌ 需要添加 |
| **任务排序** | ✅ reorderTasks (跨优先级组) | ❌ 缺失 | ❌ 需要添加 |
| **自定义字段** | ✅ addField, updateTaskCustomField | ❌ 完全缺失 | ❌ **核心功能** |
| **筛选系统** | ✅ 多条件筛选 (status, priority, assignee, dateRange) | ✅ 基础筛选 | ⚠️ 功能弱 |
| **排序系统** | ✅ 多字段排序，支持自定义字段 | ❌ 无排序 | ❌ 完全缺失 |
| **分组系统** | ✅ 动态分组 (priority, status, assignee, completed) | ⚠️ 固定按department | ❌ 功能弱 |
| **字段管理** | ✅ visibleFields, updateFieldWidth, reorderHeaders | ⚠️ 部分实现 | ⚠️ 需完善 |
| **视图配置** | ✅ rowHeight, editMode, expandedGroups | ⚠️ 基础配置 | ⚠️ 需完善 |

#### 关键缺失方法

**pxcharts 有但当前没有的核心方法**：

```typescript
// 1. 自定义字段管理
addField(field: { id, name, type, options })
updateFieldType(fieldId, type)
updateTaskCustomField(taskId, fieldId, value)

// 2. 高级数据操作
moveTask(taskId, newStatus)  // 看板视图拖拽
reorderTasks(fromGroup, fromIndex, toIndex, toGroup)  // 跨组拖拽
addMultipleTasks(tasks[])  // 批量导入

// 3. 用户管理 (虽然场景不同，但可能需要类似功能)
addUser, deleteUser, reorderUsers, getSortedUsers

// 4. 动态分组
setGroupBy(field)  // 支持按任意字段分组
regroupData()  // 重新组织数据结构
```

---

### 3. UI 组件差距分析

#### 表格视图组件对比

| 功能 | pxcharts 实现 | 当前实现 | 差距 |
|------|--------------|----------|------|
| **行内编辑** | ✅ EditableCell 组件 | ✅ EditableCell 组件 | ✅ 已实现 |
| **拖拽排序** | ✅ @dnd-kit 行拖拽 | ❌ 缺失 | ❌ **核心功能** |
| **列拖拽** | ✅ SortableContext + useSortable | ✅ DraggableHeader | ✅ 已实现 |
| **列宽调整** | ✅ResizableHeader | ✅ 列宽调整 | ✅ 已实现 |
| **列冻结** | ✅ sticky left-0 | ✅ 样式已实现 | ⚠️ 无UI入口 |
| **分组展示** | ✅ 可折叠的分组标题 | ❌ 缺失 | ❌ **核心功能** |
| **行展开** | ✅ expandedTasks 支持 | ❌ 缺失 | ⚠️ 次要功能 |
| **编辑模式** | ✅ 切换编辑模式，Select替换静态组件 | ❌ 缺失 | ⚠️ 次要功能 |
| **自定义字段渲染** | ✅ CustomFieldCell 组件 | ❌ 缺失 | ❌ **必须实现** |
| **右键菜单** | ✅ 完整的context-menu | ⚠️ 行菜单已实现，列头菜单未集成 | ⚠️ 需完善 |

#### 看板视图组件对比

| 功能 | pxcharts 实现 | 当前实现 | 差距 |
|------|--------------|----------|------|
| **拖拽换列** | ✅ @dnd-kit 拖拽任务到不同状态列 | ❌ 缺失 | ❌ **核心功能** |
| **拖拽排序** | ✅ 同列内任务排序 | ❌ 缺失 | ⚠️ 次要功能 |
| **添加任务** | ✅ 每列有添加按钮 | ❌ 缺失 | ⚠️ 重要功能 |
| **任务卡片** | ✅ 完整信息展示 | ✅ KanbanCard | ✅ 已实现 |
| **分组维度** | ✅ 支持按状态/人员/优先级分组 | ⚠️ 固定按部门 | ⚠️ 需改进 |

---

### 4. 对话框/弹窗组件差距

#### pxcharts 完整的对话框系统

```
components/
├── filter-dialog.tsx        ✅ 多条件筛选对话框
├── sort-dialog.tsx          ✅ 多字段排序对话框
├── group-by-dialog.tsx      ✅ 分组配置对话框
├── field-config-dialog.tsx  ✅ 字段显示/隐藏/宽度配置
├── add-task-dialog.tsx      ✅ 添加任务对话框
├── add-user-dialog.tsx      ✅ 添加用户对话框
├── add-field-dialog.tsx     ✅ 添加自定义字段对话框 ⭐核心
├── import-tasks-dialog.tsx  ✅ 批量导入对话框
└── task-detail.tsx          ✅ 任务详情面板
```

#### 当前实现

```
components/
├── job-filters.tsx          ⚠️ 基础筛选（无对话框）
├── context-menu/
│   ├── row-context-menu.tsx   ✅ 行右键菜单
│   └── header-context-menu.tsx ❌ 未集成
└── ❌ 缺失所有配置对话框
```

**关键缺失**：
- ❌ 没有筛选对话框（FilterDialog）
- ❌ 没有排序对话框（SortDialog）
- ❌ 没有分组对话框（GroupByDialog）
- ❌ 没有字段配置对话框（FieldConfigDialog）
- ❌ **没有添加字段对话框（AddFieldDialog）** - 最关键

---

### 5. 技术栈对比

#### 依赖包对比

| 依赖 | pxcharts 版本 | 当前版本 | 状态 |
|------|--------------|----------|------|
| **Next.js** | 15.2.4 | 16.1.0 | ✅ 更新 |
| **React** | 19 | 19 | ✅ 相同 |
| **TypeScript** | 5 | 5 | ✅ 相同 |
| **Zustand** | latest | latest | ✅ 相同 |
| **@dnd-kit** | latest | latest | ✅ 相同 |
| **@radix-ui** | 2.x | 1.x | ⚠️ 版本差异 |
| **Recharts** | 2.15.0 | ❌ 未使用 | ⚠️ 缺失图表 |
| **React Hook Form** | 7.54.1 | ❌ 未使用 | ⚠️ 缺失表单管理 |

**结论**：技术栈基本兼容，可以集成 pxcharts 的组件。

---

## 🚀 实施方案建议

### 方案 A：直接集成 pxcharts 组件 ⭐ **推荐**

#### 优势
1. ✅ **快速实现**：直接复用 pxcharts 的成熟组件
2. ✅ **功能完整**：获得所有 pxcharts 的功能
3. ✅ **代码质量**：基于已验证的实现
4. ✅ **维护性**：跟随 pxcharts 社区更新

#### 实施步骤

**Step 1: 数据模型迁移** ⚠️ **最关键**

```typescript
// 1. 修改 Job 接口，添加 customFields
interface Job {
  id: string
  title: string
  company: string
  department: string
  location: string
  type: string
  link: string | null
  updated_date: string
  customFields?: Record<string, CustomFieldValue>  // ✅ 新增
}

// 2. 复制 pxcharts 的类型定义
// lib/types/pxcharts.ts
export type FieldType = "文本" | "数值" | "标签" | "单选" | "复选" | "富文本" | "图片"
export interface CustomFieldValue { type: FieldType; value: any }
export interface FieldConfig { id, name, visible, width, type, options? }
```

**Step 2: Store 扩展**

```typescript
// lib/stores/job-store.ts
interface JobStore {
  // 现有方法...

  // ✅ 新增 pxcharts 核心方法
  addField: (field: { id, name, type, options? }) => void
  updateJobCustomField: (jobId, fieldId, value) => void
  moveJob: (jobId, newStatus) => void
  reorderJobs: (fromGroup, fromIndex, toIndex, toGroup?) => void
  addMultipleJobs: (jobs[]) => void

  // ✅ 新增配置管理
  sortConfig: SortConfig
  setSortConfig: (config) => void
  groupBy: string
  setGroupBy: (field) => void
}
```

**Step 3: 组件集成**

```bash
# 1. 复制 pxcharts 核心组件
cp -r path/to/pxcharts/components/filter-dialog.tsx src/components/
cp -r path/to/pxcharts/components/sort-dialog.tsx src/components/
cp -r path/to/pxcharts/components/group-by-dialog.tsx src/components/
cp -r path/to/pxcharts/components/field-config-dialog.tsx src/components/
cp -r path/to/pxcharts/components/add-field-dialog.tsx src/components/
cp -r path/to/pxcharts/components/custom-field-cell.tsx src/components/

# 2. 修改导入路径和类型引用
# 将 Task 改为 Job，将 useTaskStore 改为 useJobStore
```

**Step 4: 工具栏改造**

```typescript
// components/layout/topbar.tsx
// 添加新的功能按钮
<Button onClick={() => setIsFilterDialogOpen(true)}>筛选</Button>
<Button onClick={() => setIsSortDialogOpen(true)}>排序</Button>
<Button onClick={() => setIsGroupByDialogOpen(true)}>分组</Button>
<Button onClick={() => setIsFieldConfigDialogOpen(true)}>字段</Button>
<Button onClick={() => setIsAddFieldDialogOpen(true)}>添加字段</Button>
```

#### 工作量估算

| 任务 | 工作量 | 优先级 |
|------|--------|--------|
| 数据模型迁移 | 2-3天 | P0 |
| Store 扩展 | 3-4天 | P0 |
| 组件复制和适配 | 5-7天 | P0 |
| 看板拖拽集成 | 2-3天 | P1 |
| 测试和调试 | 3-5天 | P1 |
| **总计** | **15-22天** | - |

---

### 方案 B：从零重写 ⚠️ **不推荐**

#### 优势
- 更贴合当前业务场景
- 完全掌控代码

#### 劣势
- ❌ 开发周期长（至少2-3个月）
- ❌ 需要重新设计所有交互细节
- ❌ 可能出现未知bug
- ❌ 难以达到 pxcharts 的完成度

---

## 📋 功能差距清单

### P0 - 必须实现（核心功能）

- [ ] **数据模型改造**：添加 `customFields` 支持
- [ ] **自定义字段系统**：addField, updateFieldType, updateJobCustomField
- [ ] **筛选对话框**：FilterDialog 组件
- [ ] **排序对话框**：SortDialog 组件
- [ ] **分组对话框**：GroupByDialog 组件
- [ ] **字段配置对话框**：FieldConfigDialog 组件
- [ ] **添加字段对话框**：AddFieldDialog 组件
- [ ] **CustomFieldCell 组件**：渲染自定义字段
- [ ] **拖拽排序**：行拖拽排序
- [ ] **看板拖拽**：任务跨列拖拽
- [ ] **动态分组**：支持按任意字段分组

### P1 - 应该实现（重要功能）

- [ ] **编辑模式切换**：编辑/查看模式
- [ ] **行展开详情**：expandedTasks 功能
- [ ] **批量操作**：批量添加、批量编辑
- [ ] **任务详情面板**：右侧滑出详情
- [ ] **导入导出**：JSON 格式导入导出
- [ ] **列头右键菜单**：HeaderContextMenu 集成
- [ ] **多列排序**：支持按多个字段排序
- [ ] **高级筛选**：日期范围、多条件组合

### P2 - 可以优化（锦上添花）

- [ ] **行高配置**：rowHeight 设置
- [ ] **主题切换**：深色/浅色主题
- [ ] **数据统计**：图表可视化（Recharts）
- [ ] **键盘快捷键增强**：更多快捷键
- [ ] **性能优化**：虚拟滚动
- [ ] **离线支持**：本地缓存

---

## 💡 建议

### 短期方案（1-2周）

1. **直接复制 pxcharts 的对话框组件**
   - FilterDialog, SortDialog, GroupByDialog, FieldConfigDialog
   - 快速补齐功能短板

2. **实现基础拖拽功能**
   - 表格行拖拽排序
   - 看板任务拖拽

### 中期方案（3-4周）

3. **数据模型扩展**
   - 添加 `customFields` 支持
   - 实现自定义字段 CRUD

4. **组件适配**
   - CustomFieldCell 组件
   - 完整的看板拖拽

### 长期方案（2-3个月）

5. **功能对齐**
   - 实现所有 P0/P1 功能
   - 达到 pxcharts 90%+ 功能完成度

6. **优化提升**
   - 性能优化
   - 用户体验优化
   - 添加特色功能

---

## 🎯 结论

**当前实现与 pxcharts 原版的差距主要在于**：

1. **架构层面**：缺少动态字段系统（customFields）
2. **功能层面**：缺少大量配置对话框和管理功能
3. **交互层面**：缺少拖拽排序、看板拖拽等核心交互

**最佳路径**：

> **直接集成 pxcharts 组件** + **数据模型适配** + **业务场景定制**

这样可以快速获得完整的多维表格能力，同时保留岗位管理的业务特色。

---

## 📚 参考资料

- [pxcharts GitHub](https://github.com/MrXujiang/pxcharts)
- [pxcharts 在线演示](https://pxcharts.turntip.cn)
- [技术架构文档](https://github.com/MrXujiang/pxcharts/blob/master/docs/ARCHITECTURE.md)
- [当前自检报告](./SELF_CHECK_REPORT.md)
