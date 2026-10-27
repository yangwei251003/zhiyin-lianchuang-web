'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BottomNavItem {
  label: string
  href: string
  icon: LucideIcon
}

const items: BottomNavItem[] = [
  { label: '首页', href: '/', icon: Home },
  { label: '协同', href: '/orders', icon: ShoppingBag },
  { label: '大脑', href: '/brain', icon: Sparkles },
  { label: '我的', href: '/mine', icon: UserIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-stretch border-t border-[#D9DEE6] bg-white md:hidden"
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
              'relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-all duration-fast select-none',
              active ? 'text-primary font-medium' : 'text-ink-tertiary hover:text-ink-secondary',
            )}
          >
            <span className="relative flex flex-col items-center justify-center">
              {/* 微交互缩放动画 */}
              <motion.div
                data-motion-safe
                animate={active ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
              >
                <Icon className="h-5 w-5" />
              </motion.div>
            </span>
            <span className="mt-0.5">{label}</span>

            {/* Active指示点 */}
            {active && (
              <motion.span
                data-motion-safe
                layoutId="bottom-active-dot"
                className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
