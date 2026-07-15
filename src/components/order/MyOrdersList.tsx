'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { OrderCard } from './OrderCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { MY_ORDER_STATUS_OPTIONS } from '@/lib/order-config'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'

type OrderRow = Database['public']['Tables']['orders']['Row']

export interface MyOrdersListProps {
  initialOrders: OrderRow[]
  totalCount: number
  currentPage: number
  pageSize: number
  currentStatus: string
}

// 构建我的订单 URL
function buildMyOrdersUrl(next: {
  status: string
  page: number
}): string {
  const params = new URLSearchParams()
  if (next.status && next.status !== 'all')
    params.set('status', next.status)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/mine/orders?${qs}` : '/mine/orders'
}

// 我的订单列表（客户端组件）
// 状态 Tab + 分页通过 URL searchParams 驱动服务端重新查询
export function MyOrdersList({
  initialOrders,
  totalCount,
  currentPage,
  pageSize,
  currentStatus,
}: MyOrdersListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navigate = (next: { status?: string; page?: number }) => {
    startTransition(() => {
      router.push(
        buildMyOrdersUrl({
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
          {MY_ORDER_STATUS_OPTIONS.map((o) => (
            <TabsTrigger key={o.value} value={o.value}>
              {o.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between text-xs text-ink-tertiary">
        <span>
          共 <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
          条订单
        </span>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <MyOrdersSkeleton />
      ) : hasOrders ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {initialOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            title="您还没有发布过订单"
            description="发布您的印刷需求，让供应商主动报价"
            action={
              <Link href="/orders/publish">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  立即发布订单
                </Button>
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

// 我的订单骨架屏
function MyOrdersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-2.5 rounded-2xl border border-line bg-white p-4"
        >
          <Skeleton className="h-full w-1.5 shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between border-t border-line-light pt-2.5">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
