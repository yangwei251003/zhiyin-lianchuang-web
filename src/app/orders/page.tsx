import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Factory } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { OrderList } from '@/components/order/OrderList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '订单大厅 · 智印联创',
  description: '浏览全部印刷需求订单，在线投标接单。',
}

type OrderRow = Database['public']['Tables']['orders']['Row']

const PAGE_SIZE = 10

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 订单大厅列表页（服务端组件）
// 筛选/分页通过 URL searchParams 驱动：服务端读取参数重新查询
export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const status = params.status || 'all'
  const category = params.category || 'all'
  const keyword = (params.keyword || '').trim()

  const supabase = await createClient()

  // 主查询：订单列表 + 总数
  let ordersQuery = supabase
    .from('orders')
    .select('*', { count: 'exact' })

  if (status !== 'all') ordersQuery = ordersQuery.eq('status', status)
  if (category !== 'all') ordersQuery = ordersQuery.eq('category', category)
  if (keyword) {
    // 标题 / 描述模糊匹配（ilike 大小写不敏感）
    const kw = keyword.replace(/,/g, '\\,')
    ordersQuery = ordersQuery.or(
      `title.ilike.%${kw}%,description.ilike.%${kw}%`,
    )
  }

  const { data: orders, count } = await ordersQuery
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const orderList = orders ?? []

  // 批量查询当前页订单的报价数（避免 N+1）
  const orderIds = orderList.map((o) => o.id)
  const bidCountMap = new Map<string, number>()
  if (orderIds.length > 0) {
    const { data: bids } = await supabase
      .from('bids')
      .select('order_id')
      .in('order_id', orderIds)
    for (const b of bids ?? []) {
      bidCountMap.set(
        b.order_id,
        (bidCountMap.get(b.order_id) ?? 0) + 1,
      )
    }
  }

  const ordersWithCount: (OrderRow & { bid_count: number })[] =
    orderList.map((o) => ({
      ...o,
      bid_count: bidCountMap.get(o.id) ?? 0,
    }))

  return (
    <main className="pb-12">
      {/* ===== 页头：标题 + 行动按钮 ===== */}
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
            <span className="text-white">订单大厅</span>
          </nav>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            订单大厅
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            汇集全网印刷需求，在线投标接单，让产能变现更高效
          </p>

          {/* 行动按钮 */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orders/publish"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-primary shadow-md transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              发布订单
            </Link>
            <Link
              href="/orders/publish-capacity"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-white/20"
            >
              <Factory className="h-4 w-4" />
              发布产能
            </Link>
            <Link
              href="/orders/capacities"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-white/20"
            >
              查看产能
            </Link>
          </div>
        </Container>
      </section>

      {/* ===== 列表区：筛选 + 卡片 + 分页（客户端交互） ===== */}
      <Container className="mt-6">
        <OrderList
          initialOrders={ordersWithCount}
          totalCount={count ?? 0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          filters={{ status, category, keyword }}
        />
      </Container>
    </main>
  )
}
