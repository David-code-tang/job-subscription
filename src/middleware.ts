import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// Only run middleware on specific paths that need auth
export const config = {
  matcher: [
    // Run middleware on these paths
    '/dashboard/:path*',
    '/account/:path*',
    '/login/:path*',
    '/register/:path*',
    '/forgot-password/:path*',
    '/admin/:path*',
  ],
}
