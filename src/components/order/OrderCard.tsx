'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarClock, MapPin, MessageSquare, Wrench } from 'lucide-react'
import type { Database } from '@/types/database'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type OrderRow = Database['public']['Tables']['orders']['Row']

// 关联字段可选（如列表页聚合了 bid_count）
export interface OrderCardProps {
  order: OrderRow & { bid_count?: number }
  className?: string
  /** 点击卡片跳转的根路径，默认 /orders */
  basePath?: string
  onClick?: (id: string) => void
}

type OrderStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'

interface StatusConfig {
  label: string
  variant: BadgeVariant
  /** 左侧色块颜色 */
  bar: string
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
  open: { label: '招标中', variant: 'primary', bar: 'bg-primary' },
  in_progress: { label: '进行中', variant: 'warning', bar: 'bg-warning' },
  completed: { label: '已完成', variant: 'success', bar: 'bg-success' },
  cancelled: { label: '已取消', variant: 'default', bar: 'bg-ink-tertiary' },
}

// 分类色块（按印刷品类目区分色相）
const categoryBarMap: Record<string, string> = {
  画册: 'bg-primary',
  海报: 'bg-success',
  包装盒: 'bg-warning',
  手提袋: 'bg-accent',
  名片: 'bg-deep',
  其他: 'bg-ink-tertiary',
}

function getStatusConfig(status: string): StatusConfig {
  return statusConfig[status as OrderStatus] ?? statusConfig.open
}

function formatBudget(value: number): string {
  return value.toLocaleString('zh-CN')
}

// 订单卡片仅展示发布者填写或系统真实聚合的信息。
export function OrderCard({
  order,
  className,
  basePath = '/orders',
  onClick,
}: OrderCardProps) {
  const router = useRouter()
  const status = getStatusConfig(order.status)
  const categoryBar = categoryBarMap[order.category] ?? 'bg-primary'

  const handleClick = () => {
    if (onClick) {
      onClick(order.id)
      return
    }
    router.push(`${basePath}/${order.id}`)
  }

  const chips = [order.craft, order.region].filter(Boolean)

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
        'group relative flex overflow-hidden rounded-lg border border-line bg-white',
        'cursor-pointer transition-colors duration-fast',
        'hover:border-primary/50 hover:bg-primary-bg-subtle/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className,
      )}
    >
      {/* 左侧分类色块 */}
      <div className={cn('w-1.5 shrink-0', categoryBar)} aria-hidden />

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* 顶部：分类与状态 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-md bg-primary-bg px-2 py-1 text-xs font-semibold text-primary">
              {order.category}
            </span>
          </div>
          <Badge variant={status.variant} size="md">
            {status.label}
          </Badge>
        </div>

        {/* 标题：粗体、最多两行 */}
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-ink-primary transition-colors group-hover:text-primary">
          {order.title}
        </h3>

        {/* 描述：灰色、最多两行 */}
        {order.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-secondary">
            {order.description}
          </p>
        )}

        {/* 需求要点 */}
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {order.craft && (
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-2xs text-ink-secondary">
                <Wrench className="h-3 w-3" />
                {order.craft}
              </span>
            )}
            {order.region && (
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-2xs text-ink-secondary">
                <MapPin className="h-3 w-3" />
                {order.region}
              </span>
            )}
            {typeof order.bid_count === 'number' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-2xs text-ink-secondary">
                <MessageSquare className="h-3 w-3" />
                {order.bid_count} 条沟通记录
              </span>
            )}
          </div>
        )}

        {/* 底部：预算区间与发布时间 */}
        <div className="mt-1 flex items-end justify-between gap-2 border-t border-line-light pt-2.5">
          <div className="flex flex-col">
            <span className="text-2xs text-ink-tertiary">发布预算区间</span>
            <span className="text-sm font-semibold text-ink-primary">
              ¥{formatBudget(order.budget_min)}
              <span className="mx-0.5 text-ink-tertiary">~</span>
              ¥{formatBudget(order.budget_max)}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-2xs text-ink-tertiary">
            <CalendarClock className="h-3 w-3" />
            {formatDistanceToNow(new Date(order.created_at), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
      </div>
    </article>
  )
}
