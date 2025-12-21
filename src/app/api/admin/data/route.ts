import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 管理员邮箱列表
const ADMIN_EMAILS = ['davidtang.20@outlook.com']

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return null
  }
  return user
}

export async function GET(request: Request) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  const supabase = createAdminClient()

  // 导出数据
  if (action === 'export') {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('company')

    // 生成 CSV
    const headers = ['类型', '公司', '岗位名称', '更新日期', '岗位部门', '岗位链接', '地点']
    const rows = data?.map(job => [
      job.type || '',
      job.company || '',
      job.title || '',
      job.updated_date || '',
      job.department || '',
      job.link || '',
      job.location || '',
    ].map(v => `"${v.replace(/"/g, '""')}"`).join(',')) || []

    const csv = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="jobs.csv"',
      },
    })
  }

  // 获取统计数据
  const { data: jobs } = await supabase.from('jobs').select('company, type, location')

  const companyCount: Record<string, number> = {}
  const typeCount: Record<string, number> = {}
  const locationCount: Record<string, number> = {}

  jobs?.forEach(job => {
    if (job.company) companyCount[job.company] = (companyCount[job.company] || 0) + 1
    if (job.type) typeCount[job.type] = (typeCount[job.type] || 0) + 1
    if (job.location) locationCount[job.location] = (locationCount[job.location] || 0) + 1
  })

  const sortByCount = (obj: Record<string, number>) =>
    Object.entries(obj)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

  return NextResponse.json({
    totalJobs: jobs?.length || 0,
    companies: sortByCount(companyCount),
    types: sortByCount(typeCount),
    locations: sortByCount(locationCount),
  })
}

export async function POST(request: Request) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

    // 列名映射
    const columnMap: Record<string, string> = {
      '类型': 'type',
      '公司': 'company',
      '岗位名称': 'title',
      '更新日期': 'updated_date',
      '岗位部门': 'department',
      '岗位链接': 'link',
      '地点': 'location',
    }

    const jobs: Record<string, string | null>[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // 解析 CSV 行（处理引号内的逗号）
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

      const job: Record<string, string | null> = {}

      headers.forEach((header, index) => {
        const dbField = columnMap[header]
        if (dbField && values[index] !== undefined) {
          const value = values[index]
          job[dbField] = value === '' ? null : value
        }
      })

      // 确保必填字段存在
      if (job.company && job.title) {
        jobs.push(job)
      }
    }

    if (jobs.length === 0) {
      return NextResponse.json({ error: '没有有效的数据' }, { status: 400 })
    }

    // 批量插入
    const batchSize = 500
    let imported = 0

    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize)
      const { error } = await supabase.from('jobs').insert(batch)
      if (!error) {
        imported += batch.length
      }
    }

    return NextResponse.json({ success: true, imported })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: '导入失败' }, { status: 500 })
  }
}

export async function DELETE() {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('jobs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    return NextResponse.json({ error: '清空失败' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
