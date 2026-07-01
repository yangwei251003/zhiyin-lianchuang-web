import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// 浏览器端 Supabase 客户端
// 使用 @supabase/ssr 的 createBrowserClient，自动处理 cookie 同步
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
