import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionActive } from '@/lib/actions'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 检查订阅状态
    const isSubscribed = await checkSubscriptionActive()
    if (!isSubscribed) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 })
    }

    const body = await request.json()
    const { id, field, value } = body

    if (!id || !field) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ✅ 支持自定义字段 (customFields.fieldName)
    const isCustomField = field.startsWith('customFields.')

    if (isCustomField) {
      // 提取字段名 (customFields.priority -> priority)
      const fieldName = field.replace('customFields.', '')

      // 获取当前记录
      const { data: currentJob } = await supabase
        .from('jobs')
        .select('custom_fields')
        .eq('id', id)
        .single()

      if (currentJob) {
        // 合并 customFields
        const updatedCustomFields = {
          ...(currentJob.custom_fields || {}),
          [fieldName]: value
        }

        // 更新数据库
        const { data, error } = await supabase
          .from('jobs')
          .update({ custom_fields: updatedCustomFields })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Supabase update error:', error)
          return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
      }
    } else {
      // 原有字段验证
      const editableFields = ['type', 'company', 'title', 'department', 'location', 'updated_date', 'link']
      if (!editableFields.includes(field)) {
        return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
      }

      // 更新数据库
      const { data, error } = await supabase
        .from('jobs')
        .update({ [field]: value })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    }
  } catch (error) {
    console.error('Update job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
