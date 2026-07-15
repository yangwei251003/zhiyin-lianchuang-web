import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { ArticleList } from '@/components/startup/ArticleList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '创业文章 · 智印联创',
  description: '印刷行业创业干货文章，涵盖设备选型、选址策略、成本控制、客户开发。',
}

type ArticleRow = Database['public']['Tables']['articles']['Row']

const PAGE_SIZE = 10

interface ArticlesPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 创业文章列表页（服务端组件）
// 筛选/分页通过 URL searchParams 驱动：服务端读取参数重新查询
export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const tag = params.tag || 'all'
  const keyword = (params.keyword || '').trim()

  const supabase = await createClient()

  // 主查询：文章列表 + 总数
  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })

  if (tag !== 'all') {
    // tags 数组 contains 筛选
    query = query.contains('tags', [tag])
  }
  if (keyword) {
    const kw = keyword.replace(/,/g, '\\,')
    query = query.or(`title.ilike.%${kw}%,summary.ilike.%${kw}%`)
  }

  const { data: articles, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const articleList = (articles ?? []) as ArticleRow[]

  // 聚合可选标签：取所有文章的 tags 去重
  const { data: allTagsRows } = await supabase
    .from('articles')
    .select('tags')
  const tagSet = new Set<string>()
  for (const row of allTagsRows ?? []) {
    const tags = (row as { tags: string[] | null }).tags
    if (Array.isArray(tags)) {
      tags.forEach((t) => tagSet.add(t))
    }
  }
  const availableTags = Array.from(tagSet).sort()

  return (
    <main className="pb-12">
      {/* ===== 页头 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2A6CDB 0%, #4A85E6 60%, #5B8FE8 100%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
          }}
        />
        <Container className="relative py-10 sm:py-12">
          <nav
            className="mb-3 text-xs text-white/70"
            aria-label="面包屑"
          >
            <Link href="/" className="hover:text-white">
              首页
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/startup" className="hover:text-white">
              产教实践
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">创业文章</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <BookOpen className="h-7 w-7" />
            创业文章
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            行业干货、设备选型、成本控制实战经验，助你少走弯路
          </p>
        </Container>
      </section>

      {/* ===== 列表区 ===== */}
      <Container className="mt-6">
        <ArticleList
          initialArticles={articleList}
          totalCount={count ?? 0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          filters={{ tag, keyword }}
          availableTags={availableTags}
        />
      </Container>
    </main>
  )
}
