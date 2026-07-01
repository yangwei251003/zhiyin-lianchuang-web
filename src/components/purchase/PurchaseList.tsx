'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { PurchaseCard } from './PurchaseCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { PURCHASE_STATUS_OPTIONS } from '@/lib/purchase-config'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']

export interface PurchaseListProps {
  initialPurchases: PurchaseRow[]
  totalCount: number
  currentPage: number
  pageSize: number
  filters: {
    status: string
    keyword: string
  }
}

// 构建集采商城 URL（仅保留有效参数）
function buildPurchaseUrl(next: {
  status: string
  keyword: string
  page: number
}): string {
  const params = new URLSearchParams()
  if (next.status && next.status !== 'all') params.set('status', next.status)
  if (next.keyword) params.set('keyword', next.keyword)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/purchase?${qs}` : '/purchase'
}

// 集采列表客户端组件
// 筛选/分页通过更新 URL 触发服务端重新查询（searchParams 驱动）
export function PurchaseList({
  initialPurchases,
  totalCount,
  currentPage,
  pageSize,
  filters,
}: PurchaseListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // 本地受控状态：与 URL 参数保持同步
  const [status, setStatus] = useState(filters.status)
  const [keyword, setKeyword] = useState(filters.keyword)

  // 当 URL 参数变化（如浏览器前进/后退）时同步本地状态
  useEffect(() => {
    setStatus(filters.status)
    setKeyword(filters.keyword)
  }, [filters.status, filters.keyword])

  // 关键词搜索防抖（500ms）
  useEffect(() => {
    const trimmed = keyword.trim()
    if (trimmed === filters.keyword) return
    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(
          buildPurchaseUrl({
            status,
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
    keyword?: string
    page?: number
  }) => {
    startTransition(() => {
      router.push(
        buildPurchaseUrl({
          status: next.status ?? status,
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

  const hasPurchases = initialPurchases.length > 0
  const hasFilters = filters.status !== 'all' || filters.keyword !== ''

  return (
    <div className="space-y-5">
      {/* ===== 筛选条 ===== */}
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="搜索活动标题或商品名"
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
              options={PURCHASE_STATUS_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              className="lg:w-36"
            />
            {(hasFilters || keyword) && (
              <Button
                variant="ghost"
                size="md"
                leftIcon={<X className="h-4 w-4" />}
                onClick={() => {
                  setStatus('all')
                  setKeyword('')
                  navigate({
                    status: 'all',
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
            共{' '}
            <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
            个集采活动
          </span>
        </div>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <PurchaseListSkeleton />
      ) : hasPurchases ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialPurchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            variant={hasFilters ? 'search' : 'default'}
            title={
              hasFilters ? '未找到符合条件的集采活动' : '集采商城暂无活动'
            }
            description={
              hasFilters
                ? '试试调整筛选条件或更换关键词'
                : '敬请期待新一轮集采活动上线'
            }
          />
        </div>
      )}

      {/* ===== 分页 ===== */}
      {!isPending && hasPurchases && (
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

// 集采列表骨架屏
function PurchaseListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-line bg-white"
        >
          <Skeleton className="h-36 w-full sm:h-40" />
          <div className="space-y-2.5 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between border-t border-line-light pt-2.5">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
