'use client'

import {
  Building2,
  Leaf,
  ShoppingCart,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { CountUp } from '@/components/common/CountUp'
import { cn } from '@/lib/utils'

export interface StatsBoardProps {
  companies: number
  users: number
  orders: number
  greenCompanies: number
}

interface StatItem {
  icon: LucideIcon
  value: number
  label: string
  /** 图标容器与数字的品牌色调 */
  accent: 'primary' | 'success' | 'warning' | 'environment'
  suffix?: string
}

export function StatsBoard({
  companies,
  users,
  orders,
  greenCompanies,
}: StatsBoardProps) {
  const items: StatItem[] = [
    {
      icon: Building2,
      value: companies,
      label: '联盟企业',
      accent: 'primary',
      suffix: '+',
    },
    {
      icon: Users,
      value: users,
      label: '注册用户',
      accent: 'primary',
      suffix: '+',
    },
    {
      icon: ShoppingCart,
      value: orders,
      label: '订单总数',
      accent: 'warning',
      suffix: '+',
    },
    {
      icon: Leaf,
      value: greenCompanies,
      label: '绿色认证企业',
      accent: 'environment',
      suffix: '+',
    },
  ]

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-slate-50/50 to-white p-6 shadow-sm dark:from-slate-900/50 dark:to-slate-800">
          {/* Subtle glowing accents */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-success/5 blur-2xl pointer-events-none" />
          
          <div className="relative grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-y-0 sm:divide-x divide-line">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={cn("p-1 rounded-md", ACCENT_BG[item.accent])}>
                      <Icon className={cn("h-3.5 w-3.5", ACCENT_TEXT[item.accent])} />
                    </div>
                    <span className="text-xs font-medium text-ink-secondary">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary tabular-nums">
                    <CountUp
                      end={item.value}
                      separator
                      suffix={item.suffix}
                      duration={2000}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const ACCENT_BG: Record<StatItem['accent'], string> = {
  primary: 'bg-primary-bg',
  success: 'bg-success-bg',
  warning: 'bg-warning-bg',
  environment: 'bg-environment-bg',
}

const ACCENT_TEXT: Record<StatItem['accent'], string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  environment: 'text-environment',
}
