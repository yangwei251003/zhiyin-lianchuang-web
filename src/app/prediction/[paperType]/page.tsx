import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PriceChart } from '@/components/charts/PriceChart'
import { PredictionHeader } from '@/components/prediction/PredictionHeader'
import {
  ForecastRangeSelector,
  PaperTypeTabs,
} from '@/components/prediction/PaperTypeTabs'
import { PAPER_TYPES } from '@/lib/price-data'
import { AIAnalysis } from '@/components/prediction/AIAnalysis'
import { MarketBenchmarking } from '@/components/prediction/MarketBenchmarking'
import {
  deriveTrend,
  trendArrow,
  trendBadgeClass,
  trendTextClass,
} from '@/lib/trend-utils'
import { cn } from '@/lib/utils'

// 预测天数可选项
const FORECAST_OPTIONS = [7, 14, 30] as const

interface PredictionPageProps {
  params: Promise<{ paperType: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 解析 days 查询参数，非法值回退为 7
function resolveDays(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw
  const parsed = Number(value)
  return (FORECAST_OPTIONS as readonly number[]).includes(parsed)
    ? parsed
    : 7
}

export async function generateMetadata({
  params,
}: PredictionPageProps): Promise<Metadata> {
  const { paperType: rawPaperType } = await params
  const paperType = decodeURIComponent(rawPaperType)
  if (!PAPER_TYPES.includes(paperType)) return { title: '纸价预测 · 智印联创' }
  return {
    title: `${paperType} 价格预测 · 智印联创`,
    description: `基于 AI 模型的 ${paperType} 价格趋势预测，辅助印刷企业采购决策。`,
  }
}

export default async function PredictionPage({
  params,
  searchParams,
}: PredictionPageProps) {
  const { paperType: rawPaperType } = await params
  const paperType = decodeURIComponent(rawPaperType)
  if (!PAPER_TYPES.includes(paperType)) notFound()

  const sp = await searchParams
  const days = resolveDays(sp.days)

  const supabase = await createClient()

  // 历史数据最近 30 天 + 预测数据最多 30 天（按 days 切片）
  const [historyRes, forecastRes] = await Promise.all([
    supabase
      .from('price_predictions')
      .select('*')
      .eq('paper_type', paperType)
      .eq('is_predicted', false)
      .order('date', { ascending: true })
      .limit(30),
    supabase
      .from('price_predictions')
      .select('*')
      .eq('paper_type', paperType)
      .eq('is_predicted', true)
      .order('date', { ascending: true })
      .limit(30),
  ])

  const history = historyRes.data ?? []
  const forecastAll = forecastRes.data ?? []
  const forecast = forecastAll.slice(0, days)

  const chartData = [...history, ...forecast].map((d) => ({
    date: d.date,
    price: d.price,
    is_predicted: d.is_predicted,
    change_rate: d.change_rate,
  }))

  // 最新历史点作为「当前价格」基准
  const latest = history.length > 0 ? history[history.length - 1] : null
  const currentPrice = latest?.price ?? 0
  const changeRate = latest?.change_rate ?? 0
  const trend = deriveTrend(changeRate)
  const updatedAt = latest?.date ?? ''

  // 其他纸种最新价格（去重保留每个纸种最新一条）
  const { data: othersRaw } = await supabase
    .from('price_predictions')
    .select('paper_type, price, change_rate, date')
    .eq('is_predicted', false)
    .order('date', { ascending: false })
    .limit(60)

  const othersMap = new Map<
    string,
    { paper_type: string; price: number; change_rate: number; date: string }
  >()
  for (const p of othersRaw ?? []) {
    if (p.paper_type !== paperType && !othersMap.has(p.paper_type)) {
      othersMap.set(p.paper_type, p)
    }
  }
  const others = PAPER_TYPES.map((pt) => othersMap.get(pt)).filter(
    (v): v is { paper_type: string; price: number; change_rate: number; date: string } =>
      Boolean(v),
  )

  const isUp = changeRate > 0
  const isDown = changeRate < 0

  return (
    <main className="pb-10">
      {/* ===== Hero：蓝紫渐变 + 面包屑与标题 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2A6CDB 0%, #5B5CD9 55%, #8B5CF6 100%)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }}
        />
        <Container className="relative py-10 sm:py-14">
          <PredictionHeader paperType={paperType} />
        </Container>
      </section>

      {/* ===== 浮层控制条：纸种切换 + 预测天数 ===== */}
      <Container className="relative z-10 -mt-6">
        <div className="rounded-xl border border-line bg-white p-4 shadow-md sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <PaperTypeTabs current={paperType} />
            <ForecastRangeSelector value={days} />
          </div>
        </div>
      </Container>

      <Container className="mt-6 space-y-6">
        {/* ===== 价格曲线区 ===== */}
        <section className="animate-fade-in-up rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-ink-tertiary">
                当前价格 · {paperType}
              </p>
              <div className="mt-1.5 flex items-end gap-2">
                <span className="text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
                  ¥{currentPrice.toLocaleString('zh-CN')}
                </span>
                <span className="mb-1 text-sm text-ink-tertiary">元/吨</span>
                <span
                  className={cn(
                    'mb-1 ml-1 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
                    trendBadgeClass(changeRate),
                  )}
                >
                  {trendArrow(changeRate)} {Math.abs(changeRate).toFixed(2)}%
                </span>
              </div>
            </div>
            {updatedAt && (
              <p className="text-xs text-ink-tertiary">
                数据更新于 {updatedAt}
              </p>
            )}
          </div>

          <div className="mt-6">
            {chartData.length > 0 ? (
              <PriceChart
                data={chartData}
                paperType={paperType}
                height={440}
              />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-sm text-ink-tertiary">
                <p>暂无价格数据</p>
                <p className="text-xs">数据将在录入后自动展示</p>
              </div>
            )}
          </div>
        </section>

        {/* ===== AI 智能解读 ===== */}
        <AIAnalysis
          analysis={latest?.ai_analysis || null}
          paperType={paperType}
          changeRate={changeRate}
          trend={trend}
        />

        {/* ===== 市场行情与全网价格对标 ===== */}
        <MarketBenchmarking paperType={paperType} />

        {/* ===== 多纸种对比 ===== */}
        {others.length > 0 && (
          <section className="animate-fade-in-up rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-ink-primary sm:text-xl">
                多纸种对比
              </h2>
              <span className="text-xs text-ink-tertiary">
                点击查看详细预测
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {others.map((o) => {
                const up = o.change_rate > 0
                const down = o.change_rate < 0
                return (
                  <li key={o.paper_type}>
                    <Link
                      href={`/prediction/${encodeURIComponent(o.paper_type)}`}
                      className="group flex items-center justify-between rounded-lg border border-line-light px-4 py-3 transition-all duration-base ease-out-expo hover:border-primary/30 hover:bg-primary-bg-subtle"
                    >
                      <span className="text-sm font-medium text-ink-primary">
                        {o.paper_type}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums text-ink-primary">
                          ¥{o.price.toLocaleString('zh-CN')}
                        </span>
                        <span
                          className={cn(
                            'inline-flex w-16 items-center justify-end gap-0.5 text-xs font-medium tabular-nums',
                            trendTextClass(o.change_rate),
                          )}
                        >
                          {up ? '↑' : down ? '↓' : '—'}{' '}
                          {Math.abs(o.change_rate).toFixed(2)}%
                        </span>
                        <ArrowRight className="h-4 w-4 text-ink-tertiary transition-all duration-base ease-out-expo group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </Container>
    </main>
  )
}
