'use server'

import { createClient } from '@/lib/supabase/server'
import type { Job, JobFilters, Subscription } from '@/types/database'

export async function getJobs(filters: JobFilters = {}): Promise<{
  jobs: Job[]
  total: number
  page: number
  pageSize: number
}> {
  const supabase = await createClient()
  const page = filters.page || 1
  const pageSize = filters.pageSize || 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })

  // 应用筛选条件
  if (filters.type) {
    query = query.eq('type', filters.type)
  }
  if (filters.company) {
    query = query.eq('company', filters.company)
  }
  if (filters.department) {
    query = query.eq('department', filters.department)
  }
  if (filters.location) {
    query = query.eq('location', filters.location)
  }
  if (filters.search) {
    query = query.ilike('job_title', `%${filters.search}%`)
  }

  // 排序和分页
  query = query
    .order('update_date', { ascending: false, nullsFirst: false })
    .range(offset, offset + pageSize - 1)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    return { jobs: [], total: 0, page, pageSize }
  }

  return {
    jobs: data || [],
    total: count || 0,
    page,
    pageSize,
  }
}

export async function getFilterOptions(): Promise<{
  types: string[]
  companies: string[]
  departments: string[]
  locations: string[]
}> {
  const supabase = await createClient()

  const [types, companies, departments, locations] = await Promise.all([
    supabase.from('jobs').select('type').order('type'),
    supabase.from('jobs').select('company').order('company'),
    supabase.from('jobs').select('department').order('department'),
    supabase.from('jobs').select('location').order('location'),
  ])

  // 去重
  const uniqueTypes = [...new Set(types.data?.map(t => t.type).filter(Boolean))]
  const uniqueCompanies = [...new Set(companies.data?.map(c => c.company).filter(Boolean))]
  const uniqueDepartments = [...new Set(departments.data?.map(d => d.department).filter(Boolean))]
  const uniqueLocations = [...new Set(locations.data?.map(l => l.location).filter(Boolean))]

  return {
    types: uniqueTypes as string[],
    companies: uniqueCompanies as string[],
    departments: uniqueDepartments as string[],
    locations: uniqueLocations as string[],
  }
}

export async function getUserSubscription(): Promise<Subscription | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function checkSubscriptionActive(): Promise<boolean> {
  const subscription = await getUserSubscription()

  if (!subscription || subscription.status !== 'active') {
    return false
  }

  // 检查是否在有效期内
  if (subscription.current_period_end) {
    const endDate = new Date(subscription.current_period_end)
    if (endDate < new Date()) {
      return false
    }
  }

  return true
}
