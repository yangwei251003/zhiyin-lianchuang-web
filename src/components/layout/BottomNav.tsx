'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  MessageCircle,
  ShoppingBag,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react'
import { useUIStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'

interface BottomNavItem {
  label: string
  href: string
  icon: LucideIcon
}

const items: BottomNavItem[] = [
  { label: '首页', href: '/', icon: Home },
  { label: '订单', href: '/orders', icon: ShoppingBag },
  { label: '消息', href: '/messages', icon: MessageCircle },
  { label: '我的', href: '/mine', icon: UserIcon },
]

// 移动端底部导航：四个一级入口，对齐小程序 tabBar
export function BottomNav() {
  const pathname = usePathname()
  const unread = useUIStore((s) => s.unreadCount)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-stretch border-t border-line bg-white/95 backdrop-blur md:hidden"
      aria-label="底部导航"
    >
      {items.map(({ label, href, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-0.5 text-2xs transition-colors',
              active ? 'text-primary' : 'text-ink-tertiary',
            )}
          >
            <span className="relative">
              <Icon className="h-5 w-5" />
              {href === '/messages' && unread > 0 && (
                <span className="absolute -right-1.5 -top-1 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 text-2xs font-medium text-white">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
