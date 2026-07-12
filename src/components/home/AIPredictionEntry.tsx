'use client'

import Link from 'next/link'
import { ArrowRight, Brain, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface PredictionItem {
  paper_type: string
  price: number
  change_rate: number
}

export interface AIPredictionEntryProps {
  predictions: PredictionItem[]
}

export function AIPredictionEntry({ predictions }: AIPredictionEntryProps) {
  return (
    <section className="relative py-16 sm:py-20 bg-canvas/20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* 左侧：AI 预测入口卡片 */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-2"
          >
            <Link
              href="/prediction/白卡纸"
              className={cn(
                'group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7 shadow-lg sm:p-8',
                'transition-all duration-base hover:-translate-y-1 hover:shadow-xl',
              )}
              style={{
                background:
                  'linear-gradient(135deg, #0A1628 0%, #1A5CC8 60%, #0E2040 100%)',
                border: '1px solid rgba(42, 108, 219, 0.25)',
              }}
            >
              {/* 装饰光晕 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(0, 180, 216, 0.2) 0%, transparent 70%)',
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(214, 34, 70, 0.15) 0%, transparent 70%)',
                }}
              />

              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm transition-transform duration-base group-hover:scale-110">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  AI 纸价预测
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                  整合行业大数据，AI 算法精准预判未来 30 天纸张价格行情，助力企业把握最佳采购时机，降低库存贬值风险。
                </p>
              </div>

              <span className="relative mt-8 inline-flex items-center gap-2 self-start rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-md transition-all duration-base group-hover:gap-3 group-hover:shadow-lg">
                查看预测
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>

          {/* 右侧：今日行业指数 */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-3"
          >
            <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <h3 className="text-lg font-bold text-ink-primary sm:text-xl">
                    今日行业指数
                  </h3>
                </div>
                <span className="text-xs text-ink-tertiary">单位：元/吨</span>
              </div>

              {predictions.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-10 text-sm text-ink-tertiary">
                  暂无纸价数据
                </div>
              ) : (
                <ul className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  {predictions.map((item) => {
                    const isUp = item.change_rate > 0
                    const isDown = item.change_rate < 0
                    const TrendIcon = isUp ? TrendingUp : TrendingDown
                    return (
                      <li
                        key={item.paper_type}
                        className="flex items-center justify-between rounded-xl border border-line/60 px-4 py-3.5 transition-all hover:bg-canvas/50 hover:border-primary/20"
                      >
                        <span className="text-sm font-semibold text-ink-primary">
                          {item.paper_type}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-ink-primary">
                            ¥{item.price.toLocaleString('zh-CN')}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-0.5 text-xs font-bold font-mono',
                              isUp && 'text-danger',
                              isDown && 'text-success',
                              !isUp && !isDown && 'text-ink-tertiary',
                            )}
                          >
                            <TrendIcon className="h-3.5 w-3.5" />
                            {isUp ? '+' : ''}
                            {item.change_rate.toFixed(2)}%
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              <Link
                href="/prediction/白卡纸"
                className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary transition-all duration-base hover:gap-2.5"
              >
                查看完整预测
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
