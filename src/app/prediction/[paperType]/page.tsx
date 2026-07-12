import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ArrowRight, BarChart3, ExternalLink, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PriceChart } from '@/components/charts/PriceChart'
import { AIAnalysis } from '@/components/prediction/AIAnalysis'
import { PaperTypeTabs } from '@/components/prediction/PaperTypeTabs'
import { PAPER_TYPES, type PaperType } from '@/lib/price-data'

interface PredictionPageProps {
  params: Promise<{ paperType: string }>
}

const LATEST_QUOTE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(value))
}

export async function generateStaticParams() {
  return PAPER_TYPES.map((paperType) => ({ paperType }))
}

export async function generateMetadata({ params }: PredictionPageProps): Promise<Metadata> {
  const { paperType: rawPaperType } = await params
  const paperType = decodeURIComponent(rawPaperType)
  if (!PAPER_TYPES.includes(paperType as PaperType)) {
    return { title: '纸价信息 - 智印联创' }
  }

  return {
    title: `${paperType}价格信息`,
    description: `${paperType}公开报价与数据来源说明。仅展示带规格、区域和更新时间的已验证信息。`,
  }
}

export default async function PredictionPage({ params }: PredictionPageProps) {
  const { paperType: rawPaperType } = await params
  const paperType = decodeURIComponent(rawPaperType)
  if (!PAPER_TYPES.includes(paperType as PaperType)) notFound()

  const supabase = await createClient()
  const { data: verifiedRows } = await supabase
    .from('market_prices')
    .select('*')
    .eq('paper_type', paperType)
    .eq('verification_status', 'verified')
    .order('observed_at', { ascending: false })
    .limit(100)

  // 同一纸种可能同时存在多地区、多规格报价。优先展示样本更完整的同口径序列，
  // 避免一条更晚但口径不同的记录截断已验证的历史趋势。
  const seriesByDefinition = new Map<string, NonNullable<typeof verifiedRows>>()
  for (const row of verifiedRows ?? []) {
    const key = [row.source, row.region, row.market, row.specification].join('|')
    const series = seriesByDefinition.get(key) ?? []
    series.push(row)
    seriesByDefinition.set(key, series)
  }
  const selectedSeries = Array.from(seriesByDefinition.values())
    .sort((a, b) => b.length - a.length || new Date(b[0].observed_at).getTime() - new Date(a[0].observed_at).getTime())[0]
    ?.sort((a, b) => new Date(a.observed_at).getTime() - new Date(b.observed_at).getTime()) ?? []
  const latest = selectedSeries.at(-1) ?? null
  const latestIsFresh = latest
    // Server-rendered price visibility must compare with the request-time clock.
    // eslint-disable-next-line react-hooks/purity
    ? Date.now() - new Date(latest.observed_at).getTime() <= LATEST_QUOTE_MAX_AGE_MS
    : false
  const chartData = selectedSeries.slice(-30).map((row) => ({
    date: row.observed_at.slice(0, 10),
    price: row.price,
    is_predicted: false,
  }))
  const firstPrice = chartData[0]?.price
  const latestPrice = chartData.at(-1)?.price
  const changeRate = firstPrice && latestPrice
    ? ((latestPrice - firstPrice) / firstPrice) * 100
    : 0
  const trend = changeRate > 0.1 ? 'up' : changeRate < -0.1 ? 'down' : 'flat'

  return (
    <main className="min-h-screen bg-[#F6F7F8] pb-16">
      <section className="border-b border-[#E5E7EB] bg-white">
        <Container className="py-10 sm:py-14">
          <p className="print-index text-xs font-semibold">03 / 市场信息参考</p>
          <h1 className="mt-2 text-3xl font-bold text-[#1F2937] sm:text-4xl">{paperType}价格信息</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#4B5563]">
            仅展示已记录来源、规格、区域、单位和更新时间的公开报价。平台不将纸浆期货或随机生成值换算为纸种市场价格。
          </p>
        </Container>
      </section>

      <Container className="py-6 sm:py-8">
        <PaperTypeTabs current={paperType} />

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]"><div className="rounded-xl border border-cyan-300/20 bg-gradient-to-br from-[#0d1a30] to-[#152d5e] p-5 text-white"><p className="text-xs font-semibold text-cyan-200">官方行业指标</p><h2 className="mt-2 text-xl font-bold">工业生产者价格指数（PPI）</h2><p className="mt-3 text-sm leading-6 text-slate-200">国家统计局公开数据发布库按月发布工业价格指标，可用于观察宏观成本环境，不作为纸种报价或采购建议。</p><a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white" href="https://data.stats.gov.cn/" target="_blank" rel="noreferrer">查看国家统计局数据发布库 <ExternalLink className="size-4" /></a></div><div className="rounded-xl border border-fuchsia-300/20 bg-gradient-to-br from-[#1b143d] to-[#0d1a30] p-5 text-white"><p className="text-xs font-semibold text-fuchsia-200">期货行情参考</p><h2 className="mt-2 text-xl font-bold">纸浆期货与现货报价分开展示</h2><p className="mt-3 text-sm leading-6 text-slate-200">纸浆期货只能反映相关市场行情，平台不将其换算为铜版纸、白卡纸等成品纸价格。</p></div></section>

        {latest && latestIsFresh ? (
          <>
            <section className="mt-6 grid gap-6 border-t-2 border-[#173B63] border-x border-b border-[#D9DEE6] bg-white p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <p className="text-sm font-semibold text-[#1E3A5F]">最新已验证公开报价</p>
                <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-2">
                  <span className="text-3xl font-bold text-[#172033]">¥{latest.price.toLocaleString('zh-CN')}</span>
                  <span className="pb-1 text-base text-[#4B5563]">{latest.unit}</span>
                </div>
                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div><dt className="text-[#6B7280]">规格</dt><dd className="mt-1 font-semibold text-[#1F2937]">{latest.specification}</dd></div>
                  <div><dt className="text-[#6B7280]">区域与市场</dt><dd className="mt-1 font-semibold text-[#1F2937]">{[latest.region, latest.market].filter(Boolean).join(' / ')}</dd></div>
                  <div><dt className="text-[#6B7280]">数据来源</dt><dd className="mt-1 font-semibold text-[#1F2937]">{latest.source}</dd></div>
                  <div><dt className="text-[#6B7280]">报价时间</dt><dd className="mt-1 font-semibold text-[#1F2937]">{formatTimestamp(latest.observed_at)}</dd></div>
                </dl>
              </div>
              <aside className="border-l-0 border-[#E5E7EB] pt-5 lg:border-l lg:pt-0 lg:pl-6">
                <Info className="size-6 text-[#1E3A5F]" aria-hidden />
                <h2 className="mt-3 text-base font-bold text-[#1F2937]">报价说明</h2>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">该数值为指定地区和规格的公开报价，不能替代供应商最终报价或合同价格。</p>
                {latest.source_url && (
                  <a href={latest.source_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1E3A5F] hover:text-[#D97706]">
                    查看原始来源
                    <ExternalLink className="size-4" aria-hidden />
                  </a>
                )}
              </aside>
            </section>

            <section className="mt-6 border border-[#E5E7EB] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">同口径历史报价</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">仅对比相同来源、地区、市场和规格的记录。</p>
                </div>
                <span className="text-sm text-[#6B7280]">共 {chartData.length} 条</span>
              </div>
              {chartData.length >= 2 ? (
                <PriceChart data={chartData} paperType={paperType} height={340} />
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center text-center">
                  <BarChart3 className="size-8 text-[#8A9199]" aria-hidden />
                  <p className="mt-3 text-base font-semibold text-[#1F2937]">历史数据尚不足以生成趋势图</p>
                  <p className="mt-1 text-sm text-[#6B7280]">后续导入同一口径的历史报价后将自动展示。</p>
                </div>
              )}
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <AIAnalysis
                analysis={null}
                paperType={paperType}
                changeRate={changeRate}
                trend={trend}
                recentPrices={chartData.map(({ date, price }) => ({ date, price }))}
              />
              <aside className="border border-[#D9DEE6] bg-white p-5">
                <p className="text-xs font-semibold text-[#1E3A5F]">智印大脑 · 数据质量</p>
                <h2 className="mt-2 text-lg font-bold text-[#1F2937]">AI 分析以可追溯数据为边界</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div><dt className="text-[#6B7280]">当前输入</dt><dd className="mt-1 font-semibold text-[#1F2937]">{chartData.length} 条同口径公开报价</dd></div>
                  <div><dt className="text-[#6B7280]">分析方式</dt><dd className="mt-1 font-semibold text-[#1F2937]">趋势识别、采购建议、风险提示</dd></div>
                  <div><dt className="text-[#6B7280]">30 天数值预测</dt><dd className="mt-1 font-semibold text-[#1F2937]">待同口径历史样本达到 14 条后启用</dd></div>
                </dl>
                <p className="mt-5 border-t border-[#E5E7EB] pt-4 text-xs leading-5 text-[#6B7280]">AI 输出仅分析已接入数据，不把纸浆期货、不同规格或未核验网页价格混入成品纸预测。</p>
              </aside>
            </section>
          </>
        ) : (
          <section className="mt-6 border border-[#E5E7EB] bg-white p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <div className="flex items-center gap-3"><BarChart3 className="size-8 text-[#1E3A5F]" strokeWidth={1.5} aria-hidden /><div><p className="text-xs font-semibold text-[#1E3A5F]">公开数据采集状态</p><h2 className="mt-1 text-xl font-bold text-[#1F2937]">{latest ? '最新公开报价已超过展示期限' : `${paperType}尚未接入同口径报价`}</h2></div></div>
                <p className="mt-5 max-w-xl text-sm leading-6 text-[#4B5563]">平台只写入同时具备来源链接、规格、地区、单位与报价日期的公开记录。纸浆期货、不同克重纸张或没有明确来源的网络数字不会被换算或补填为{paperType}价格。</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/prediction/白卡纸" className="inline-flex min-h-11 items-center gap-2 bg-[#1E3A5F] px-4 text-sm font-semibold text-white hover:bg-[#16304f]">查看已验证报价样例 <ArrowRight className="size-4" aria-hidden /></Link>
                  <Link href="/purchase" className="inline-flex min-h-11 items-center gap-2 border border-[#1E3A5F] px-4 text-sm font-semibold text-[#1E3A5F] hover:bg-[#EEF3F8]">提交采购意向 <ArrowRight className="size-4" aria-hidden /></Link>
                </div>
              </div>
              <aside className="border-l-0 border-[#E5E7EB] pt-1 lg:border-l lg:pl-6">
                <h3 className="font-bold text-[#1F2937]">AI 预测启用条件</h3>
                <ol className="mt-4 space-y-4 text-sm leading-6 text-[#4B5563]">
                  <li><span className="mr-2 font-semibold text-[#1E3A5F]">01</span>同一来源、地区、规格的历史报价达到 14 条。</li>
                  <li><span className="mr-2 font-semibold text-[#1E3A5F]">02</span>AI 再输出趋势、采购建议和风险提示，不把预测值当成真实报价。</li>
                  <li><span className="mr-2 font-semibold text-[#1E3A5F]">03</span>每次分析都显示输入数据范围和来源，便于复核。</li>
                </ol>
              </aside>
            </div>
          </section>
        )}

        <section className="mt-6 border border-[#B45309] bg-[#FFFBEB] p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#B45309]" aria-hidden />
            <div>
              <h2 className="font-bold text-[#78350F]">重要声明</h2>
              <p className="mt-2 text-sm leading-6 text-[#78350F]">本页面内容基于公开报价或后续获授权数据，仅供行业信息参考，不构成投资建议、采购建议或价格承诺。实际采购请以供应商正式报价、合同条款和交付条件为准。</p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
