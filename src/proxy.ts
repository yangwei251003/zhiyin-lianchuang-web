import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// 需登录才能访问的路径前缀
const protectedPaths = [
  '/orders/publish',
  '/orders/publish-capacity',
  '/mine',
  '/messages',
  '/purchase/mine',
  '/ai-chat',
]

// 需企业认证（status === 'approved'）才能访问的路径前缀
const verifiedPaths = ['/orders/publish-capacity']

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p))
  const needsVerified = verifiedPaths.some((p) => pathname.startsWith(p))

  if (!needsAuth) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (needsVerified) {
    const { data: company } = await supabase
      .from('companies')
      .select('status')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (company?.status !== 'approved') {
      const authUrl = new URL('/mine/auth', request.url)
      return NextResponse.redirect(authUrl)
    }
  }

  // 供服务端守卫 requireAuth 读取当前路径
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
