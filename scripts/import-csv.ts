/**
 * 数据导入脚本
 * 将飞书导出的 CSV 文件导入到 Supabase 数据库
 *
 * 使用方法:
 * 1. 确保已设置环境变量 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY
 * 2. 运行: npx tsx scripts/import-csv.ts <csv文件路径>
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// 从环境变量获取配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('请设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface JobRow {
  type: string | null
  company: string
  title: string
  updated_date: string | null
  department: string | null
  link: string | null
  location: string | null
}

function parseCSV(content: string): JobRow[] {
  const lines = content.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

  console.log('CSV 表头:', headers)

  // 映射飞书列名到数据库字段
  const columnMap: Record<string, keyof JobRow> = {
    '类型': 'type',
    '公司': 'company',
    '岗位名称': 'title',
    '更新日期': 'updated_date',
    '岗位部门': 'department',
    '岗位链接': 'link',
    '地点': 'location',
  }

  const jobs: JobRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // 处理 CSV 中的逗号（可能在引号内）
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''))
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''))

    const job: Partial<JobRow> = {}

    headers.forEach((header, index) => {
      const dbField = columnMap[header]
      if (dbField && values[index] !== undefined) {
        const value = values[index]
        job[dbField] = value === '' ? null : value
      }
    })

    // 确保必填字段存在
    if (job.company && job.title) {
      jobs.push(job as JobRow)
    }
  }

  return jobs
}

async function importJobs(csvPath: string) {
  console.log(`读取文件: ${csvPath}`)

  const content = fs.readFileSync(csvPath, 'utf-8')
  const jobs = parseCSV(content)

  console.log(`解析到 ${jobs.length} 条记录`)

  if (jobs.length === 0) {
    console.log('没有可导入的数据')
    return
  }

  // 分批导入（每批 500 条）
  const batchSize = 500
  let imported = 0

  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize)

    const { error } = await supabase.from('jobs').insert(batch)

    if (error) {
      console.error(`导入第 ${i + 1}-${i + batch.length} 条时出错:`, error)
    } else {
      imported += batch.length
      console.log(`已导入 ${imported}/${jobs.length} 条`)
    }
  }

  console.log(`\n导入完成！共导入 ${imported} 条记录`)
}

async function clearJobs() {
  console.log('清空现有数据...')
  const { error } = await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    console.error('清空数据出错:', error)
  } else {
    console.log('数据已清空')
  }
}

// 主程序
const args = process.argv.slice(2)
const csvPath = args[0] || path.join(__dirname, '..', '..', '岗位信息汇总_数据表_表格.csv')

if (!fs.existsSync(csvPath)) {
  console.error(`文件不存在: ${csvPath}`)
  process.exit(1)
}

// 先清空再导入
clearJobs().then(() => {
  importJobs(csvPath)
})
