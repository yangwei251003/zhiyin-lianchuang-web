import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, Calendar, Eye, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { AIArticleSummary } from '@/components/startup/AIArticleSummary'
import { sanitizeArticleHtml } from '@/lib/content/sanitize'
import type { Database } from '@/types/database'

type ArticleRow = Database['public']['Tables']['articles']['Row']

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return [{ id: '1' }]
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('title, summary')
    .eq('id', id)
    .maybeSingle()
  if (!article) return { title: '文章详情 · 智印联创' }
  const row = article as Pick<ArticleRow, 'title' | 'summary'>
  return {
    title: `${row.title} · 创业文章 · 智印联创`,
    description: row.summary,
  }
}

// 创业文章详情页（服务端组件）
export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. 获取文章详情
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!article) notFound()
  const articleRow = article as ArticleRow

  // 2. 增加阅读量（best-effort，失败不影响渲染）
  await supabase
    .from('articles')
    .update({ view_count: (articleRow.view_count || 0) + 1 })
    .eq('id', id)

  // 3. 相关文章推荐（排除当前，取 3 条）
  const { data: related } = await supabase
    .from('articles')
    .select('id, title, summary, cover_image, author, created_at')
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(3)
  const relatedArticles = (related ?? []) as Pick<
    ArticleRow,
    'id' | 'title' | 'summary' | 'cover_image' | 'author' | 'created_at'
  >[]

  const tags = Array.isArray(articleRow.tags) ? articleRow.tags : []
  const safeContent = sanitizeArticleHtml(articleRow.content)

  return (
    <main className="pb-16 min-h-screen bg-slate-50/50">
      {/* ===== 面包屑 & 返回 ===== */}
      <Container className="pt-6">
        <div className="flex flex-col gap-4">
          <nav
            className="flex items-center gap-1.5 text-xs text-ink-tertiary"
            aria-label="面包屑"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              首页
            </Link>
            <span>/</span>
            <Link href="/startup" className="hover:text-primary transition-colors">
              创业孵化
            </Link>
            <span>/</span>
            <Link href="/startup/articles" className="hover:text-primary transition-colors">
              创业文章
            </Link>
            <span>/</span>
            <span className="text-ink-secondary">文章详情</span>
          </nav>
          
          <Link
            href="/startup/articles"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink-secondary transition-all hover:text-primary hover:-translate-x-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
        </div>
      </Container>

      {/* ===== 文章主体 ===== */}
      <Container size="md" className="mt-6">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-10">
          {/* 标题 + 元信息 */}
          <header className="border-b border-line pb-6">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink-primary sm:text-4xl">
              {articleRow.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-tertiary">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary/70" />
                <span className="font-medium text-ink-secondary">{articleRow.author}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-environment/70" />
                <span>{formatDate(articleRow.created_at)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-society/70" />
                <span>{(articleRow.view_count || 0) + 1} 次阅读</span>
              </span>
            </div>
          </header>

          {/* 封面图 */}
          {articleRow.cover_image && (
            <div className="mt-8 overflow-hidden rounded-xl border border-line bg-canvas shadow-inner aspect-[21/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={articleRow.cover_image}
                alt={articleRow.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}

          {/* AI 摘要卡片 */}
          <div className="mt-8">
            <AIArticleSummary
              articleId={articleRow.id}
              title={articleRow.title}
              content={articleRow.content}
            />
          </div>

          {/* 正文内容 */}
          <article className="mt-8">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </article>

          {/* 标签 */}
          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
              <span className="text-sm font-medium text-ink-tertiary">标签：</span>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/startup/articles?tag=${encodeURIComponent(tag)}`}
                >
                  <Badge variant="primary" size="md" className="hover:bg-primary hover:text-white transition-colors">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* ===== 相关文章推荐 ===== */}
      {relatedArticles.length > 0 && (
        <Container size="lg" className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-ink-primary sm:text-xl">
              相关文章推荐
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((item) => (
              <Link
                key={item.id}
                href={`/startup/articles/${item.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-all duration-base ease-out-expo hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
              >
                <div className="h-28 w-full overflow-hidden bg-canvas">
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
                          'linear-gradient(135deg, #E8F1FB 0%, #F5F9FE 100%)',
                      }}
                    >
                      <BookOpen
                        className="h-8 w-8 text-primary/40"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-primary transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-ink-secondary">
                    {item.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-line-light pt-1.5 text-2xs text-ink-tertiary">
                    <span className="truncate">{item.author}</span>
                    <span>{formatDate(item.created_at)}</span>
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

// 日期格式化：YYYY-MM-DD
function formatDate(value: string): string {
  try {
    return value.slice(0, 10)
  } catch {
    return value
  }
}
