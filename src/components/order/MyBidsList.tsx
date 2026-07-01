'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronRight, CalendarClock, Wallet, Gavel } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { BID_STATUS_OPTIONS, ORDER_STATUS_LABEL } from '@/lib/order-config'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'

type BidRow = Database['public']['Tables']['bids']['Row']

// 带订单信息的报价（服务端关联组装）
export interface BidWithOrder extends BidRow {
  order_title: string
  order_status: string
  order_exists: boolean
}

export interface MyBidsListProps {
  initialBids: BidWithOrder[]
  totalCount: number
  currentPage: number
  pageSize: number
  currentStatus: string
}

// 报价状态 → Badge 样式
const bidStatusVariantMap: Record<string, BadgeVariant> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'default',
}

const bidStatusLabel: Record<string, string> = {
  pending: '待处理',
  accepted: '已采纳',
  rejected: '已拒绝',
}

// 构建我的报价 URL
function buildMyBidsUrl(next: { status: string; page: number }): string {
  const params = new URLSearchParams()
  if (next.status && next.status !== 'all')
    params.set('status', next.status)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/mine/bids?${qs}` : '/mine/bids'
}

function formatPrice(value: number): string {
  return value.toLocaleString('zh-CN')
}

function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

// 我的报价列表（客户端组件）
// 状态 Tab + 分页通过 URL searchParams 驱动；点击跳转对应订单详情
export function MyBidsList({
  initialBids,
  totalCount,
  currentPage,
  pageSize,
  currentStatus,
}: MyBidsListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navigate = (next: { status?: string; page?: number }) => {
    startTransition(() => {
      router.push(
        buildMyBidsUrl({
          status: next.status ?? currentStatus,
          page: next.page ?? 1,
        }),
      )
    })
  }

  const hasBids = initialBids.length > 0

  return (
    <div className="space-y-5">
      {/* ===== 状态 Tab ===== */}
      <Tabs
        value={currentStatus}
        onValueChange={(v) => navigate({ status: v, page: 1 })}
      >
        <TabsList className="flex w-full overflow-x-auto sm:w-auto">
          {BID_STATUS_OPTIONS.map((o) => (
            <TabsTrigger key={o.value} value={o.value}>
              {o.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="text-xs text-ink-tertiary">
        共 <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
        条报价
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <MyBidsSkeleton />
      ) : hasBids ? (
        <div className="space-y-3">
          {initialBids.map((bid) => {
            const variant =
              bidStatusVariantMap[bid.status] ?? 'default'
            const label = bidStatusLabel[bid.status] ?? bid.status
            const orderStatusText = bid.order_exists
              ? ORDER_STATUS_LABEL[bid.order_status] ?? ''
              : ''
            return (
              <article
                key={bid.id}
                role="link"
                tabIndex={bid.order_exists ? 0 : -1}
                onClick={() => {
                  if (bid.order_exists) {
                    router.push(`/orders/${bid.order_id}`)
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    bid.order_exists &&
                    (e.key === 'Enter' || e.key === ' ')
                  ) {
                    e.preventDefault()
                    router.push(`/orders/${bid.order_id}`)
                  }
                }}
                className={cn(
                  'group rounded-xl border border-line bg-white p-4 shadow-sm transition-all duration-base ease-out-expo',
                  bid.order_exists
                    ? 'cursor-pointer hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
                    : 'opacity-75',
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* 左：订单标题 + 报价信息 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 shrink-0 text-primary" />
                      <h3
                        className={cn(
                          'truncate text-sm font-semibold text-ink-primary transition-colors',
                          bid.order_exists && 'group-hover:text-primary',
                        )}
                        title={bid.order_title}
                      >
                        {bid.order_title}
                      </h3>
                      {!bid.order_exists && (
                        <span className="shrink-0 text-2xs text-ink-tertiary">
                          （订单已删除）
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-tertiary">
                      <span className="inline-flex items-center gap-0.5">
                        <Wallet className="h-3 w-3" />
                        报价 ¥{formatPrice(bid.price)}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <CalendarClock className="h-3 w-3" />
                        {bid.delivery_days} 天交货
                      </span>
                      <span>{formatDateTime(bid.created_at)}</span>
                    </div>
                    {bid.note && (
                      <p className="mt-1.5 line-clamp-1 text-xs text-ink-secondary">
                        {bid.note}
                      </p>
                    )}
                  </div>

                  {/* 右：状态 + 金额 */}
                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={variant} size="md">
                        {label}
                      </Badge>
                      {orderStatusText && (
                        <span className="text-2xs text-ink-tertiary">
                          订单{orderStatusText}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-bold text-primary">
                      ¥{formatPrice(bid.price)}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            title="您还没有提交过报价"
            description="前往订单大厅，给您能承接的需求报价吧"
            action={
              <Link
                href="/orders"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white shadow-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-primary-light"
              >
                去订单大厅
              </Link>
            }
          />
        </div>
      )}

      {/* ===== 分页 ===== */}
      {!isPending && hasBids && (
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

// 我的报价骨架屏
function MyBidsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="space-y-2.5 rounded-xl border border-line bg-white p-4"
        >
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}
