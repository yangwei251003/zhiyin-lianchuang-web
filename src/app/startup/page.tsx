import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Lightbulb,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '创业孵化 · 智印联创',
  description: '印刷行业创业者的成长加速器，知识、导师、案例、计算器一站式服务。',
}

type ArticleRow = Database['public']['Tables']['articles']['Row']
type CaseRow = Database['public']['Tables']['cases']['Row']

interface ModuleEntry {
  icon: LucideIcon
  title: string
  desc: string
  href: string
  /** 主题色：蓝/绿/橙/紫 */
  theme: 'primary' | 'environment' | 'society' | 'purple'
}

const MODULE_ENTRIES: ModuleEntry[] = [
  {
    icon: BookOpen,
    title: '创业文章',
    desc: '行业干货、设备选型、成本控制实战经验',
    href: '/startup/articles',
    theme: 'primary',
  },
  {
    icon: Users,
    title: '创业导师',
    desc: '资深专家 1 对 1 指导，少走弯路',
    href: '/startup/mentors',
    theme: 'environment',
  },
  {
    icon: Lightbulb,
    title: '创业案例',
    desc: '真实印刷创业者成长故事与里程碑',
    href: '/startup/cases',
    theme: 'society',
  },
  {
    icon: Calculator,
    title: '投资计算器',
    desc: '一键测算设备、场地、人员投入与回本周期',
    href: '/startup/calculator',
    theme: 'purple',
  },
]

const THEME_BAR: Record<ModuleEntry['theme'], string> = {
  primary: 'bg-primary',
  environment: 'bg-environment',
  society: 'bg-society',
  purple: 'bg-purple-500',
}
const THEME_ICON_BG: Record<ModuleEntry['theme'], string> = {
  primary: 'bg-primary-bg',
  environment: 'bg-environment-bg',
  society: 'bg-society-bg',
  purple: 'bg-purple-50',
}
const THEME_ICON_TEXT: Record<ModuleEntry['theme'], string> = {
  primary: 'text-primary',
  environment: 'text-environment',
  society: 'text-society',
  purple: 'text-purple-600',
}
const THEME_LINK: Record<ModuleEntry['theme'], string> = {
  primary: 'text-primary group-hover:text-primary-light',
  environment: 'text-environment group-hover:text-environment-light',
  society: 'text-society group-hover:text-society-light',
  purple: 'text-purple-600 group-hover:text-purple-500',
}

// 创业孵化首页（服务端组件）
export default async function StartupHomePage() {
  const supabase = await createClient()

  // 推荐：最新 3 篇文章
  const { data: latestArticles } = await supabase
    .from('articles')
    .select('id, title, summary, cover_image, author, created_at, view_count')
    .order('created_at', { ascending: false })
    .limit(3)
  const articles = (latestArticles ?? []) as Pick<
    ArticleRow,
    | 'id'
    | 'title'
    | 'summary'
    | 'cover_image'
    | 'author'
    | 'created_at'
    | 'view_count'
  >[]

  // 推荐：热门 3 个案例（按营收降序近似"热门"）
  const { data: hotCases } = await supabase
    .from('cases')
    .select('id, title, industry, summary, cover_image, investment_amount, revenue')
    .order('revenue', { ascending: false })
    .limit(3)
  const cases = (hotCases ?? []) as Pick<
    CaseRow,
    | 'id'
    | 'title'
    | 'industry'
    | 'summary'
    | 'cover_image'
    | 'investment_amount'
    | 'revenue'
  >[]

  return (
    <main className="pb-12">
      <PageHeader
        title="创业孵化"
        subtitle="Startup Incubator · Growth Accelerator"
        desc="印刷行业创业者的成长加速器 —— 知识库、导师咨询、成功案例、投资测算，助你从 0 到 1 跑通印刷生意"
        theme="orange"
        badge="创业加速通道"
        icon={<Lightbulb className="h-3.5 w-3.5" />}
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '创业孵化' }]}
      />

      {/* ===== 四大模块入口 ===== */}
      <Container className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULE_ENTRIES.map((entry) => {
            const Icon = entry.icon
            return (
              <Link
                key={entry.title}
                href={entry.href}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm',
                  'transition-all duration-base ease-out-expo',
                  'hover:-translate-y-1 hover:shadow-lg',
                )}
              >
                <div className={cn('h-1.5 w-full', THEME_BAR[entry.theme])} />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div
                    className={cn(
                      'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-base ease-out-expo group-hover:scale-110 sm:h-14 sm:w-14',
                      THEME_ICON_BG[entry.theme],
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6 sm:h-7 sm:w-7',
                        THEME_ICON_TEXT[entry.theme],
                      )}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-ink-primary sm:text-xl">
                    {entry.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                    {entry.desc}
                  </p>
                  <span
                    className={cn(
                      'mt-4 inline-flex items-center gap-1 text-sm font-medium transition-all duration-base ease-out-expo',
                      'group-hover:gap-2',
                      THEME_LINK[entry.theme],
                    )}
                  >
                    立即进入
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>

      {/* ===== 推荐内容区 ===== */}
      <Container className="mt-10 space-y-10">
        {/* 最新文章 */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink-primary sm:text-2xl">
                <BookOpen className="h-5 w-5 text-primary" />
                最新文章
              </h2>
              <p className="mt-1 text-sm text-ink-tertiary">
                前沿创业干货，持续更新
              </p>
            </div>
            <Link
              href="/startup/articles"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-light"
            >
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/startup/articles/${article.id}`}
                  className={cn(
                    'group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm',
                    'transition-all duration-base ease-out-expo',
                    'hover:-translate-y-1 hover:shadow-lg hover:border-primary/30',
                  )}
                >
                  <div className="h-32 w-full overflow-hidden bg-canvas sm:h-36">
                    {article.cover_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{
                              background:
                                'linear-gradient(135deg, #E8F1FB 0%, #F5F9FE 100%)',
                            }}
                          >
                            <BookOpen
                              className="h-10 w-10 text-primary/40"
                              strokeWidth={1.5}
                              aria-hidden
                            />
                          </div>
                        )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink-primary transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-ink-secondary">
                      {article.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-line-light pt-2 text-2xs text-ink-tertiary">
                      <span className="truncate">{article.author}</span>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-white p-8 text-center text-sm text-ink-tertiary">
              暂无文章，敬请期待
            </div>
          )}
        </section>

        {/* 热门案例 */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink-primary sm:text-2xl">
                <Lightbulb className="h-5 w-5 text-society" />
                热门案例
              </h2>
              <p className="mt-1 text-sm text-ink-tertiary">
                看看印刷创业者怎么做
              </p>
            </div>
            <Link
              href="/startup/cases"
              className="inline-flex items-center gap-1 text-sm font-medium text-society transition-colors hover:text-society-light"
            >
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {cases.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((item) => (
                <Link
                  key={item.id}
                  href={`/startup/cases/${item.id}`}
                  className={cn(
                    'group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm',
                    'transition-all duration-base ease-out-expo',
                    'hover:-translate-y-1 hover:shadow-lg hover:border-society/30',
                  )}
                >
                  <div className="relative h-32 w-full overflow-hidden bg-canvas sm:h-36">
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
                              className="h-10 w-10 text-society/40"
                              strokeWidth={1.5}
                              aria-hidden
                            />
                          </div>
                        )}
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-2xs font-medium text-society backdrop-blur-sm">
                      {item.industry}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink-primary transition-colors group-hover:text-society">
                      {item.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-ink-secondary">
                      {item.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-line-light pt-2 text-2xs">
                      <span className="text-ink-tertiary">
                        投资{' '}
                        <span className="font-semibold text-ink-secondary">
                          {item.investment_amount} 万
                        </span>
                      </span>
                      <span className="text-society">
                        营收{' '}
                        <span className="font-semibold">
                          {item.revenue} 万
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-white p-8 text-center text-sm text-ink-tertiary">
              暂无案例，敬请期待
            </div>
          )}
        </section>
      </Container>
    </main>
  )
}

// 日期格式化：YYYY-MM-DD
function formatDate(value: string): string {
  try {
    return value.slice(0, 10)
  } catch {
    return value
  }
}
