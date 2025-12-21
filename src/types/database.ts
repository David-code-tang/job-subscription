export interface Job {
  id: string
  type: string
  company: string
  title: string
  updated_date: string | null
  department: string | null
  link: string | null
  location: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string | null
  status: 'active' | 'canceled' | 'expired' | 'inactive'
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface JobFilters {
  type?: string
  company?: string
  department?: string
  location?: string
  search?: string
  page?: number
  pageSize?: number
}
