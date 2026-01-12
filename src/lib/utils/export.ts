import { Job } from '@/lib/stores/job-store'

/**
 * 导出岗位数据为 CSV 文件
 */
export function exportJobsToCSV(jobs: Job[], filename = 'jobs-export.csv') {
  if (jobs.length === 0) {
    return false
  }

  // CSV 表头
  const headers = ['行业', '公司', '岗位名称', '部门', '地点', '更新日期', '申请链接']

  // 转换数据为 CSV 行
  const csvRows = [
    headers.join(','), // 表头行
    ...jobs.map((job) => {
      const values = [
        job.type || '',
        job.company || '',
        job.title || '',
        job.department || '',
        job.location || '',
        job.updated_date || '',
        job.link || '',
      ]

      // 转义 CSV 中的特殊字符（逗号、引号、换行）
      const escapedValues = values.map((value) => {
        const stringValue = String(value)
        // 如果值包含逗号、引号或换行，需要用引号包裹并转义内部引号
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })

      return escapedValues.join(',')
    }),
  ]

  // 添加 BOM 以支持 Excel 正确识别中文
  const BOM = '\uFEFF'
  const csvContent = BOM + csvRows.join('\n')

  // 创建 Blob 并下载
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}

/**
 * 导出选中岗位数据为 CSV 文件
 */
export function exportSelectedJobs(
  jobs: Job[],
  selectedIds: string[],
  filename = 'selected-jobs.csv'
) {
  const selectedJobs = jobs.filter((job) => selectedIds.includes(job.id))
  return exportJobsToCSV(selectedJobs, filename)
}

/**
 * 导出所有筛选后的岗位数据为 CSV 文件
 */
export function exportFilteredJobs(jobs: Job[], filename = 'filtered-jobs.csv') {
  return exportJobsToCSV(jobs, filename)
}
