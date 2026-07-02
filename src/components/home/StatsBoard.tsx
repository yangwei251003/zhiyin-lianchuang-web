'use client'

import {
  Building2,
  Leaf,
  ShoppingCart,
  Users,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { CountUp } from '@/components/common/CountUp'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
  sublabel: string
  accent: 'primary' | 'success' | 'warning' | 'environment'
  suffix?: string
  trend?: string
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
      sublabel: 'Alliance Companies',
      accent: 'primary',
      suffix: '+',
      trend: '持续增长',
    },
    {
      icon: Users,
      value: users,
      label: '注册用户',
      sublabel: 'Registered Users',
      accent: 'primary',
      suffix: '+',
      trend: '活跃平台',
    },
    {
      icon: ShoppingCart,
      value: orders,
      label: '完成订单',
      sublabel: 'Completed Orders',
      accent: 'warning',
      suffix: '+',
      trend: '高效撮合',
    },
    {
      icon: Leaf,
      value: greenCompanies,
      label: '绿色认证',
      sublabel: 'Green Certified',
      accent: 'environment',
      suffix: '+',
      trend: '双碳目标',
    },
  ]

  return (
    <section className="relative py-12 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.19,1,0.22,1] }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #0D1A30 0%, #0A1628 100%)',
            border: '1px solid rgba(42,108,219,0.2)',
            boxShadow: '0 8px 40px rgba(6,16,32,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* 背景网格 */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* 顶部 CMYK 色条 */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, #00B4D8, #2A6CDB, #2BAE6E, #F08035)' }}
          />

          {/* 光晕装饰 */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(42,108,219,0.15) 0%, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(43,174,110,0.12) 0%, transparent 70%)' }}
          />

          {/* 标题栏 */}
          <div
            className="relative flex items-center justify-between border-b px-6 py-4 sm:px-8"
            style={{ borderColor: 'rgba(42,108,219,0.15)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: '#2BAE6E', boxShadow: '0 0 8px rgba(43,174,110,0.6)' }}
              />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7BA6F0' }}>
                Platform Dashboard · 实时数据
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#475569' }}>
              <TrendingUp className="h-3.5 w-3.5 text-environment" />
              数据实时更新
            </div>
          </div>

          {/* 数据网格 */}
          <div className="relative grid grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0"
            style={{ '--tw-divide-opacity': '0.1' } as React.CSSProperties}
          >
            {items.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.19,1,0.22,1] }}
                  className="group relative flex flex-col items-center justify-center p-6 text-center transition-colors duration-base hover:bg-white/[0.03] sm:p-7"
                  style={{ borderColor: 'rgba(42,108,219,0.1)' }}
                >
                  {/* 图标 */}
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: ACCENT_ICON_BG[item.accent],
                      border: `1px solid ${ACCENT_ICON_BORDER[item.accent]}`,
                    }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: ACCENT_COLOR[item.accent] }} />
                  </div>

                  {/* 数值 */}
                  <div
                    className="text-2xl font-bold tracking-tight sm:text-3xl"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: ACCENT_COLOR[item.accent],
                    }}
                  >
                    <CountUp
                      end={item.value}
                      separator
                      suffix={item.suffix}
                      duration={2200}
                    />
                  </div>

                  {/* 标签 */}
                  <div className="mt-1.5 text-sm font-semibold text-white">{item.label}</div>
                  <div className="mt-0.5 text-xs" style={{ color: '#475569' }}>{item.sublabel}</div>

                  {/* 趋势标签 */}
                  <div
                    className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-2xs font-medium"
                    style={{
                      background: `${ACCENT_COLOR[item.accent]}18`,
                      color: ACCENT_COLOR[item.accent],
                      border: `1px solid ${ACCENT_COLOR[item.accent]}25`,
                    }}
                  >
                    <span className="h-1 w-1 rounded-full" style={{ background: ACCENT_COLOR[item.accent] }} />
                    {item.trend}
                  </div>

                  {/* 分割线（非最后一个，桌面端） */}
                  {idx < items.length - 1 && (
                    <div
                      className="absolute right-0 top-6 hidden h-[calc(100%-3rem)] w-px sm:block"
                      style={{ background: 'rgba(42,108,219,0.12)' }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const ACCENT_COLOR: Record<StatItem['accent'], string> = {
  primary:     '#4A85E6',
  success:     '#2BAE6E',
  warning:     '#F0A040',
  environment: '#2BAE6E',
}
const ACCENT_ICON_BG: Record<StatItem['accent'], string> = {
  primary:     'rgba(42,108,219,0.15)',
  success:     'rgba(43,174,110,0.15)',
  warning:     'rgba(240,160,64,0.15)',
  environment: 'rgba(43,174,110,0.15)',
}
const ACCENT_ICON_BORDER: Record<StatItem['accent'], string> = {
  primary:     'rgba(42,108,219,0.25)',
  success:     'rgba(43,174,110,0.25)',
  warning:     'rgba(240,160,64,0.25)',
  environment: 'rgba(43,174,110,0.25)',
}
