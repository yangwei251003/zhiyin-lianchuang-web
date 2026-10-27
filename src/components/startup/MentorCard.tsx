'use client'

import { useRouter } from 'next/navigation'
import { Building2, CalendarClock, UserRound } from 'lucide-react'
import type { Database } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type MentorRow = Database['public']['Tables']['mentors']['Row']

export interface MentorCardProps {
  mentor: MentorRow
  className?: string
}

// 创业导师卡片：头像 + 姓名 + 职称 + 公司 + 专长 + 简介 + 预约按钮
export function MentorCard({ mentor, className }: MentorCardProps) {
  const router = useRouter()
  const detailHref = `/startup/mentors/${mentor.id}`
  const expertise = Array.isArray(mentor.expertise) ? mentor.expertise : []

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(detailHref)
  }

  const handleClick = () => router.push(detailHref)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(detailHref)
    }
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-sm',
        'cursor-pointer transition-all duration-base ease-out-expo',
        'hover:-translate-y-1 hover:shadow-lg hover:border-environment/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-environment/40',
        className,
      )}
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* 左侧主色条 */}
      <div
        className="absolute left-0 top-0 h-full w-1.5 bg-environment"
        aria-hidden
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* 头部：头像 + 姓名 + 职称 */}
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line bg-canvas">
            {mentor.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, #EBF9F3 0%, #F5FBF8 100%)',
                }}
              >
                <UserRound
                  className="h-7 w-7 text-environment/60"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-snug text-ink-primary transition-colors group-hover:text-environment">
              {mentor.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-ink-secondary">
              {mentor.title}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-2xs text-ink-tertiary">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{mentor.company}</span>
            </p>
          </div>
        </div>

        {/* 专长标签 */}
        {expertise.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {expertise.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="success" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 简介 */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-ink-secondary">
          {mentor.bio}
        </p>

        {/* 底部：预约按钮 */}
        <div className="mt-1 flex items-center justify-between border-t border-line-light pt-3">
          <span className="inline-flex items-center gap-1 text-2xs text-ink-tertiary">
            <CalendarClock className="h-3 w-3" />
            在线 1 对 1 咨询
          </span>
          <Button
            size="sm"
            variant="success"
            onClick={handleBook}
            className="shrink-0"
          >
            立即预约
          </Button>
        </div>
      </div>
    </article>
  )
}
