'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { OrderCard } from './OrderCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import {
  ORDER_CATEGORIES,
  ORDER_STATUS_OPTIONS,
} from '@/lib/order-config'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'

type OrderRow = Database['public']['Tables']['orders']['Row']

export interface OrderListProps {
  initialOrders: (OrderRow & { bid_count: number })[]
  totalCount: number
  currentPage: number
  pageSize: number
  filters: {
    status: string
    category: string
    keyword: string
  }
}

// 构建订单大厅 URL（仅保留有效参数）
function buildOrdersUrl(next: {
  status: string
  category: string
  keyword: string
  page: number
}): string {
  const params = new URLSearchParams()
  if (next.status && next.status !== 'all') params.set('status', next.status)
  if (next.category && next.category !== 'all')
    params.set('category', next.category)
  if (next.keyword) params.set('keyword', next.keyword)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/orders?${qs}` : '/orders'
}

// 订单列表客户端组件
// 筛选/分页通过更新 URL 触发服务端重新查询（searchParams 驱动）
export function OrderList({
  initialOrders,
  totalCount,
  currentPage,
  pageSize,
  filters,
}: OrderListProps) {
  const filterKey = `${filters.status}:${filters.category}:${filters.keyword}`

  return (
    <OrderListContent
      key={filterKey}
      initialOrders={initialOrders}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      filters={filters}
    />
  )
}

function OrderListContent({
  initialOrders,
  totalCount,
  currentPage,
  pageSize,
  filters,
}: OrderListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // 本地受控状态：与 URL 参数保持同步
  const [status, setStatus] = useState(filters.status)
  const [category, setCategory] = useState(filters.category)
  const [keyword, setKeyword] = useState(filters.keyword)

  // 关键词搜索防抖（500ms）
  useEffect(() => {
    const trimmed = keyword.trim()
    if (trimmed === filters.keyword) return
    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(
          buildOrdersUrl({
            status,
            category,
            keyword: trimmed,
            page: 1,
          }),
        )
      })
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  const navigate = (next: {
    status?: string
    category?: string
    keyword?: string
    page?: number
  }) => {
    startTransition(() => {
      router.push(
        buildOrdersUrl({
          status: next.status ?? status,
          category: next.category ?? category,
          keyword: (next.keyword ?? keyword).trim(),
          page: next.page ?? 1,
        }),
      )
    })
  }

  const onStatusChange = (value: string) => {
    setStatus(value)
    navigate({ status: value, page: 1 })
  }

  const onCategoryChange = (value: string) => {
    setCategory(value)
    navigate({ category: value, page: 1 })
  }

  const hasOrders = initialOrders.length > 0
  const hasFilters =
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.keyword !== ''

  return (
    <div className="space-y-5">
      {/* ===== 筛选条 ===== */}
      <div className="border border-line bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="搜索订单标题或描述"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:flex lg:w-auto lg:items-end">
            <Select
              label="状态"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              options={ORDER_STATUS_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              className="lg:w-32"
            />
            <Select
              label="分类"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              options={[
                { value: 'all', label: '全部' },
                ...ORDER_CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
              className="lg:w-32"
            />
            {(hasFilters || keyword) && (
              <Button
                variant="ghost"
                size="md"
                leftIcon={<X className="h-4 w-4" />}
                onClick={() => {
                  setStatus('all')
                  setCategory('all')
                  setKeyword('')
                  navigate({
                    status: 'all',
                    category: 'all',
                    keyword: '',
                    page: 1,
                  })
                }}
                className="lg:mb-0"
              >
                清空
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-tertiary">
          <span>
            已找到 <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
            条公开需求
          </span>
        </div>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <OrderListSkeleton />
      ) : hasOrders ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {initialOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="border border-line bg-white">
          <EmptyState
            variant={hasFilters ? 'search' : 'default'}
            title={hasFilters ? '未找到符合条件的需求' : '暂未收录公开需求'}
            description={
              hasFilters
                ? '试试调整筛选条件或更换关键词'
                : '发布需求后，平台会按流程审核并安排撮合沟通'
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

// 订单列表骨架屏
function OrderListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-2.5 rounded-lg border border-line bg-white p-4"
        >
          <Skeleton className="h-full w-1.5 shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-14" />
            </div>
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
