import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  CalendarClock,
  MapPin,
  MessageSquare,
  User as UserIcon,
  Wallet,
  Wrench,
  Tag,
  FileText,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/common/EmptyState'
import { OrderDetailActions } from '@/components/order/OrderDetailActions'
import { ORDER_STATUS_LABEL } from '@/lib/order-config'
import type { Database } from '@/types/database'

type OrderRow = Database['public']['Tables']['orders']['Row']
type BidRow = Database['public']['Tables']['bids']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

// 状态 → Badge 样式映射（与 OrderCard 保持一致）
const statusVariantMap: Record<string, BadgeVariant> = {
  open: 'primary',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'default',
}

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

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return [{ id: '1' }]
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('title')
    .eq('id', id)
    .maybeSingle()
  if (!order) return { title: '订单详情 · 智印联创' }
  return {
    title: `${order.title} · 订单详情 · 智印联创`,
    description: `查看 ${order.title} 的详细需求与报价`,
  }
}

function formatBudget(value: number): string {
  return value.toLocaleString('zh-CN')
}

function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

// 订单详情页（服务端组件）
export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. 获取订单详情
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!order) notFound()
  const orderRow = order as OrderRow

  // 2. 获取发布者资料
  const { data: publisher } = (await supabase
    .from('profiles')
    .select('id, nickname, avatar_url')
    .eq('id', orderRow.user_id)
    .maybeSingle()) as { data: Pick<ProfileRow, 'id' | 'nickname' | 'avatar_url'> | null }

  // 3. 获取报价列表（按时间倒序）
  const { data: bidsData } = await supabase
    .from('bids')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: false })

  const bids = (bidsData ?? []) as BidRow[]

  // 4. 批量获取报价者资料
  const bidderIds = Array.from(new Set(bids.map((b) => b.user_id)))
  const bidderProfileMap = new Map<
    string,
    Pick<ProfileRow, 'id' | 'nickname' | 'avatar_url'>
  >()
  if (bidderIds.length > 0) {
    const { data: bidderProfiles } = (await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .in('id', bidderIds)) as {
      data: Pick<ProfileRow, 'id' | 'nickname' | 'avatar_url'>[] | null
    }
    for (const p of bidderProfiles ?? []) {
      bidderProfileMap.set(p.id, p)
    }
  }

  // 5. 当前会话（不强制登录，仅用于判断归属与按钮展示）
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const currentUserId = session?.user.id ?? null
  const isLoggedIn = !!session
  const isOwner = currentUserId === orderRow.user_id

  const statusVariant =
    statusVariantMap[orderRow.status] ?? 'primary'
  const statusLabel =
    ORDER_STATUS_LABEL[orderRow.status] ?? orderRow.status

  return (
    <main className="pb-12">
      {/* ===== 面包屑 ===== */}
      <Container className="pt-6">
        <nav
          className="flex items-center gap-1.5 text-xs text-ink-tertiary"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <Link href="/orders" className="hover:text-primary">
            订单大厅
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">订单详情</span>
        </nav>
      </Container>

      <Container size="lg" className="mt-4 space-y-6">
        {/* ===== 订单信息卡 ===== */}
        <Card padding="lg" className="animate-fade-in-up">
          <div className="flex flex-col gap-4">
            {/* 标题 + 状态 */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary-bg px-2.5 py-0.5 text-xs font-medium text-primary">
                    {orderRow.category}
                  </span>
                  <Badge variant={statusVariant} size="md">
                    {statusLabel}
                  </Badge>
                </div>
                <h1 className="text-xl font-bold leading-snug text-ink-primary sm:text-2xl">
                  {orderRow.title}
                </h1>
              </div>
            </div>

            {/* 描述 */}
            {orderRow.description && (
              <div className="rounded-lg bg-canvas p-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-tertiary">
                  <FileText className="h-3.5 w-3.5" />
                  需求描述
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">
                  {orderRow.description}
                </p>
              </div>
            )}

            {/* 参数网格 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoItem
                icon={<Wrench className="h-4 w-4" />}
                label="工艺"
                value={orderRow.craft}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label="地区"
                value={orderRow.region}
              />
              <InfoItem
                icon={<Wallet className="h-4 w-4" />}
                label="预算"
                value={`¥${formatBudget(orderRow.budget_min)} ~ ¥${formatBudget(orderRow.budget_max)}`}
              />
              <InfoItem
                icon={<CalendarClock className="h-4 w-4" />}
                label="发布时间"
                value={formatDateTime(orderRow.created_at)}
              />
            </div>

            {/* 发布者 */}
            {publisher && (
              <div className="flex items-center gap-2 border-t border-line-light pt-3 text-sm text-ink-secondary">
                <UserIcon className="h-4 w-4 text-ink-tertiary" />
                <span>发布者：</span>
                {publisher.avatar_url ? (
                  <span
                    className="h-5 w-5 rounded-full bg-cover bg-center ring-1 ring-line"
                    style={{ backgroundImage: `url(${publisher.avatar_url})` }}
                    aria-hidden
                  />
                ) : (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-2xs font-medium text-white">
                    {publisher.nickname?.[0] ?? 'U'}
                  </span>
                )}
                <span className="font-medium text-ink-primary">
                  {publisher.nickname}
                </span>
              </div>
            )}

            {/* 行动按钮（客户端交互） */}
            <div className="border-t border-line-light pt-4">
              <OrderDetailActions
                orderId={orderRow.id}
                orderStatus={orderRow.status}
                isLoggedIn={isLoggedIn}
                isOwner={isOwner}
              />
            </div>
          </div>
        </Card>

        {/* ===== 报价列表 ===== */}
        <section id="bid-section">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-primary">
              <MessageSquare className="h-5 w-5 text-primary" />
              报价列表
              <span className="rounded-full bg-primary-bg px-2 py-0.5 text-xs font-medium text-primary">
                {bids.length}
              </span>
            </h2>
          </div>

          {bids.length === 0 ? (
            <Card>
              <EmptyState
                title="暂无报价"
                description="成为第一个报价的供应商"
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => {
                const bidder = bidderProfileMap.get(bid.user_id)
                const bidVariant =
                  bidStatusVariantMap[bid.status] ?? 'default'
                return (
                  <Card key={bid.id} padding="md" hover>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      {/* 左：报价者信息 */}
                      <div className="flex items-start gap-3">
                        {bidder?.avatar_url ? (
                          <span
                            className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center ring-1 ring-line"
                            style={{
                              backgroundImage: `url(${bidder.avatar_url})`,
                            }}
                            aria-hidden
                          />
                        ) : (
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-bg text-sm font-medium text-primary">
                            {bidder?.nickname?.[0] ?? 'U'}
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-ink-primary">
                              {bidder?.nickname ?? '匿名供应商'}
                            </span>
                            <Badge variant={bidVariant} size="sm">
                              {bidStatusLabel[bid.status] ?? bid.status}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-tertiary">
                            <span className="inline-flex items-center gap-0.5">
                              <Wallet className="h-3 w-3" />
                              ¥{formatBudget(bid.price)}
                            </span>
                            <span className="inline-flex items-center gap-0.5">
                              <CalendarClock className="h-3 w-3" />
                              {bid.delivery_days} 天交货
                            </span>
                            <span>{formatDateTime(bid.created_at)}</span>
                          </div>
                          {bid.note && (
                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
                              {bid.note}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* 右：报价金额强调 */}
                      <div className="flex shrink-0 items-baseline gap-1 sm:flex-col sm:items-end">
                        <span className="text-2xs text-ink-tertiary">
                          报价
                        </span>
                        <span className="text-lg font-bold text-primary">
                          ¥{formatBudget(bid.price)}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* ===== 分类标签回链 ===== */}
        <div className="flex items-center gap-2 text-xs text-ink-tertiary">
          <Tag className="h-3.5 w-3.5" />
          <span>同类需求：</span>
          <Link
            href={`/orders?category=${encodeURIComponent(orderRow.category)}`}
            className="font-medium text-primary hover:underline"
          >
            {orderRow.category}
          </Link>
        </div>
      </Container>
    </main>
  )
}

// 信息项：图标 + 标签 + 值
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-line-light p-3">
      <div className="mb-1 flex items-center gap-1 text-2xs text-ink-tertiary">
        <span className="text-ink-tertiary">{icon}</span>
        {label}
      </div>
      <p className="truncate text-sm font-medium text-ink-primary" title={value}>
        {value}
      </p>
    </div>
  )
}
