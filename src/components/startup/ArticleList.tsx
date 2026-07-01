'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { ArticleCard } from './ArticleCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'

type ArticleRow = Database['public']['Tables']['articles']['Row']

export interface ArticleListProps {
  initialArticles: ArticleRow[]
  totalCount: number
  currentPage: number
  pageSize: number
  filters: {
    tag: string
    keyword: string
  }
  /** 可选标签列表（服务端聚合） */
  availableTags: string[]
}

// 构建文章列表 URL（仅保留有效参数）
function buildArticleUrl(next: {
  tag: string
  keyword: string
  page: number
}): string {
  const params = new URLSearchParams()
  if (next.tag && next.tag !== 'all') params.set('tag', next.tag)
  if (next.keyword) params.set('keyword', next.keyword)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/startup/articles?${qs}` : '/startup/articles'
}

// 文章列表客户端组件
// 筛选/分页通过更新 URL 触发服务端重新查询（searchParams 驱动）
export function ArticleList({
  initialArticles,
  totalCount,
  currentPage,
  pageSize,
  filters,
  availableTags,
}: ArticleListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [tag, setTag] = useState(filters.tag)
  const [keyword, setKeyword] = useState(filters.keyword)

  // URL 参数变化时同步本地状态
  useEffect(() => {
    setTag(filters.tag)
    setKeyword(filters.keyword)
  }, [filters.tag, filters.keyword])

  // 关键词搜索防抖（500ms）
  useEffect(() => {
    const trimmed = keyword.trim()
    if (trimmed === filters.keyword) return
    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(
          buildArticleUrl({ tag, keyword: trimmed, page: 1 }),
        )
      })
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  const navigate = (next: {
    tag?: string
    keyword?: string
    page?: number
  }) => {
    startTransition(() => {
      router.push(
        buildArticleUrl({
          tag: next.tag ?? tag,
          keyword: (next.keyword ?? keyword).trim(),
          page: next.page ?? 1,
        }),
      )
    })
  }

  const onTagChange = (value: string) => {
    setTag(value)
    navigate({ tag: value, page: 1 })
  }

  const hasArticles = initialArticles.length > 0
  const hasFilters = filters.tag !== 'all' || filters.keyword !== ''
  const tagOptions = [
    { value: 'all', label: '全部标签' },
    ...availableTags.map((t) => ({ value: t, label: t })),
  ]

  return (
    <div className="space-y-5">
      {/* ===== 筛选条 ===== */}
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="搜索文章标题或摘要"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:flex lg:w-auto lg:items-end">
            <Select
              label="标签"
              value={tag}
              onChange={(e) => onTagChange(e.target.value)}
              options={tagOptions}
              className="lg:w-40"
            />
            {(hasFilters || keyword) && (
              <Button
                variant="ghost"
                size="md"
                leftIcon={<X className="h-4 w-4" />}
                onClick={() => {
                  setTag('all')
                  setKeyword('')
                  navigate({ tag: 'all', keyword: '', page: 1 })
                }}
                className="lg:mb-0"
              >
                清空
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-tertiary">
          <span>
            共{' '}
            <span className="font-semibold text-ink-secondary">{totalCount}</span>{' '}
            篇文章
          </span>
        </div>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <ArticleListSkeleton />
      ) : hasArticles ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            variant={hasFilters ? 'search' : 'default'}
            title={hasFilters ? '未找到符合条件的文章' : '暂无创业文章'}
            description={
              hasFilters ? '试试调整筛选条件或更换关键词' : '敬请期待新文章上线'
            }
          />
        </div>
      )}

      {/* ===== 分页 ===== */}
      {!isPending && hasArticles && (
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onChange={(p) => navigate({ page: p })}
          className={cn('pt-2')}
        />
      )}
    </div>
  )
}

// 文章列表骨架屏
function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-line bg-white"
        >
          <Skeleton className="h-40 w-full sm:h-44" />
          <div className="space-y-2.5 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between border-t border-line-light pt-2.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
