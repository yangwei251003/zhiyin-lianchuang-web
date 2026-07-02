'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  Cpu,
  Globe,
  type LucideIcon,
} from 'lucide-react'

interface ValueItem {
  icon: LucideIcon
  label: string
  value: string
  desc: string
  color: string
  glow: string
}

const VALUES: ValueItem[] = [
  {
    icon: TrendingUp,
    label: '成本降低',
    value: '8–15%',
    desc: '集中采购与智能议价，显著降低印刷企业采购成本',
    color: '#4A85E6',
    glow: 'rgba(42,108,219,0.25)',
  },
  {
    icon: Cpu,
    label: 'AI 撮合效率',
    value: '3×',
    desc: 'AI 智能匹配订单与产能，撮合效率提升 3 倍以上',
    color: '#00B4D8',
    glow: 'rgba(0,180,216,0.22)',
  },
  {
    icon: Users,
    label: '联盟企业',
    value: '2000+',
    desc: '覆盖印刷全产业链，构建协同共赢的行业生态圈',
    color: '#2BAE6E',
    glow: 'rgba(43,174,110,0.22)',
  },
  {
    icon: Globe,
    label: '订单覆盖',
    value: '全国',
    desc: '连接全国印刷需求方与供应商，实现产能高效流转',
    color: '#F08035',
    glow: 'rgba(240,128,53,0.22)',
  },
]

export function PlatformValueSection() {
  return (
    <section className="relative py-16 sm:py-20">
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(42,108,219,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="grid-bg-light absolute inset-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题区 */}
        <div className="mb-12 text-center">
          {/* CMYK 装饰条 */}
          <div className="mb-6 inline-flex items-center gap-3">
            <div
              className="h-0.5 w-12 rounded-full"
              style={{ background: 'linear-gradient(90deg, #00B4D8, #2A6CDB)' }}
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Platform Value
            </span>
            <div
              className="h-0.5 w-12 rounded-full"
              style={{ background: 'linear-gradient(90deg, #2A6CDB, #D62246)' }}
            />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            为什么选择智印联创
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-secondary sm:text-lg">
            行业领先的 AI 协同能力，驱动印刷产业全链路数字化升级
          </p>
        </div>

        {/* 价值指标网格 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.19,1,0.22,1] }}
                className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-base hover:-translate-y-1 hover:shadow-lg"
              >
                {/* 顶部发光圆角色条 */}
                <div
                  className="absolute left-0 top-0 h-1 w-full rounded-t-2xl"
                  style={{ background: item.color }}
                />

                {/* 背景发光 */}
                <div
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-slow group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)` }}
                />

                {/* 图标 */}
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-base group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${item.glow}, transparent)`,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: item.color }} />
                </div>

                {/* 数值 */}
                <div
                  className="mb-1 font-mono text-3xl font-bold tracking-tight"
                  style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {item.value}
                </div>

                {/* 标签 */}
                <div className="mb-2 text-sm font-semibold text-ink-primary">{item.label}</div>

                {/* 描述 */}
                <p className="text-xs leading-relaxed text-ink-secondary">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
