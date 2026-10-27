'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarClock, Cog, MapPin } from 'lucide-react'
import type { Database } from '@/types/database'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type CapacityRow = Database['public']['Tables']['capacities']['Row']

export interface CapacityCardProps {
  capacity: CapacityRow
  className?: string
  /** 点击卡片跳转路径，默认 /orders/capacities/[id] */
  basePath?: string
  onClick?: (id: string) => void
}

type CapacityStatus = 'available' | 'busy' | 'offline'

interface StatusConfig {
  label: string
  variant: BadgeVariant
  dot: string
}

const statusConfig: Record<CapacityStatus, StatusConfig> = {
  available: { label: '可接单', variant: 'success', dot: 'bg-success' },
  busy: { label: '忙碌中', variant: 'warning', dot: 'bg-warning' },
  offline: { label: '已下线', variant: 'default', dot: 'bg-ink-tertiary' },
}

function getStatusConfig(status: string): StatusConfig {
  return statusConfig[status as CapacityStatus] ?? statusConfig.available
}

function formatPrice(value: number): string {
  return value.toLocaleString('zh-CN')
}

function formatDate(dateStr: string): string {
  // available_date 为 date 类型（YYYY-MM-DD），简化展示
  const parts = dateStr.split('-')
  if (parts.length >= 3) return `${parts[1]}-${parts[2]}`
  return dateStr
}

// 产能卡片：展示设备产能信息，点击跳转详情
export function CapacityCard({
  capacity,
  className,
  basePath = '/orders/capacities',
  onClick,
}: CapacityCardProps) {
  const router = useRouter()
  const status = getStatusConfig(capacity.status)

  const handleClick = () => {
    if (onClick) {
      onClick(capacity.id)
      return
    }
    router.push(`${basePath}/${capacity.id}`)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      className={cn(
        'group flex flex-col gap-2.5 rounded-2xl border border-line bg-canvas-card p-4 shadow-sm',
        'cursor-pointer transition-all duration-base ease-out-expo',
        'hover:-translate-y-1 hover:shadow-lg hover:border-primary/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className,
      )}
    >
      {/* 顶部：设备类型 + 状态 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary-bg text-primary">
            <Cog className="h-4 w-4" />
          </span>
          <h3 className="line-clamp-1 text-base font-semibold text-ink-primary transition-colors group-hover:text-primary">
            {capacity.device_type}
          </h3>
        </div>
        <Badge variant={status.variant} size="md">
          <span className={cn('mr-1 h-1.5 w-1.5 rounded-full', status.dot)} />
          {status.label}
        </Badge>
      </div>

      {/* 产能说明 */}
      <p className="line-clamp-2 text-sm leading-relaxed text-ink-secondary">
        {capacity.capacity}
      </p>

      {/* 参数胶囊：地区 / 可接单日期 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5 rounded-full bg-canvas px-2 py-0.5 text-2xs text-ink-secondary">
          <MapPin className="h-3 w-3" />
          {capacity.region}
        </span>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-canvas px-2 py-0.5 text-2xs text-ink-secondary">
          <CalendarClock className="h-3 w-3" />
          {formatDate(capacity.available_date)} 起
        </span>
      </div>

      {/* 底部：价格区间 + 发布时间 */}
      <div className="mt-1 flex items-end justify-between gap-2 border-t border-line-light pt-2.5">
        <div className="flex flex-col">
          <span className="text-2xs text-ink-tertiary">价格区间</span>
          <span className="text-base font-bold text-primary">
            ¥{formatPrice(capacity.price_min)}
            <span className="mx-0.5 text-ink-tertiary">~</span>
            ¥{formatPrice(capacity.price_max)}
          </span>
        </div>
        <span className="shrink-0 text-2xs text-ink-tertiary">
          {formatDistanceToNow(new Date(capacity.created_at), {
            addSuffix: true,
            locale: zhCN,
          })}
        </span>
      </div>
    </article>
  )
}
