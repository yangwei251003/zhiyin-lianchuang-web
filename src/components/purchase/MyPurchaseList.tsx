'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarClock, ChevronRight, Package, ShoppingBag } from 'lucide-react'
import type { Database } from '@/types/database'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/ui/Badge'
import {
  PURCHASE_ORDER_STATUS_OPTIONS,
  PURCHASE_ORDER_STATUS_LABEL,
  PURCHASE_ORDER_STATUS_VARIANT,
} from '@/lib/purchase-config'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']
type PurchaseOrderRow =
  Database['public']['Tables']['purchase_orders']['Row']

// 我的集采列表项：订单 + 关联活动信息
export type MyPurchaseItem = PurchaseOrderRow & {
  purchase: Pick<
    PurchaseRow,
    'id' | 'title' | 'product_name' | 'product_image' | 'status'
  > | null
}

export interface MyPurchaseListProps {
  initialOrders: MyPurchaseItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  currentStatus: string
}

// 构建我的集采 URL
function buildMineUrl(next: { status: string; page: number }): string {
  const params = new URLSearchParams()
  if (next.status && next.status !== 'all') params.set('status', next.status)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/purchase/mine?${qs}` : '/purchase/mine'
}

// 我的集采列表（客户端组件）
// 状态 Tab + 分页通过 URL searchParams 驱动服务端重新查询
export function MyPurchaseList({
  initialOrders,
  totalCount,
  currentPage,
  pageSize,
  currentStatus,
}: MyPurchaseListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navigate = (next: { status?: string; page?: number }) => {
    startTransition(() => {
      router.push(
        buildMineUrl({
          status: next.status ?? currentStatus,
          page: next.page ?? 1,
        }),
      )
    })
  }

  const hasOrders = initialOrders.length > 0

  return (
    <div className="space-y-5">
      {/* ===== 状态 Tab ===== */}
      <Tabs
        value={currentStatus}
        onValueChange={(v) => navigate({ status: v, page: 1 })}
      >
        <TabsList className="flex w-full overflow-x-auto sm:w-auto">
          {PURCHASE_ORDER_STATUS_OPTIONS.map((o) => (
            <TabsTrigger key={o.value} value={o.value}>
              {o.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between text-xs text-ink-tertiary">
        <span>
          共 <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
          条采购意向
        </span>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <MyPurchaseSkeleton />
      ) : hasOrders ? (
        <div className="space-y-3">
          {initialOrders.map((item) => (
            <MyPurchaseItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            title="您还没有提交采购意向"
            description="浏览公开采购信息，按需提交预计用量后进入沟通流程"
            action={
              <Link
                href="/purchase"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-white shadow-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-primary-light"
              >
                <ShoppingBag className="h-4 w-4" />
                浏览采购信息
              </Link>
            }
          />
        </div>
      )}

      {/* ===== 分页 ===== */}
      {!isPending && hasOrders && (
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onChange={(p) => navigate({ page: p })}
          className={cn('pt-2')}
        />
      )}
    </div>
  )
}

// 我的集采列表项卡片
function MyPurchaseItemCard({ item }: { item: MyPurchaseItem }) {
  const purchaseHref = item.purchase
    ? `/purchase/${item.purchase.id}`
    : '/purchase'
  const orderVariant =
    PURCHASE_ORDER_STATUS_VARIANT[item.status] ?? 'default'
  const orderLabel =
    PURCHASE_ORDER_STATUS_LABEL[item.status] ?? item.status
  const title = item.purchase?.title ?? '集采活动已下架'
  const productName = item.purchase?.product_name ?? '未知商品'

  return (
    <Link
      href={purchaseHref}
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-line bg-white p-4',
        'transition-colors duration-fast',
        'hover:border-primary/50 hover:bg-primary-bg-subtle/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-canvas text-primary">
        <Package className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </div>

      {/* 中：信息 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-ink-primary transition-colors group-hover:text-primary">
            {title}
          </h3>
          <Badge variant={orderVariant} size="sm">
            {orderLabel}
          </Badge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-ink-tertiary">
          <span className="inline-flex items-center gap-0.5">
            <Package className="h-3 w-3" />
            <span className="truncate">{productName}</span>
          </span>
          <span className="inline-flex items-center gap-0.5">
            <CalendarClock className="h-3 w-3" />
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2 border-t border-line-light pt-2">
          <div className="flex items-baseline gap-3">
            <span className="text-2xs text-ink-tertiary">
              预计数量{' '}
              <span className="font-semibold text-ink-secondary">
                {item.quantity}
              </span>{' '}
              件
            </span>
          </div>
        </div>
      </div>

      {/* 右：箭头 */}
      <ChevronRight className="h-5 w-5 shrink-0 text-ink-tertiary transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

// 我的集采骨架屏
function MyPurchaseSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-line bg-white p-4"
        >
          <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2.5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between border-t border-line-light pt-2">
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
