'use client'

import Link from 'next/link'
import { ArrowRight, Brain, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:gap-6">
          {/* 左侧：AI 预测入口卡片 */}
          <div className="lg:col-span-2">
            <Link
              href="/prediction/铜版纸"
              className={cn(
                'group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-7 shadow-lg sm:p-8',
                'transition-all duration-base ease-out-expo hover:-translate-y-1 hover:shadow-xl',
              )}
              style={{
                background:
                  'linear-gradient(135deg, #2A6CDB 0%, #5B5CD9 55%, #8B5CF6 100%)',
              }}
            >
              {/* 装饰光晕 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                }}
              />

              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  AI 纸价预测
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
                  基于历史价格与行业数据，AI 智能预测未来 30 天纸价走势，辅助采购决策、降低库存风险。
                </p>
              </div>

              <span className="relative mt-8 inline-flex items-center gap-2 self-start rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all duration-base ease-out-expo group-hover:gap-3 group-hover:shadow-md">
                查看预测
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* 右侧：今日行业指数 */}
          <div className="lg:col-span-3">
            <div className="flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-ink-primary sm:text-xl">
                  今日行业指数
                </h3>
                <span className="text-xs text-ink-tertiary">单位：元/吨</span>
              </div>

              {predictions.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-10 text-sm text-ink-tertiary">
                  暂无纸价数据
                </div>
              ) : (
                <ul className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  {predictions.map((item) => {
                    const isUp = item.change_rate > 0
                    const isDown = item.change_rate < 0
                    const TrendIcon = isUp ? TrendingUp : TrendingDown
                    return (
                      <li
                        key={item.paper_type}
                        className="flex items-center justify-between rounded-lg border border-line-light px-4 py-3 transition-colors hover:bg-canvas"
                      >
                        <span className="text-sm font-medium text-ink-primary">
                          {item.paper_type}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold tabular-nums text-ink-primary">
                            ¥{item.price.toLocaleString('zh-CN')}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-0.5 text-xs font-medium tabular-nums',
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
                href="/prediction/铜版纸"
                className="mt-5 inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition-all duration-base ease-out-expo hover:gap-2"
              >
                查看完整预测
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
