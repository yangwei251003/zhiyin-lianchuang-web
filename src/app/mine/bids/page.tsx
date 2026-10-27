import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guard'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { MyBidsList, type BidWithOrder } from '@/components/order/MyBidsList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '我的报价 · 智印联创',
  description: '查看我提交的全部报价记录。',
}

type BidRow = Database['public']['Tables']['bids']['Row']
type OrderRow = Database['public']['Tables']['orders']['Row']

const PAGE_SIZE = 10

interface MyBidsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 我的报价页（服务端组件）
// requireAuth 取当前用户，查询其提交的报价并关联 orders 取标题
export default async function MyBidsPage({
  searchParams,
}: MyBidsPageProps) {
  const session = await requireAuth()
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const status = params.status || 'all'

  const supabase = await createClient()

  // 1. 查询当前用户的报价（分页 + 状态筛选）
  let query = supabase
    .from('bids')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)

  if (status !== 'all') query = query.eq('status', status)

  const { data: bidsData, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const bids = (bidsData ?? []) as BidRow[]

  // 2. 批量关联订单标题
  const orderIds = Array.from(new Set(bids.map((b) => b.order_id)))
  const orderMap = new Map<
    string,
    Pick<OrderRow, 'id' | 'title' | 'status'>
  >()
  if (orderIds.length > 0) {
    const { data: orders } = (await supabase
      .from('orders')
      .select('id, title, status')
      .in('id', orderIds)) as {
      data: Pick<OrderRow, 'id' | 'title' | 'status'>[] | null
    }
    for (const o of orders ?? []) {
      orderMap.set(o.id, o)
    }
  }

  // 3. 组装带订单信息的报价列表
  const bidsWithOrder: BidWithOrder[] = bids.map((b) => {
    const order = orderMap.get(b.order_id)
    return {
      ...b,
      order_title: order?.title ?? '订单已删除',
      order_status: order?.status ?? '',
      order_exists: !!order,
    }
  })

  return (
    <main className="pb-12">
      <Container size="lg" className="pt-6">
        {/* 面包屑 + 标题 */}
        <nav
          className="mb-3 flex items-center gap-1.5 text-xs text-ink-tertiary"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <Link href="/mine" className="hover:text-primary">
            我的
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">我的报价</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            我的报价
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            查看我提交的全部报价记录与处理状态
          </p>
        </div>

        <AuthGuard>
          <MyBidsList
            initialBids={bidsWithOrder}
            totalCount={count ?? 0}
            currentPage={page}
            pageSize={PAGE_SIZE}
            currentStatus={status}
          />
        </AuthGuard>
      </Container>
    </main>
  )
}
