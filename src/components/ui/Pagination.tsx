'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
  className?: string
}

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)
  return pages
}

// 分页组件：上一页/下一页 + 页码，当前页高亮
export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (total === 0) return null
  const pages = getPageRange(page, totalPages)

  const baseBtn =
    'inline-flex h-9 items-center justify-center rounded-md text-ink-secondary transition-colors hover:bg-canvas hover:text-ink-primary disabled:pointer-events-none disabled:opacity-40'

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="分页"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="上一页"
        className={cn(baseBtn, 'w-9')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`gap-${i}`} className="px-2 text-ink-tertiary">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm transition-colors',
              p === page
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="下一页"
        className={cn(baseBtn, 'w-9')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
