'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Eye } from 'lucide-react'
import type { Database } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type ArticleRow = Database['public']['Tables']['articles']['Row']

export interface ArticleCardProps {
  article: ArticleRow
  className?: string
}

// 创业文章卡片：封面 + 标签 + 标题 + 摘要 + 作者 + 时间 + 阅读量
// 卡片可点击跳转详情，hover 浮起
export function ArticleCard({ article, className }: ArticleCardProps) {
  const router = useRouter()
  const detailHref = `/startup/articles/${article.id}`

  const handleClick = () => router.push(detailHref)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(detailHref)
    }
  }

  const tags = Array.isArray(article.tags) ? article.tags.slice(0, 3) : []

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-sm',
        'cursor-pointer transition-all duration-base ease-out-expo',
        'hover:-translate-y-1 hover:shadow-lg hover:border-primary/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className,
      )}
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* 封面图 */}
      <div className="relative h-40 w-full overflow-hidden bg-canvas sm:h-44">
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
                'linear-gradient(135deg, #E8F1FB 0%, #F5F9FE 50%, #EBF9F3 100%)',
            }}
          >
            <BookOpen
              className="h-12 w-12 text-primary/40"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        )}
        {/* 标签浮层 */}
        {tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {/* 左侧主色条 */}
        <div
          className="absolute left-0 top-0 h-full w-1.5 bg-primary"
          aria-hidden
        />
      </div>

      {/* 内容区 */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink-primary transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink-secondary">
          {article.summary}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-line-light pt-2.5 text-2xs text-ink-tertiary">
          <span className="truncate">{article.author}</span>
          <span className="shrink-0">{formatDate(article.created_at)}</span>
          <span className="inline-flex shrink-0 items-center gap-0.5">
            <Eye className="h-3 w-3" />
            {article.view_count ?? 0}
          </span>
        </div>
      </div>
    </article>
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
