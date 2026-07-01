import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// 服务端 Supabase 客户端
// 适配 Next.js 16 App Router：cookies() 为异步，需 await
// createServerClient 会自动读写 cookie 以保持会话
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 在 Server Component 中调用 setAll 会抛错（只读 cookie），
            // 由 createServerClient 内部在中间件场景下处理，此处安全忽略
          }
        },
      },
    }
  )
}
