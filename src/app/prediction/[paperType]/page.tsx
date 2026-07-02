import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ShieldAlert, TrendingDown, Cpu, Sparkles, Mail } from 'lucide-react'
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
}

// 解析 days 查询参数，非法值回退为 7
function resolveDays(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw
  const parsed = Number(value)
  return (FORECAST_OPTIONS as readonly number[]).includes(parsed)
    ? parsed
    : 7
}

export async function generateStaticParams() {
  return PAPER_TYPES.map((paperType) => ({ paperType }))
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
}: PredictionPageProps) {
  const { paperType: rawPaperType } = await params
  const paperType = decodeURIComponent(rawPaperType)
  if (!PAPER_TYPES.includes(paperType)) notFound()

  const days = 7

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

  // 其他纸种最新价格
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
    <main className="pb-16 bg-slate-50 min-h-screen">
      {/* ===== 页头 ===== */}
      <PredictionHeader paperType={paperType} />

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
                height={400}
              />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-sm text-ink-tertiary">
                <p>暂无价格数据</p>
                <p className="text-xs">数据将在录入后自动展示</p>
              </div>
            )}
          </div>
        </section>

        {/* ===== 新增：智印大脑采购避险决策与预警 ===== */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* 预警面板 */}
          <div className="md:col-span-2 rounded-xl border border-orange-200 bg-orange-50/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-5 w-5 text-orange-600" />
              <h3 className="text-sm font-bold text-orange-900">“智印大脑”避险采购备货预警</h3>
              <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-3xs font-semibold text-orange-800">波动指数: 中偏高</span>
            </div>
            <p className="text-xs leading-relaxed text-orange-800">
              根据 <strong>Prophet+Transformer</strong> 预测模型，由于受木浆与漂针浆进口海运成本上涨影响，{paperType}价格在未来两周面临 <strong>2.3% ~ 3.5%</strong> 的高频推涨可能。
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-white p-3 border border-orange-100">
              <TrendingDown className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">避险策略指导建议</h4>
                <p className="text-3xs text-slate-500 mt-0.5 leading-normal">
                  建议月均使用量超过 15 吨的包装印刷/商业画册成员企业，于<strong>本周内锁定 75%</strong> 的下月用纸合同，或利用平台集采通道完成联合锁价，以规避价格阶梯上涨带来的溢价风险。
                </p>
              </div>
            </div>
          </div>

          {/* 订阅快报 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Cpu className="h-4.5 w-4.5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">订阅波动预警</h3>
              </div>
              <p className="text-3xs leading-relaxed text-slate-500">
                加入“智印大脑”短信/邮件预警推送。一旦纸张现货价单日波动突破 1.5% 警戒线，系统将在 10 分钟内完成模型计算并推送最新决策。
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-2xs text-slate-400">输入接收预警的邮箱</span>
              </div>
              <button className="w-full mt-2 rounded-lg bg-primary py-2 text-2xs font-bold text-white transition-opacity hover:opacity-90">
                开启 AI 订阅推送
              </button>
            </div>
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
