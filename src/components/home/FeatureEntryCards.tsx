'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  GraduationCap,
  Rocket,
  ShoppingBag,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCard {
  icon: LucideIcon
  title: string
  desc: string
  badge: string
  href: string
  theme: 'primary' | 'environment' | 'society' | 'purple'
  stat: string
  statLabel: string
}

const FEATURES: FeatureCard[] = [
  {
    icon: ShoppingBag,
    title: '订单大厅',
    desc: '海量印刷订单智能匹配，一键对接优质产能，撮合效率提升 3 倍',
    badge: '热门',
    href: '/orders',
    theme: 'primary',
    stat: '3×',
    statLabel: '撮合效率',
  },
  {
    icon: TrendingDown,
    title: '集采商城',
    desc: '集中采购降本增效，拼单团购更低价格，平均节省 8–15% 采购成本',
    badge: '省钱',
    href: '/purchase',
    theme: 'environment',
    stat: '15%',
    statLabel: '平均降本',
  },
  {
    icon: Rocket,
    title: '创业孵化',
    desc: '一站式创业服务，导师辅导、案例参考、资源对接，助力印刷创业成功',
    badge: '创业',
    href: '/startup',
    theme: 'society',
    stat: '500+',
    statLabel: '成功案例',
  },
  {
    icon: GraduationCap,
    title: '技术培训',
    desc: '系统化技术课程与行业资讯，持续提升专业技能与经营能力',
    badge: '成长',
    href: '/training',
    theme: 'purple',
    stat: '200+',
    statLabel: '课程资源',
  },
]

const THEME_CFG = {
  primary:     { bar: '#2A6CDB', icon: '#2A6CDB', bg: '#E8F1FB', badge: 'bg-primary-bg text-primary', stat: '#2A6CDB', border: '#2A6CDB20' },
  environment: { bar: '#2BAE6E', icon: '#2BAE6E', bg: '#EBF9F3', badge: 'bg-environment-bg text-environment', stat: '#2BAE6E', border: '#2BAE6E20' },
  society:     { bar: '#F08035', icon: '#F08035', bg: '#FFF5ED', badge: 'bg-society-bg text-society', stat: '#F08035', border: '#F0803520' },
  purple:      { bar: '#7C3AED', icon: '#7C3AED', bg: '#F5F3FF', badge: 'bg-purple-50 text-purple-600', stat: '#7C3AED', border: '#7C3AED20' },
}

export function FeatureEntryCards() {
  return (
    <section className="relative py-16 sm:py-20">
      {/* 背景网格 */}
      <div className="grid-bg-light absolute inset-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <div className="h-px w-10 bg-primary/30" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Core Services
            </span>
            <div className="h-px w-10 bg-primary/30" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            四大核心服务
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-secondary">
            覆盖印刷行业全流程需求，构建四位一体的产业协同生态
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, idx) => {
            const Icon   = feature.icon
            const cfg    = THEME_CFG[feature.theme]
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.19,1,0.22,1] }}
              >
                <Link
                  href={feature.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-base hover:-translate-y-1.5 hover:shadow-xl"
                >
                  {/* 顶部主题色条 */}
                  <div className="h-1.5 w-full" style={{ background: cfg.bar }} />

                  {/* Badge */}
                  <span className={cn(
                    'absolute right-4 top-3.5 inline-flex items-center rounded-full px-2.5 py-1 text-2xs font-semibold',
                    cfg.badge,
                  )}>
                    {feature.badge}
                  </span>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* 图标 */}
                    <div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-base group-hover:scale-110"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: cfg.icon }} />
                    </div>

                    {/* 标题 */}
                    <h3 className="text-lg font-bold text-ink-primary">{feature.title}</h3>

                    {/* 描述 */}
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                      {feature.desc}
                    </p>

                    {/* 统计数字 */}
                    <div className="mt-4 border-t border-line/60 pt-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <div
                            className="font-mono text-2xl font-bold leading-none"
                            style={{ color: cfg.stat, fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            {feature.stat}
                          </div>
                          <div className="mt-1 text-xs text-ink-tertiary">{feature.statLabel}</div>
                        </div>
                        <span
                          className="flex items-center gap-1 text-sm font-semibold transition-all duration-fast group-hover:gap-2"
                          style={{ color: cfg.stat }}
                        >
                          进入
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover 光效 */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-base group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${cfg.bg}80, transparent 60%)` }}
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
