'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Package,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type MessageRow = Database['public']['Tables']['messages']['Row']

export interface MessageListProps {
  initialMessages: MessageRow[]
  totalCount: number
  unreadCount: number
  currentPage: number
  pageSize: number
  filters: {
    type: string
    unread: boolean
  }
}

type MessageType = 'system' | 'order' | 'purchase'

interface TypeConfig {
  icon: LucideIcon
  bg: string
  text: string
  label: string
}

const typeConfig: Record<MessageType, TypeConfig> = {
  system: {
    icon: Bell,
    bg: 'bg-primary-bg',
    text: 'text-primary',
    label: '系统通知',
  },
  order: {
    icon: ShoppingBag,
    bg: 'bg-accent-bg',
    text: 'text-accent',
    label: '订单消息',
  },
  purchase: {
    icon: Package,
    bg: 'bg-success-bg',
    text: 'text-success',
    label: '集采提醒',
  },
}

const tabs: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统通知' },
  { key: 'order', label: '订单消息' },
  { key: 'purchase', label: '集采提醒' },
]

function getTypeConfig(type: string): TypeConfig {
  return typeConfig[type as MessageType] ?? typeConfig.system
}

// 相对时间格式化：刚刚 / X 分钟前 / X 小时前 / X 天前 / 日期
function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (Number.isNaN(diff)) return iso
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} 天前`
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  if (y === new Date().getFullYear()) return `${m}-${d}`
  return `${y}-${m}-${d}`
}

// 构建消息中心 URL（仅保留有效参数）
function buildMessagesUrl(next: {
  type: string
  unread: boolean
  page: number
}): string {
  const params = new URLSearchParams()
  if (next.type && next.type !== 'all') params.set('type', next.type)
  if (next.unread) params.set('unread', 'true')
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/messages?${qs}` : '/messages'
}

// 消息列表客户端组件
// 筛选/分页通过更新 URL 触发服务端重新查询（searchParams 驱动）
export function MessageList({
  initialMessages,
  totalCount,
  unreadCount,
  currentPage,
  pageSize,
  filters,
}: MessageListProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const addToast = useUIStore((s) => s.addToast)
  const setUnreadCount = useUIStore((s) => s.setUnreadCount)
  const refreshUnreadCount = useUIStore((s) => s.refreshUnreadCount)
  const [isPending, startTransition] = useTransition()
  const [markingAll, setMarkingAll] = useState(false)
  // 实时接收的新消息（通过 Realtime 追加）
  const [realtimeMessages, setRealtimeMessages] = useState<MessageRow[]>([])

  // 挂载时把服务端统计的未读数同步到全局 ui-store，供 Header / BottomNav 立即显示
  useEffect(() => {
    setUnreadCount(unreadCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Supabase Realtime 实时订阅 ─────────────────────────────────────────────
  // 监听当前用户的新消息 INSERT 事件，自动追加到列表顶部
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageRow
          setRealtimeMessages((prev) => [newMsg, ...prev])
          // 同步全局未读计数
          void refreshUnreadCount(user.id)
        },
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const navigate = (next: {
    type?: string
    unread?: boolean
    page?: number
  }) => {
    startTransition(() => {
      router.push(
        buildMessagesUrl({
          type: next.type ?? filters.type,
          unread: next.unread ?? filters.unread,
          page: next.page ?? 1,
        }),
      )
    })
  }

  // 单条点击：标记已读 + 跳转 link
  const handleMessageClick = async (msg: MessageRow) => {
    const wasUnread = !msg.is_read
    if (wasUnread) {
      const supabase = createClient()
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', msg.id)
      if (error) {
        addToast({ type: 'error', message: '标记已读失败' })
        return
      }
      addToast({ type: 'success', message: '已标记为已读' })
      if (user) void refreshUnreadCount(user.id)
    }
    if (msg.link) {
      router.push(msg.link)
    } else {
      startTransition(() => router.refresh())
    }
  }

  // 全部已读：批量更新当前用户未读消息
  const handleMarkAllRead = async () => {
    if (!user || unreadCount === 0 || markingAll) return
    setMarkingAll(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      if (error) throw error
      addToast({ type: 'success', message: '已全部标记为已读' })
      await refreshUnreadCount(user.id)
      startTransition(() => router.refresh())
    } catch {
      addToast({ type: 'error', message: '操作失败，请稍后重试' })
    } finally {
      setMarkingAll(false)
    }
  }

  const hasMessages = initialMessages.length > 0

  return (
    <div className="space-y-5">
      {/* ===== 类型 Tab + 操作栏 ===== */}
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* 类型 Tab */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            {tabs.map((tab) => {
              const active = filters.type === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => navigate({ type: tab.key, page: 1 })}
                  className={cn(
                    'inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-fast ease-out-expo',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-canvas text-ink-secondary hover:bg-primary-bg hover:text-primary',
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* 只看未读 + 全部已读 */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={filters.unread}
              onClick={() => navigate({ unread: !filters.unread, page: 1 })}
              className="group inline-flex items-center gap-2 text-sm text-ink-secondary transition-colors hover:text-ink-primary"
            >
              <span
                className={cn(
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-base ease-out-expo',
                  filters.unread ? 'bg-primary' : 'bg-line',
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-base ease-out-expo',
                    filters.unread ? 'translate-x-4' : 'translate-x-0.5',
                  )}
                />
              </span>
              只看未读
            </button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="h-4 w-4" />}
              loading={markingAll}
              disabled={unreadCount === 0 || markingAll}
              onClick={handleMarkAllRead}
            >
              全部已读
            </Button>
          </div>
        </div>

        {/* 统计 */}
        <div className="mt-3 flex items-center justify-between border-t border-line-light pt-3 text-xs text-ink-tertiary">
          <span>
            共{' '}
            <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
            条消息
          </span>
          {unreadCount > 0 && (
            <span>
              <span className="font-semibold text-danger">{unreadCount}</span>{' '}
              条未读
            </span>
          )}
        </div>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <MessageListSkeleton />
      ) : hasMessages || realtimeMessages.length > 0 ? (
        <ul className="space-y-2.5">
          {/* 实时推送的新消息（顶部展示，带入场动效） */}
          <AnimatePresence>
            {realtimeMessages
              .filter((m) => !initialMessages.some((im) => im.id === m.id))
              .map((msg) => (
                <motion.li
                  key={msg.id}
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <button
                    type="button"
                    onClick={() => void handleMessageClick(msg)}
                    className="flex w-full items-start gap-3 rounded-xl border border-primary/30 bg-primary-bg/30 p-4 text-left shadow-sm ring-1 ring-primary/10 transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-bg text-primary">
                      <Bell className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-ink-primary">{msg.title}</h3>
                        <span className="shrink-0 text-2xs text-ink-tertiary">刚刚</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-secondary">{msg.content}</p>
                    </div>
                    <span aria-label="未读" className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-danger" />
                  </button>
                </motion.li>
              ))}
          </AnimatePresence>
          {/* 服务端分页加载的消息 */}
          {initialMessages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              onClick={() => void handleMessageClick(msg)}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            variant={filters.unread || filters.type !== 'all' ? 'search' : 'default'}
            title="暂无消息"
            description={
              filters.unread || filters.type !== 'all'
                ? '试试切换筛选条件'
                : '新消息将会在这里显示'
            }
          />
        </div>
      )}

      {/* ===== 分页 ===== */}
      {!isPending && hasMessages && (
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onChange={(p) => navigate({ page: p })}
          className="pt-2"
        />
      )}
    </div>
  )
}

// 单条消息卡片
function MessageItem({
  message,
  onClick,
}: {
  message: MessageRow
  onClick: () => void
}) {
  const config = getTypeConfig(message.type)
  const Icon = config.icon
  const unread = !message.is_read

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group flex w-full items-start gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition-all duration-base ease-out-expo',
          'hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          unread ? 'border-primary/20' : 'border-line',
        )}
      >
        {/* 类型图标 */}
        <span
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            config.bg,
            config.text,
            !unread && 'opacity-60',
          )}
        >
          <Icon className="h-5 w-5" />
        </span>

        {/* 内容 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'truncate text-sm font-semibold',
                unread ? 'text-ink-primary' : 'text-ink-tertiary',
              )}
            >
              {message.title}
            </h3>
            <span className="shrink-0 text-2xs text-ink-tertiary">
              {formatRelativeTime(message.created_at)}
            </span>
          </div>
          <p
            className={cn(
              'mt-1 line-clamp-2 text-xs leading-relaxed',
              unread ? 'text-ink-secondary' : 'text-ink-tertiary',
            )}
          >
            {message.content}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium',
                config.bg,
                config.text,
                !unread && 'opacity-60',
              )}
            >
              {config.label}
            </span>
            {message.link && (
              <span className="inline-flex items-center gap-0.5 text-2xs text-ink-tertiary transition-colors group-hover:text-primary">
                查看详情
                <ChevronRight className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        {/* 未读红点 */}
        {unread && (
          <span
            aria-label="未读"
            className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-danger"
          />
        )}
      </button>
    </li>
  )
}

// 消息列表骨架屏
function MessageListSkeleton() {
  return (
    <ul className="space-y-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-xl border border-line bg-white p-4"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-line" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-1/3 animate-pulse rounded bg-line" />
              <div className="h-3 w-12 animate-pulse rounded bg-line" />
            </div>
            <div className="h-3 w-full animate-pulse rounded bg-line" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-line" />
          </div>
        </li>
      ))}
    </ul>
  )
}
