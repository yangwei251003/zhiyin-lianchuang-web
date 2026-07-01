'use client'

import {
  CalendarClock,
  FileText,
  Package,
  ShoppingCart,
  Target,
  Users,
} from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { Database } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PurchaseCountdown } from './PurchaseCountdown'
import { JoinPurchaseForm } from './JoinPurchaseForm'
import { AIPurchaseAdvice } from './AIPurchaseAdvice'
import {
  PURCHASE_STATUS_LABEL,
  PURCHASE_STATUS_VARIANT,
  formatPrice,
  calcProgress,
} from '@/lib/purchase-config'
import { cn } from '@/lib/utils'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']
type PurchaseOrderRow =
  Database['public']['Tables']['purchase_orders']['Row']

export interface PurchaseDetailProps {
  purchase: PurchaseRow
  myOrder: PurchaseOrderRow | null
  /** 已参团人数（purchase_orders 总数） */
  orderCount: number
}

function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

// 集采详情客户端组件
// 整合：活动信息卡 + 倒计时 + 参团表单 + AI 建议 + 参团记录
export function PurchaseDetail({
  purchase,
  myOrder,
  orderCount,
}: PurchaseDetailProps) {
  const statusVariant =
    PURCHASE_STATUS_VARIANT[purchase.status] ?? 'default'
  const statusLabel =
    PURCHASE_STATUS_LABEL[purchase.status] ?? purchase.status
  const progress = calcProgress(
    purchase.current_quantity,
    purchase.target_quantity,
  )
  const isActive = purchase.status === 'active'

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* ===== 左栏：活动信息 + 倒计时 + 描述 + 参团记录 ===== */}
      <div className="space-y-6 lg:col-span-2">
        {/* 活动信息卡 */}
        <Card padding="lg" className="animate-fade-in-up">
          <div className="flex flex-col gap-4">
            {/* 标题 + 状态 */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariant} size="md">
                    {statusLabel}
                  </Badge>
                  <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-2xs text-ink-secondary">
                    <ShoppingCart className="h-3 w-3" />
                    集采活动
                  </span>
                </div>
                <h1 className="text-xl font-bold leading-snug text-ink-primary sm:text-2xl">
                  {purchase.title}
                </h1>
              </div>
            </div>

            {/* 商品图 + 信息网格 */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* 商品图 */}
              <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-canvas sm:w-48">
                {purchase.product_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={purchase.product_image}
                    alt={purchase.product_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
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
              </div>

              {/* 关键参数 */}
              <div className="grid flex-1 grid-cols-2 gap-3">
                <InfoItem
                  icon={<Package className="h-4 w-4" />}
                  label="商品名称"
                  value={purchase.product_name}
                />
                <InfoItem
                  icon={<Target className="h-4 w-4" />}
                  label="集采单价"
                  value={`¥${formatPrice(purchase.unit_price)}/件`}
                  highlight
                />
                <InfoItem
                  icon={<ShoppingCart className="h-4 w-4" />}
                  label="起订量"
                  value={`${purchase.min_quantity} 件`}
                />
                <InfoItem
                  icon={<Users className="h-4 w-4" />}
                  label="目标量"
                  value={`${purchase.target_quantity} 件`}
                />
                <InfoItem
                  icon={<CalendarClock className="h-4 w-4" />}
                  label="开始时间"
                  value={formatDateTime(purchase.start_time)}
                />
                <InfoItem
                  icon={<CalendarClock className="h-4 w-4" />}
                  label="截止时间"
                  value={formatDateTime(purchase.end_time)}
                />
              </div>
            </div>

            {/* 进度条 */}
            <div className="space-y-2 rounded-lg bg-canvas p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-secondary">
                  <Users className="h-4 w-4 text-primary" />
                  集采进度
                </span>
                <span className="text-sm font-bold text-primary">
                  {progress}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white">
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
              <div className="flex items-center justify-between text-2xs text-ink-tertiary">
                <span>
                  已参团{' '}
                  <span className="font-semibold text-ink-secondary">
                    {purchase.current_quantity}
                  </span>{' '}
                  件
                </span>
                <span>
                  目标{' '}
                  <span className="font-semibold text-ink-secondary">
                    {purchase.target_quantity}
                  </span>{' '}
                  件
                </span>
              </div>
            </div>

            {/* 描述 */}
            {purchase.description && (
              <div className="rounded-lg bg-canvas p-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-tertiary">
                  <FileText className="h-3.5 w-3.5" />
                  活动详情
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">
                  {purchase.description}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 倒计时区（大字号） */}
        {isActive && (
          <Card padding="lg" className="animate-fade-in-up">
            <div className="flex flex-col items-center gap-3 py-2">
              <span className="text-sm font-medium text-ink-secondary">
                距活动结束
              </span>
              <PurchaseCountdown
                endTime={purchase.end_time}
                className="scale-125"
              />
            </div>
          </Card>
        )}

        {/* 参团记录（可选） */}
        <Card padding="lg" className="animate-fade-in-up">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-ink-primary">参团记录</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-canvas p-4 text-center">
              <p className="text-3xl font-bold text-primary">{orderCount}</p>
              <p className="mt-1 text-2xs text-ink-tertiary">参团人次</p>
            </div>
            <div className="rounded-lg bg-canvas p-4 text-center">
              <p className="text-3xl font-bold text-success">
                {purchase.current_quantity}
              </p>
              <p className="mt-1 text-2xs text-ink-tertiary">累计件数</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ===== 右栏：参团表单 + AI 建议（桌面 sticky） ===== */}
      <div className="space-y-6 lg:col-span-1">
        <div className="lg:sticky lg:top-6 space-y-6">
          <JoinPurchaseForm purchase={purchase} myOrder={myOrder} />
          <AIPurchaseAdvice purchase={purchase} />
        </div>
      </div>
    </div>
  )
}

// 信息项：图标 + 标签 + 值
function InfoItem({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-lg border border-line-light p-3">
      <div className="mb-1 flex items-center gap-1 text-2xs text-ink-tertiary">
        <span className="text-ink-tertiary">{icon}</span>
        {label}
      </div>
      <p
        className={cn(
          'truncate text-sm font-medium',
          highlight ? 'text-primary font-bold' : 'text-ink-primary',
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  )
}
