'use client'

import { CalendarClock, FileText, Handshake, Package } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { ReactNode } from 'react'
import type { Database } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { JoinPurchaseForm } from './JoinPurchaseForm'
import { SupplyOfferForm } from './SupplyOfferForm'
import {
  PURCHASE_STATUS_LABEL,
  PURCHASE_STATUS_VARIANT,
} from '@/lib/purchase-config'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']
type PurchaseOrderRow = Database['public']['Tables']['purchase_orders']['Row']

export interface PurchaseDetailProps {
  purchase: PurchaseRow
  myOrder: PurchaseOrderRow | null
  canSupply?: boolean
  mySupplyOffer?: Database['public']['Tables']['purchase_supply_offers']['Row'] | null
}

function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

// 采购详情只展示发布方填写的公开信息。价格、供货和交期不在平台内生成或承诺。
export function PurchaseDetail({ purchase, myOrder, canSupply = false, mySupplyOffer = null }: PurchaseDetailProps) {
  const statusVariant =
    PURCHASE_STATUS_VARIANT[purchase.status] ?? 'default'
  const statusLabel =
    PURCHASE_STATUS_LABEL[purchase.status] ?? purchase.status

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="space-y-6 lg:col-span-2">
        <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={statusVariant} size="md">{statusLabel}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-tertiary">
                    <Handshake className="h-3.5 w-3.5" />
                    采购意向撮合
                  </span>
                </div>
                <h1 className="text-xl font-bold leading-snug text-ink-primary sm:text-2xl">
                  {purchase.title}
                </h1>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-3 border-y border-line-light py-4 sm:grid-cols-2">
              <InfoItem
                icon={<Package className="h-4 w-4" />}
                label="采购物资"
                value={purchase.product_name}
              />
              <InfoItem
                icon={<CalendarClock className="h-4 w-4" />}
                label="信息收集截止"
                value={formatDateTime(purchase.end_time)}
              />
              <InfoItem
                icon={<CalendarClock className="h-4 w-4" />}
                label="信息发布时间"
                value={formatDateTime(purchase.start_time)}
              />
              <InfoItem
                icon={<Handshake className="h-4 w-4" />}
                label="后续流程"
                value="平台协助建立供需沟通"
              />
            </dl>

            {purchase.description && (
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-tertiary">
                  <FileText className="h-3.5 w-3.5" />
                  需求说明
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-ink-secondary">
                  {purchase.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-l-2 border-primary bg-primary-bg-subtle px-4 py-3 text-sm leading-6 text-ink-secondary">
          平台当前仅提供采购意向收集和沟通辅助服务，不提供在线支付、资金监管、报价承诺或质量担保。实际合作请由供需双方自行确认并留存凭证。
        </div>
      </section>

      <aside className="lg:col-span-1">
        <div className="lg:sticky lg:top-6">
          <JoinPurchaseForm purchase={purchase} myOrder={myOrder} />
          {canSupply && <SupplyOfferForm purchaseId={purchase.id} existing={mySupplyOffer} />}
        </div>
      </aside>
    </div>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-2">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-ink-tertiary">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-ink-primary">{value}</dd>
      </div>
    </div>
  )
}
