/**
 * pxcharts 风格的多维表格类型定义
 * 用于实现动态字段系统和高级交互功能
 */

// 字段类型定义
export type FieldType =
  | '文本'     // 文本输入
  | '数值'     // 数字输入
  | '标签'     // 标签展示（如状态、优先级）
  | '单选'     // 下拉单选
  | '复选'     // 复选框
  | '富文本'   // 富文本编辑器
  | '图片'     // 图片上传
  | '日期'     // 日期选择
  | '链接'     // URL链接

// 自定义字段值
export interface CustomFieldValue {
  type: FieldType
  value: any
}

// 字段配置
export interface FieldConfig {
  id: string
  name: string
  visible: boolean
  width: number
  type: FieldType
  options?: string[]  // 用于单选/复选/标签类型的选项
}

// 视图配置
export interface ViewConfig {
  rowHeight: '低' | '中等' | '高' | '超高'
  editMode: boolean
  expandedGroups: Record<string, boolean>
  expandedTasks: Record<string, boolean>
  headerDraggable: boolean
}

// 筛选配置
export interface FilterCondition {
  id: string
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty' | 'greaterThan' | 'lessThan'
  value: any
  logicalOperator?: 'AND' | 'OR'  // 与下一个条件的逻辑关系
}

export interface FilterConfig {
  conditions: FilterCondition[]
  isActive: boolean
}

// 排序配置
export interface SortRule {
  field: string
  direction: 'asc' | 'desc'
}

export interface SortConfig {
  rules: SortRule[]
  isActive: boolean
}

// 分组配置
export type GroupByField = 'department' | 'location' | 'company' | 'type' | 'status'

// 拖拽相关类型
export interface DragEndEvent {
  active: { id: string }
  over: { id: string } | null
}
