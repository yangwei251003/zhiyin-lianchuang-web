import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ArrowRight, BarChart3, ExternalLink, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PriceChart } from '@/components/charts/PriceChart'
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
  const { data: latestRows } = await supabase
    .from('market_prices')
    .select('*')
    .eq('paper_type', paperType)
    .eq('verification_status', 'verified')
    .order('observed_at', { ascending: false })
    .limit(1)

  const latest = latestRows?.[0] ?? null
  const latestIsFresh = latest
    // Server-rendered price visibility must compare with the request-time clock.
    // eslint-disable-next-line react-hooks/purity
    ? Date.now() - new Date(latest.observed_at).getTime() <= LATEST_QUOTE_MAX_AGE_MS
    : false
  const { data: historyRows } = latest
    ? await supabase
      .from('market_prices')
      .select('*')
      .eq('paper_type', paperType)
      .eq('verification_status', 'verified')
      .eq('source', latest.source)
      .eq('region', latest.region)
      .eq('market', latest.market)
      .eq('specification', latest.specification)
      .order('observed_at', { ascending: true })
      .limit(30)
    : { data: [] }

  const chartData = (historyRows ?? []).map((row) => ({
    date: row.observed_at.slice(0, 10),
    price: row.price,
    is_predicted: false,
  }))

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
          </>
        ) : (
          <section className="mt-6 border border-[#E5E7EB] bg-white p-8 text-center sm:p-12">
            <BarChart3 className="mx-auto size-10 text-[#8A9199]" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-[#1F2937]">{latest ? '最新公开报价已超过展示期限' : '暂未获得可公开验证的报价'}</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#4B5563]">为了避免误导采购决策，此页面不会用模拟值、纸浆期货换算值、过期价格或未标注规格的网络价格填充。</p>
            <Link href="/purchase" className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[#1E3A5F] px-4 text-sm font-semibold text-[#1E3A5F] hover:bg-[#EEF3F8]">
              提交采购意向
              <ArrowRight className="size-4" aria-hidden />
            </Link>
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
