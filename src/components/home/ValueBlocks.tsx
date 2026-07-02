'use client'

import { motion } from 'framer-motion'
import {
  Coins,
  HeartHandshake,
  Leaf,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ValueKey = 'economy' | 'environment' | 'society'

interface ValueBlock {
  key: ValueKey
  icon: LucideIcon
  title: string
  headline: string
  points: string[]
  theme: 'primary' | 'environment' | 'society'
}

const VALUE_BLOCKS: ValueBlock[] = [
  {
    key: 'economy',
    icon: Coins,
    title: '经济价值',
    headline: '降低采购成本与撮合效率升级',
    points: [
      '降低采购成本：集中采购与智能议价',
      '提升撮合效率：AI 智能匹配订单与产能',
      '价格走势预判：把握纸价降低库存风险',
    ],
    theme: 'primary',
  },
  {
    key: 'environment',
    icon: Leaf,
    title: '环境价值',
    headline: '助力国家绿色低碳「双碳」目标',
    points: [
      '绿色资质筛选：优先推荐环保认证供应商',
      '智能低碳排产：优化产能分配减少能源浪费',
      '绿色可持续：构建低碳环保的印刷供应链',
    ],
    theme: 'environment',
  },
  {
    key: 'society',
    icon: HeartHandshake,
    title: '社会价值',
    headline: '降低行业壁垒，带动产业升级',
    points: [
      '技术赋能：提供课程培训与创业指导',
      '闲置产能流转：帮助中小微印企开拓订单',
      '促进行业健康：促成上下游共赢新生态',
    ],
    theme: 'society',
  },
]

export function ValueBlocks() {
  return (
    <section className="relative py-16 sm:py-20 bg-canvas/40">
      <div className="grid-bg-light absolute inset-0 opacity-40 pointer-events-none" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <div className="h-px w-10 bg-primary/30" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our Vision & Mission
            </span>
            <div className="h-px w-10 bg-primary/30" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            平台核心价值
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-secondary">
            经济 · 环境 · 社会 三位一体，驱动印刷产业的可持续发展
          </p>
        </div>

        {/* 价值卡片展示（直接展开） */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUE_BLOCKS.map((block, idx) => {
            const Icon = block.icon
            const cfg = THEME_CFG[block.theme]
            return (
              <motion.div
                key={block.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.19, 1, 0.22, 1] }}
                className={cn(
                  'relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-base hover:-translate-y-1 hover:shadow-lg',
                  cfg.border
                )}
              >
                {/* 顶部色条 */}
                <div className="absolute left-0 top-0 h-1.5 w-full" style={{ background: cfg.primaryColor }} />

                {/* 卡片头部 */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-base group-hover:scale-110"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.primaryColor}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: cfg.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink-primary">{block.title}</h3>
                    <p className="text-xs text-ink-tertiary">{block.headline}</p>
                  </div>
                </div>

                {/* 要点列表 */}
                <ul className="space-y-3 border-t border-line/60 pt-4">
                  {block.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-secondary"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4.5 w-4.5 flex-shrink-0"
                        style={{ color: cfg.primaryColor }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* 背景发光 */}
                <div
                  className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full opacity-30"
                  style={{ background: `radial-gradient(circle, ${cfg.primaryColor}30 0%, transparent 75%)` }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const THEME_CFG = {
  primary: {
    primaryColor: '#2A6CDB',
    bg: '#E8F1FB',
    border: 'border-primary/15',
  },
  environment: {
    primaryColor: '#2BAE6E',
    bg: '#EBF9F3',
    border: 'border-environment/15',
  },
  society: {
    primaryColor: '#F08035',
    bg: '#FFF5ED',
    border: 'border-society/15',
  },
}

