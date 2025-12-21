export interface Job {
  id: string
  type: string
  company: string
  job_title: string
  update_date: string | null
  department: string | null
  job_url: string | null
  location: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
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
