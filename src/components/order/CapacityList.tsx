'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { CapacityCard } from './CapacityCard'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import {
  CAPACITY_DEVICES,
  CAPACITY_STATUS_OPTIONS,
  REGIONS,
} from '@/lib/order-config'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'

type CapacityRow = Database['public']['Tables']['capacities']['Row']

export interface CapacityListProps {
  initialCapacities: CapacityRow[]
  totalCount: number
  currentPage: number
  pageSize: number
  filters: {
    deviceType: string
    region: string
    status: string
  }
}

// 构建产能大厅 URL
function buildCapacitiesUrl(next: {
  deviceType: string
  region: string
  status: string
  page: number
}): string {
  const params = new URLSearchParams()
  if (next.deviceType && next.deviceType !== 'all')
    params.set('device_type', next.deviceType)
  if (next.region && next.region !== 'all')
    params.set('region', next.region)
  if (next.status && next.status !== 'all') params.set('status', next.status)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/orders/capacities?${qs}` : '/orders/capacities'
}

// 产能列表客户端组件
export function CapacityList({
  initialCapacities,
  totalCount,
  currentPage,
  pageSize,
  filters,
}: CapacityListProps) {
  const filterKey = `${filters.deviceType}:${filters.region}:${filters.status}`
  return <CapacityListContent key={filterKey} initialCapacities={initialCapacities} totalCount={totalCount} currentPage={currentPage} pageSize={pageSize} filters={filters} />
}

function CapacityListContent({
  initialCapacities,
  totalCount,
  currentPage,
  pageSize,
  filters,
}: CapacityListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [deviceType, setDeviceType] = useState(filters.deviceType)
  const [region, setRegion] = useState(filters.region)
  const [status, setStatus] = useState(filters.status)

  const navigate = (next: {
    deviceType?: string
    region?: string
    status?: string
    page?: number
  }) => {
    startTransition(() => {
      router.push(
        buildCapacitiesUrl({
          deviceType: next.deviceType ?? deviceType,
          region: next.region ?? region,
          status: next.status ?? status,
          page: next.page ?? 1,
        }),
      )
    })
  }

  const hasFilters =
    filters.deviceType !== 'all' ||
    filters.region !== 'all' ||
    filters.status !== 'all'

  const hasItems = initialCapacities.length > 0

  return (
    <div className="space-y-5">
      {/* ===== 筛选条 ===== */}
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="设备类型"
            value={deviceType}
            onChange={(e) => {
              setDeviceType(e.target.value)
              navigate({ deviceType: e.target.value, page: 1 })
            }}
            options={[
              { value: 'all', label: '全部' },
              ...CAPACITY_DEVICES.map((d) => ({ value: d, label: d })),
            ]}
          />
          <Select
            label="地区"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              navigate({ region: e.target.value, page: 1 })
            }}
            options={[
              { value: 'all', label: '全部' },
              ...REGIONS.map((r) => ({ value: r, label: r })),
            ]}
          />
          <Select
            label="状态"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              navigate({ status: e.target.value, page: 1 })
            }}
            options={CAPACITY_STATUS_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-tertiary">
            共 <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
            条产能
          </span>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => {
                setDeviceType('all')
                setRegion('all')
                setStatus('all')
                navigate({
                  deviceType: 'all',
                  region: 'all',
                  status: 'all',
                  page: 1,
                })
              }}
            >
              清空筛选
            </Button>
          )}
        </div>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <CapacityListSkeleton />
      ) : hasItems ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {initialCapacities.map((c) => (
            <CapacityCard key={c.id} capacity={c} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            variant={hasFilters ? 'search' : 'default'}
            title={hasFilters ? '未找到符合条件的产能' : '产能大厅暂无产能'}
            description={
              hasFilters
                ? '试试调整筛选条件'
                : '成为第一个发布产能的供应商'
            }
          />
        </div>
      )}

      {/* ===== 分页 ===== */}
      {!isPending && hasItems && (
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

// 产能列表骨架屏
function CapacityListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="space-y-2.5 rounded-2xl border border-line bg-white p-4"
        >
          <div className="flex justify-between">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex justify-between border-t border-line-light pt-2.5">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
