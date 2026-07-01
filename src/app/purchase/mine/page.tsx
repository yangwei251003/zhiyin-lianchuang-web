import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guard'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import {
  MyPurchaseList,
  type MyPurchaseItem,
} from '@/components/purchase/MyPurchaseList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '我的集采 · 智印联创',
  description: '管理我参与的全部集采订单。',
}

type PurchaseRow = Database['public']['Tables']['purchases']['Row']
type PurchaseOrderRow =
  Database['public']['Tables']['purchase_orders']['Row']

const PAGE_SIZE = 10

interface MyPurchasePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 我的集采页（服务端组件）
// requireAuth 取当前用户，查询其参团订单；状态/分页通过 searchParams 驱动
export default async function MyPurchasePage({
  searchParams,
}: MyPurchasePageProps) {
  const session = await requireAuth()
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const status = params.status || 'all'

  const supabase = await createClient()

  // 1. 查询当前用户的集采订单（分页 + 状态筛选）
  let query = supabase
    .from('purchase_orders')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)

  if (status !== 'all') query = query.eq('status', status)

  const { data: orders, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const orderList = (orders ?? []) as PurchaseOrderRow[]

  // 2. 批量查询关联活动信息（避免 N+1）
  const purchaseIds = Array.from(
    new Set(orderList.map((o) => o.purchase_id)),
  )
  const purchaseMap = new Map<string, PurchaseRow>()
  if (purchaseIds.length > 0) {
    const { data: purchases } = await supabase
      .from('purchases')
      .select('*')
      .in('id', purchaseIds)
    for (const p of (purchases ?? []) as PurchaseRow[]) {
      purchaseMap.set(p.id, p)
    }
  }

  // 3. 组装列表项：订单 + 关联活动
  const items: MyPurchaseItem[] = orderList.map((order) => {
    const purchase = purchaseMap.get(order.purchase_id) ?? null
    return {
      ...order,
      purchase: purchase
        ? {
            id: purchase.id,
            title: purchase.title,
            product_name: purchase.product_name,
            product_image: purchase.product_image,
            status: purchase.status,
          }
        : null,
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
          <Link href="/purchase" className="hover:text-primary">
            集采商城
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">我的集采</span>
        </nav>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-ink-primary sm:text-3xl">
              <ShoppingBag className="h-7 w-7 text-primary" />
              我的集采
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              管理我参与的全部集采订单
            </p>
          </div>
          <Link
            href="/purchase"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-white shadow-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-primary-light"
          >
            <ShoppingBag className="h-4 w-4" />
            逛逛商城
          </Link>
        </div>

        <AuthGuard>
          <MyPurchaseList
            initialOrders={items}
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
