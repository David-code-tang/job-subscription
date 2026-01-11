/**
 * 飞书多维表格数据同步脚本
 *
 * 使用方法：
 * 1. 在飞书开放平台创建应用: https://open.feishu.cn/app
 * 2. 获取 App ID 和 App Secret
 * 3. 申请权限：bitable:app, bitable:app:readonly
 * 4. 从飞书表格 URL 中获取 app_token 和 table_id
 * 5. 配置环境变量
 * 6. 运行此脚本同步数据
 */

interface FeishuRecord {
  record_id: string
  fields: {
    [key: string]: any
  }
}

interface FeishuApiResponse {
  code: number
  msg: string
  data: {
    items: FeishuRecord[]
    has_more: boolean
    page_token: string
  }
}

interface JobRecord {
  type: string
  company: string
  title: string
  updated_date: string | null
  department: string | null
  link: string | null
  location: string | null
}

// 飞书 API 配置
const FEISHU_CONFIG = {
  appId: process.env.FEISHU_APP_ID || '',
  appSecret: process.env.FEISHU_APP_SECRET || '',
  appToken: process.env.FEISHU_APP_TOKEN || '',
  tableId: process.env.FEISHU_TABLE_ID || '',
}

/**
 * 获取 tenant_access_token
 */
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: FEISHU_CONFIG.appId,
      app_secret: FEISHU_CONFIG.appSecret,
    }),
  })

  const data = await response.json()

  if (data.code !== 0) {
    throw new Error(`获取 access token 失败: ${data.msg}`)
  }

  return data.tenant_access_token
}

/**
 * 获取飞书多维表格数据
 */
async function getFeishuData(accessToken: string): Promise<JobRecord[]> {
  const records: JobRecord[] = []
  let pageToken = ''
  let hasMore = true

  while (hasMore) {
    const url = new URL(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${FEISHU_CONFIG.tableId}/records`
    )

    if (pageToken) {
      url.searchParams.set('page_token', pageToken)
    }

    // 每次最多获取 100 条记录
    url.searchParams.set('page_size', '100')

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data: FeishuApiResponse = await response.json()

    if (data.code !== 0) {
      throw new Error(`获取飞书数据失败: ${data.msg}`)
    }

    // 转换数据格式
    const items = data.data.items.map(item => ({
      type: item.fields['行业'] || item.fields['type'] || '',
      company: item.fields['公司'] || item.fields['company'] || '',
      title: item.fields['岗位名称'] || item.fields['title'] || '',
      department: item.fields['部门'] || item.fields['department'] || null,
      location: item.fields['地点'] || item.fields['location'] || null,
      updated_date: item.fields['更新日期'] || item.fields['updated_date'] || null,
      link: item.fields['链接'] || item.fields['link'] || null,
    }))

    records.push(...items)

    hasMore = data.data.has_more
    pageToken = data.data.page_token
  }

  return records
}

/**
 * 同步数据到 Supabase
 */
async function syncToSupabase(jobs: JobRecord[]) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // 删除旧数据
  await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // 插入新数据
  const records = jobs.map(job => ({
    type: job.type,
    company: job.company,
    title: job.title,
    department: job.department,
    location: job.location,
    updated_date: job.updated_date,
    link: job.link,
  }))

  const { error } = await supabase.from('jobs').insert(records)

  if (error) {
    throw new Error(`同步到 Supabase 失败: ${error.message}`)
  }

  return records.length
}

/**
 * 主同步函数
 */
export async function syncFeishuData(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    console.log('开始同步飞书数据...')

    // 检查配置
    if (!FEISHU_CONFIG.appId || !FEISHU_CONFIG.appSecret) {
      throw new Error('缺少飞书 App ID 或 App Secret')
    }

    if (!FEISHU_CONFIG.appToken || !FEISHU_CONFIG.tableId) {
      throw new Error('缺少飞书 App Token 或 Table ID')
    }

    // 获取 access token
    console.log('获取 access token...')
    const accessToken = await getAccessToken()
    console.log('Access token 获取成功')

    // 获取飞书数据
    console.log('从飞书获取数据...')
    const jobs = await getFeishuData(accessToken)
    console.log(`获取到 ${jobs.length} 条记录`)

    // 同步到 Supabase
    console.log('同步到 Supabase...')
    const count = await syncToSupabase(jobs)
    console.log(`同步完成，共 ${count} 条记录`)

    return {
      success: true,
      message: '同步成功',
      count,
    }
  } catch (error) {
    console.error('同步失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '未知错误',
    }
  }
}

/**
 * Vercel Cron Job 处理函数
 */
export async function GET() {
  const result = await syncFeishuData()

  return Response.json(result)
}
