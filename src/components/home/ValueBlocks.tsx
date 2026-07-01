'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Coins,
  HeartHandshake,
  Leaf,
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
  /** 主题色 */
  theme: 'primary' | 'environment' | 'society'
}

const VALUE_BLOCKS: ValueBlock[] = [
  {
    key: 'economy',
    icon: Coins,
    title: '经济价值',
    headline: '帮助联盟成员降低 8-15% 成本',
    points: [
      '降低采购成本，集中采购与智能议价',
      '提升撮合效率，AI 智能匹配订单与产能',
      'AI 价格预测，把握纸价走势降低库存风险',
    ],
    theme: 'primary',
  },
  {
    key: 'environment',
    icon: Leaf,
    title: '环境价值',
    headline: '助力国家「双碳」目标实现',
    points: [
      '优先推荐绿色印刷认证供应商',
      '智能排产与订单优化，减少能源浪费',
      '构建可持续印刷供应链体系',
    ],
    theme: 'environment',
  },
  {
    key: 'society',
    icon: HeartHandshake,
    title: '社会价值',
    headline: '降低行业门槛，带动产业升级',
    points: [
      '技术培训与创业指导，降低入门门槛',
      '订单分发，帮助闲置产能找到出口',
      '带动就业，赋能印刷行业从业者',
    ],
    theme: 'society',
  },
]

export function ValueBlocks() {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const isOpen = isHovered || isExpanded

  return (
    <section className="py-12 sm:py-16">
      <div
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            我们的价值
          </h2>
          <p className="mt-2 text-sm text-ink-secondary sm:text-base">
            经济 · 环境 · 社会 三位一体
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {VALUE_BLOCKS.map((block) => {
            const Icon = block.icon
            return (
              <div
                key={block.key}
                className={cn(
                  'overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-base ease-out-expo',
                  'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
                  THEME_BORDER[block.theme],
                )}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setIsExpanded((prev) => !prev)
                  }
                }}
              >
                {/* 主题色背景块 */}
                <div
                  className={cn(
                    'relative p-4 sm:p-5',
                    THEME_TINT[block.theme],
                  )}
                >
                  {/* Chevron indicator in top right */}
                  <div className="absolute right-4 top-4 text-ink-tertiary">
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="inline-flex"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </div>

                  <div
                    className={cn(
                      'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12',
                      THEME_ICON_BG[block.theme],
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 sm:h-6 sm:w-6',
                        THEME_ICON_TEXT[block.theme],
                      )}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-ink-primary">
                    {block.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-ink-secondary">
                    {block.headline}
                  </p>
                </div>

                {/* 展开要点列表 */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="points"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 p-4 sm:p-5 border-t border-line/30">
                        {block.points.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-ink-primary"
                          >
                            <span
                              className={cn(
                                'mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full',
                                THEME_DOT[block.theme],
                              )}
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const THEME_TINT: Record<ValueBlock['theme'], string> = {
  primary: 'bg-primary-bg/60',
  environment: 'bg-environment-bg/60',
  society: 'bg-society-bg/60',
}

const THEME_BORDER: Record<ValueBlock['theme'], string> = {
  primary: 'border-primary/20',
  environment: 'border-environment/20',
  society: 'border-society/20',
}

const THEME_ICON_BG: Record<ValueBlock['theme'], string> = {
  primary: 'bg-primary-bg',
  environment: 'bg-environment-bg',
  society: 'bg-society-bg',
}

const THEME_ICON_TEXT: Record<ValueBlock['theme'], string> = {
  primary: 'text-primary',
  environment: 'text-environment',
  society: 'text-society',
}

const THEME_DOT: Record<ValueBlock['theme'], string> = {
  primary: 'bg-primary',
  environment: 'bg-environment',
  society: 'bg-society',
}
