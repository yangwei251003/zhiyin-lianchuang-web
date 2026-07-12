'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Gavel,
  Users,
  Eye,
  ChevronRight,
  Building2,
  Bell,
  Info,
  Pencil,
  LogOut,
  ShieldCheck,
  Clock,
  XCircle,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'
import type { Database } from '@/types/database'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { CountUp } from '@/components/common/CountUp'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

type Profile = Database['public']['Tables']['profiles']['Row']
type Company = Database['public']['Tables']['companies']['Row']

type AuthStatus = 'none' | 'pending' | 'approved' | 'rejected'
type MemberLevel = 'free' | 'vip' | 'enterprise'

export interface MineContentProps {
  profile: Profile | null
  company: Company | null
  stats: {
    orders: number
    bids: number
    purchases: number
    views: number
  }
  badges: {
    pendingOrders: number
    pendingBids: number
    pendingPurchases: number
    unreadMessages: number
  }
}

interface StatItem {
  icon: LucideIcon
  value: number
  label: string
  href: string
  accent: 'primary' | 'success' | 'warning' | 'environment'
  badge?: number
}

interface MenuItem {
  icon: LucideIcon
  title: string
  desc: string
  href: string
  badge?: number
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

// 我的中心客户端组件
// 用户信息卡 + 数据概览（CountUp 动画）+ 功能菜单分组
export function MineContent({
  profile,
  company,
  stats,
  badges,
}: MineContentProps) {
  const router = useRouter()
  const signOut = useAuthStore((s) => s.signOut)
  const addToast = useUIStore((s) => s.addToast)
  const [loggingOut, setLoggingOut] = useState(false)

  const authStatus: AuthStatus = company
    ? (company.status as AuthStatus)
    : 'none'
  const memberLevel = (profile?.member_level as MemberLevel) || 'free'

  const nickname = profile?.nickname || '用户'
  const email = profile?.email || ''
  const avatarUrl = profile?.avatar_url
  const companyName = company?.company_name

  const handleSignOut = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await signOut()
      addToast({ type: 'success', message: '已退出登录' })
      router.push('/login')
    } catch {
      addToast({ type: 'error', message: '退出失败，请重试' })
      setLoggingOut(false)
    }
  }

  const statItems: StatItem[] = [
    {
      icon: ShoppingBag,
      value: stats.orders,
      label: '我的订单',
      href: '/mine/orders',
      accent: 'primary',
      badge: badges.pendingOrders,
    },
    {
      icon: Gavel,
      value: stats.bids,
      label: '我的报价',
      href: '/mine/bids',
      accent: 'warning',
      badge: badges.pendingBids,
    },
    {
      icon: Users,
      value: stats.purchases,
      label: '采购意向',
      href: '/purchase/mine',
      accent: 'environment',
      badge: badges.pendingPurchases,
    },
    {
      icon: Eye,
      value: stats.views,
      label: '浏览记录',
      href: '/purchase/history',
      accent: 'success',
    },
  ]

  const menuGroups: MenuGroup[] = [
    {
      title: '参与记录',
      items: [
        {
          icon: ShoppingBag,
          title: '我的订单',
          desc: '查看和管理订单',
          href: '/mine/orders',
          badge: badges.pendingOrders,
        },
        {
          icon: Gavel,
          title: '我的报价',
          desc: '查看报价记录',
          href: '/mine/bids',
          badge: badges.pendingBids,
        },
        {
          icon: Users,
          title: '采购意向',
          desc: '查看已提交的采购沟通意向',
          href: '/purchase/mine',
          badge: badges.pendingPurchases,
        },
      ],
    },
    {
      title: '企业与服务',
      items: [
        {
          icon: Building2,
          title: '企业信息管理',
          desc: '完善企业资料与认证',
          href: '/mine/auth',
        },
        {
          icon: Bell,
          title: '消息通知',
          desc: '系统消息与提醒',
          href: '/messages',
          badge: badges.unreadMessages,
        },
      ],
    },
    {
      title: '系统',
      items: [
        {
          icon: Info,
          title: '关于智印联创',
          desc: '了解平台',
          href: '/about',
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* ===== 用户信息卡 + 数据概览 ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* 用户信息卡 */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl bg-primary-gradient p-6 shadow-lg shadow-blue sm:p-7">
            {/* 装饰圆 */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/5" />

            <div className="relative">
              {/* 头像 + 基本信息 */}
              <div className="flex items-center gap-4">
                <Avatar avatarUrl={avatarUrl ?? null} nickname={nickname} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-bold text-white">
                    {nickname}
                  </h2>
                  <p className="mt-0.5 truncate text-sm text-white/80">
                    {email}
                  </p>
                </div>
              </div>

              {/* 徽标行 */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <AuthBadge status={authStatus} />
                <MemberBadge level={memberLevel} />
              </div>

              {/* 企业名称 */}
              {companyName && authStatus === 'approved' && (
                <div className="mt-3 flex items-center gap-1.5 text-sm text-white/90">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{companyName}</span>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="mt-5 flex gap-2">
                <Link
                  href="/mine/profile"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-white/15 px-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-fast ease-out-expo hover:bg-white/25"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  编辑资料
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-white/15 px-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-fast ease-out-expo hover:bg-white/25 disabled:opacity-60"
                >
                  {loggingOut ? (
                    <Spinner size="sm" className="text-white" />
                  ) : (
                    <LogOut className="h-3.5 w-3.5" />
                  )}
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 数据概览 */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {statItems.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* ===== 功能菜单分组 ===== */}
      <div className="space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 px-1 text-xs font-medium text-ink-tertiary">
              {group.title}
            </h3>
            <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              {group.items.map((item, idx) => (
                <MenuRow
                  key={item.title}
                  item={item}
                  isLast={idx === group.items.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 头像：有 avatar_url 显示图片，否则显示昵称首字母
function Avatar({
  avatarUrl,
  nickname,
  size = 'md',
}: {
  avatarUrl: string | null
  nickname: string
  size?: 'md' | 'lg'
}) {
  const sizeCls =
    size === 'lg' ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-xl'
  const initial = nickname.charAt(0).toUpperCase() || 'U'

  if (avatarUrl) {
    return (
      // Avatar URLs are user-provided and may not be known at build time.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={nickname}
        className={cn(
          'shrink-0 rounded-full object-cover ring-2 ring-white/40',
          sizeCls,
        )}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-white/25 font-bold text-white ring-2 ring-white/40',
        sizeCls,
      )}
    >
      {initial}
    </div>
  )
}

// 认证状态徽标
function AuthBadge({ status }: { status: AuthStatus }) {
  const config: Record<
    AuthStatus,
    { text: string; cls: string; icon: LucideIcon }
  > = {
    none: {
      text: '未认证',
      cls: 'bg-white/20 text-white',
      icon: ShieldAlert,
    },
    pending: {
      text: '审核中',
      cls: 'bg-warning text-white',
      icon: Clock,
    },
    approved: {
      text: '已认证',
      cls: 'bg-success text-white',
      icon: ShieldCheck,
    },
    rejected: {
      text: '已驳回',
      cls: 'bg-danger text-white',
      icon: XCircle,
    },
  }
  const { text, cls, icon: Icon } = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        cls,
      )}
    >
      <Icon className="h-3 w-3" />
      {text}
    </span>
  )
}

// 会员等级徽标
function MemberBadge({ level }: { level: MemberLevel }) {
  const config: Record<MemberLevel, { text: string; cls: string }> = {
    free: {
      text: '免费会员',
      cls: 'bg-white/20 text-white',
    },
    vip: {
      text: 'VIP 会员',
      cls: 'bg-amber-400 text-amber-900',
    },
    enterprise: {
      text: '企业会员',
      cls: 'bg-deep text-white',
    },
  }
  const { text, cls } = config[level]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        cls,
      )}
    >
      {text}
    </span>
  )
}

// 数据统计卡片
function StatCard({ item }: { item: StatItem }) {
  const Icon = item.icon
  const accentBg: Record<StatItem['accent'], string> = {
    primary: 'bg-primary-bg',
    success: 'bg-success-bg',
    warning: 'bg-warning-bg',
    environment: 'bg-environment-bg',
  }
  const accentText: Record<StatItem['accent'], string> = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    environment: 'text-environment',
  }

  return (
    <Link
      href={item.href}
      className="group relative overflow-hidden rounded-xl border border-line bg-white p-4 shadow-sm transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-md sm:p-5"
    >
      {/* 待处理红点 */}
      {item.badge ? (
        <span className="absolute right-3 top-3 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-2xs font-bold text-white">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      ) : null}

      <div
        className={cn(
          'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-base ease-out-expo group-hover:scale-110',
          accentBg[item.accent],
        )}
      >
        <Icon className={cn('h-5 w-5', accentText[item.accent])} />
      </div>
      <div className="text-2xl font-bold tabular-nums text-ink-primary sm:text-3xl">
        <CountUp end={item.value} duration={1500} />
      </div>
      <div className="mt-0.5 text-sm text-ink-secondary">{item.label}</div>
    </Link>
  )
}

// 菜单行
function MenuRow({ item, isLast }: { item: MenuItem; isLast: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 px-4 py-3.5 transition-colors duration-fast ease-out-expo hover:bg-canvas',
        !isLast && 'border-b border-line/divider',
      )}
    >
      <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-bg text-primary transition-colors duration-fast ease-out-expo group-hover:bg-primary group-hover:text-white">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-primary">{item.title}</p>
        <p className="text-xs text-ink-tertiary">{item.desc}</p>
      </div>
      {item.badge ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-2xs font-bold text-white">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      ) : null}
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-tertiary transition-transform duration-fast ease-out-expo group-hover:translate-x-0.5" />
    </Link>
  )
}
