'use client'

import { useRouter } from 'next/navigation'
import { Package, Users, TrendingUp } from 'lucide-react'
import type { Database } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PurchaseCountdown } from './PurchaseCountdown'
import {
  PURCHASE_STATUS_LABEL,
  PURCHASE_STATUS_VARIANT,
  PURCHASE_STATUS_BAR,
  formatPrice,
  calcProgress,
} from '@/lib/purchase-config'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']

export interface PurchaseCardProps {
  purchase: PurchaseRow
  className?: string
  /** 隐藏参团按钮并显示"已结束"标记（历史页用），卡片仍可点击跳转详情 */
  readOnly?: boolean
}

// 集采活动卡片：商品图 + 状态 + 标题 + 价格 + 进度条 + 倒计时 + 参团按钮
// 卡片始终可点击跳转详情；readOnly 仅控制底部按钮区域展示
export function PurchaseCard({
  purchase,
  className,
  readOnly = false,
}: PurchaseCardProps) {
  const router = useRouter()
  const statusVariant =
    PURCHASE_STATUS_VARIANT[purchase.status] ?? 'default'
  const statusLabel = PURCHASE_STATUS_LABEL[purchase.status] ?? purchase.status
  const statusBar = PURCHASE_STATUS_BAR[purchase.status] ?? 'bg-ink-tertiary'
  const progress = calcProgress(
    purchase.current_quantity,
    purchase.target_quantity,
  )
  const isActive = purchase.status === 'active'
  const detailHref = `/purchase/${purchase.id}`

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(detailHref)
  }

  const handleClick = () => router.push(detailHref)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(detailHref)
    }
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-sm',
        'cursor-pointer transition-all duration-base ease-out-expo',
        'hover:-translate-y-1 hover:shadow-lg hover:border-primary/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className,
      )}
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* 顶部：商品图 + 状态 Badge */}
      <div className="relative h-36 w-full overflow-hidden bg-canvas sm:h-40">
        {purchase.product_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={purchase.product_image}
            alt={purchase.product_name}
            className="h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
          />
        ) : (
          // 无图兜底：CSS 渐变 + 图标，符合视觉资源规则降级策略
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, #E8F1FB 0%, #F5F9FE 50%, #EBF9F3 100%)',
            }}
          >
            <Package
              className="h-12 w-12 text-primary/40"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        )}
        {/* 状态 Badge 浮层 */}
        <div className="absolute left-3 top-3">
          <Badge variant={statusVariant} size="md">
            {statusLabel}
          </Badge>
        </div>
        {/* 左侧状态色条 */}
        <div
          className={cn('absolute left-0 top-0 h-full w-1.5', statusBar)}
          aria-hidden
        />
      </div>

      {/* 内容区 */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* 标题 */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink-primary transition-colors group-hover:text-primary">
          {purchase.title}
        </h3>

        {/* 商品名 */}
        <div className="flex items-center gap-1.5 text-sm text-ink-secondary">
          <Package className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" />
          <span className="truncate">{purchase.product_name}</span>
        </div>

        {/* 价格 */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">
            ¥{formatPrice(purchase.unit_price)}
          </span>
          <span className="text-2xs text-ink-tertiary">元/件</span>
        </div>

        {/* 进度条 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-2xs text-ink-tertiary">
            <span className="inline-flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              {purchase.current_quantity} / {purchase.target_quantity}
            </span>
            <span className="font-medium text-ink-secondary">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-slow ease-out-expo',
                progress >= 100
                  ? 'bg-gradient-to-r from-success to-success-light'
                  : 'bg-gradient-to-r from-primary to-primary-light',
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 底部：倒计时 + 按钮 */}
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-line-light pt-2.5">
          <PurchaseCountdown
            endTime={purchase.end_time}
            className="scale-90 origin-left"
          />
          {readOnly ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-3 py-1.5 text-xs font-medium text-ink-tertiary">
              <TrendingUp className="h-3.5 w-3.5" />
              已结束
            </span>
          ) : (
            <Button
              size="sm"
              variant={isActive ? 'default' : 'outline'}
              disabled={!isActive}
              onClick={handleJoin}
              className="shrink-0"
            >
              {isActive ? '立即参团' : '已结束'}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
