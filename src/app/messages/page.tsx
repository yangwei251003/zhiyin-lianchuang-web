import type { Metadata } from 'next'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guard'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Container } from '@/components/layout/Container'
import { MessageList } from '@/components/message/MessageList'

export const metadata: Metadata = {
  title: '消息中心 · 智印联创',
  description: '查看系统通知、订单消息与集采提醒。',
}

const PAGE_SIZE = 10

// 消息中心页（服务端组件）
// 静态导出时不支持 searchParams，使用默认参数，客户端组件处理筛选
export default async function MessagesPage() {
  const session = await requireAuth()
  const supabase = await createClient()

  const type = 'all'
  const unreadOnly = false
  const page = 1

  // 主查询：消息列表 + 总数
  let messagesQuery = supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)

  const { data, count } = await messagesQuery
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  // 未读总数（不受 type / unread 筛选影响，用于红点同步）
  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('is_read', false)

  return (
    <AuthGuard>
      <main className="pb-12">
        {/* ===== 页头 ===== */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #2A6CDB 0%, #4A85E6 60%, #5B8FE8 100%)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
            }}
          />
          <Container className="relative py-10 sm:py-12">
            <nav
              className="mb-3 text-xs text-white/70"
              aria-label="面包屑"
            >
              <Link href="/" className="hover:text-white">
                首页
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-white">消息中心</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Bell className="h-6 w-6 text-white" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  消息中心
                </h1>
                <p className="mt-1 text-sm text-white/80">
                  系统通知、订单消息与集采提醒，尽在掌握
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ===== 列表区 ===== */}
        <Container className="mt-6">
          <MessageList
            initialMessages={data ?? []}
            totalCount={count ?? 0}
            unreadCount={unreadCount ?? 0}
            currentPage={page}
            pageSize={PAGE_SIZE}
            filters={{ type, unread: unreadOnly }}
          />
        </Container>
      </main>
    </AuthGuard>
  )
}
