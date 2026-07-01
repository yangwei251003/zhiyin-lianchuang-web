import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Lightbulb, TrendingUp, Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { CountUp } from '@/components/common/CountUp'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type CaseRow = Database['public']['Tables']['cases']['Row']

interface CaseDetailPageProps {
  params: Promise<{ id: string }>
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: caseItem } = await supabase
    .from('cases')
    .select('title, summary')
    .eq('id', id)
    .maybeSingle()
  if (!caseItem) return { title: '案例详情 · 智印联创' }
  const row = caseItem as Pick<CaseRow, 'title' | 'summary'>
  return {
    title: `${row.title} · 创业案例 · 智印联创`,
    description: row.summary,
  }
}

// 创业案例详情页（服务端组件）
export default async function CaseDetailPage({
  params,
}: CaseDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. 获取案例详情
  const { data: caseItem } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!caseItem) notFound()
  const caseRow = caseItem as CaseRow

  // 2. 相关案例推荐（同行业优先，排除当前，取 3 条）
  const { data: relatedSame } = await supabase
    .from('cases')
    .select('id, title, summary, cover_image, industry, investment_amount, revenue')
    .neq('id', id)
    .eq('industry', caseRow.industry)
    .limit(3)
  let related = (relatedSame ?? []) as Pick<
    CaseRow,
    | 'id'
    | 'title'
    | 'summary'
    | 'cover_image'
    | 'industry'
    | 'investment_amount'
    | 'revenue'
  >[]
  // 同行业不足 3 条时补足其他
  if (related.length < 3) {
    const { data: relatedOther } = await supabase
      .from('cases')
      .select('id, title, summary, cover_image, industry, investment_amount, revenue')
      .neq('id', id)
      .neq('industry', caseRow.industry)
      .limit(3 - related.length)
    related = [
      ...related,
      ...((relatedOther ?? []) as typeof related),
    ]
  }

  return (
    <main className="pb-12">
      {/* ===== 面包屑 ===== */}
      <Container className="pt-6">
        <nav
          className="flex items-center gap-1.5 text-xs text-ink-tertiary"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <Link href="/startup" className="hover:text-primary">
            创业孵化
          </Link>
          <span>/</span>
          <Link href="/startup/cases" className="hover:text-primary">
            创业案例
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">案例详情</span>
        </nav>
      </Container>

      {/* ===== 案例主体 ===== */}
      <Container size="md" className="mt-4">
        <Link
          href="/startup/cases"
          className="inline-flex items-center gap-1 text-sm text-ink-secondary transition-colors hover:text-society"
        >
          <ArrowLeft className="h-4 w-4" />
          返回案例列表
        </Link>

        {/* 标题 + 行业标签 */}
        <header className="mt-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="warning" size="md">
              {caseRow.industry}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold leading-tight text-ink-primary sm:text-3xl">
            {caseRow.title}
          </h1>
          <p className="mt-2 text-sm text-ink-secondary sm:text-base">
            {caseRow.summary}
          </p>
        </header>

        {/* 封面图 */}
        {caseRow.cover_image && (
          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-canvas">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caseRow.cover_image}
              alt={caseRow.title}
              className="h-auto w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* 投资金额 + 营收大字号显示（CountUp 动画） */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5 shadow-sm"
            style={{
              background:
                'linear-gradient(135deg, #2A6CDB 0%, #4A85E6 100%)',
            }}
          >
            <p className="flex items-center gap-1 text-xs text-white/80">
              <Wallet className="h-3.5 w-3.5" />
              投资金额
            </p>
            <p className="mt-1 text-3xl font-bold text-white sm:text-4xl">
              <CountUp
                end={caseRow.investment_amount}
                duration={1800}
                suffix=" 万"
              />
            </p>
          </div>
          <div
            className="rounded-xl p-5 shadow-sm"
            style={{
              background:
                'linear-gradient(135deg, #F08035 0%, #F5A66B 100%)',
            }}
          >
            <p className="flex items-center gap-1 text-xs text-white/80">
              <TrendingUp className="h-3.5 w-3.5" />
              年营收
            </p>
            <p className="mt-1 text-3xl font-bold text-white sm:text-4xl">
              <CountUp
                end={caseRow.revenue}
                duration={1800}
                suffix=" 万"
              />
            </p>
          </div>
        </div>

        {/* 案例正文 */}
        <article className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink-primary">
            <Lightbulb className="h-5 w-5 text-society" />
            创业故事
          </h2>
          <div className="whitespace-pre-line text-sm leading-relaxed text-ink-primary sm:text-base">
            {caseRow.content}
          </div>
        </article>
      </Container>

      {/* ===== 相关案例推荐 ===== */}
      {related.length > 0 && (
        <Container size="lg" className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-society" />
            <h2 className="text-lg font-bold text-ink-primary sm:text-xl">
              相关案例推荐
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/startup/cases/${item.id}`}
                className={cn(
                  'group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm',
                  'transition-all duration-base ease-out-expo',
                  'hover:-translate-y-1 hover:shadow-lg hover:border-society/30',
                )}
              >
                <div className="relative h-28 w-full overflow-hidden bg-canvas">
                  {item.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(135deg, #FFF5ED 0%, #FEF9F5 100%)',
                      }}
                    >
                      <Lightbulb
                        className="h-8 w-8 text-society/40"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-2xs font-medium text-society backdrop-blur-sm">
                    {item.industry}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-primary transition-colors group-hover:text-society">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-ink-secondary">
                    {item.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-line-light pt-1.5 text-2xs">
                    <span className="text-ink-tertiary">
                      投资 {item.investment_amount} 万
                    </span>
                    <span className="text-society">
                      营收 {item.revenue} 万
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      )}
    </main>
  )
}
