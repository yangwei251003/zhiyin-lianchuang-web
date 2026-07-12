'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { MentorCard } from './MentorCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import type { Database } from '@/types/database'

type MentorRow = Database['public']['Tables']['mentors']['Row']

export interface MentorListProps {
  initialMentors: MentorRow[]
  filters: {
    expertise: string
    keyword: string
  }
  /** 可选专长列表（服务端聚合） */
  availableExpertise: string[]
}

// 构建导师列表 URL
function buildMentorUrl(next: {
  expertise: string
  keyword: string
}): string {
  const params = new URLSearchParams()
  if (next.expertise && next.expertise !== 'all')
    params.set('expertise', next.expertise)
  if (next.keyword) params.set('keyword', next.keyword)
  const qs = params.toString()
  return qs ? `/startup/mentors?${qs}` : '/startup/mentors'
}

// 导师列表客户端组件
// 筛选通过更新 URL 触发服务端重新查询（searchParams 驱动）
export function MentorList({
  initialMentors,
  filters,
  availableExpertise,
}: MentorListProps) {
  const filterKey = `${filters.expertise}:${filters.keyword}`
  return <MentorListContent key={filterKey} initialMentors={initialMentors} filters={filters} availableExpertise={availableExpertise} />
}

function MentorListContent({
  initialMentors,
  filters,
  availableExpertise,
}: MentorListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [expertise, setExpertise] = useState(filters.expertise)
  const [keyword, setKeyword] = useState(filters.keyword)

  // 关键词搜索防抖（500ms）
  useEffect(() => {
    const trimmed = keyword.trim()
    if (trimmed === filters.keyword) return
    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(
          buildMentorUrl({ expertise, keyword: trimmed }),
        )
      })
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  const navigate = (next: {
    expertise?: string
    keyword?: string
  }) => {
    startTransition(() => {
      router.push(
        buildMentorUrl({
          expertise: next.expertise ?? expertise,
          keyword: (next.keyword ?? keyword).trim(),
        }),
      )
    })
  }

  const onExpertiseChange = (value: string) => {
    setExpertise(value)
    navigate({ expertise: value })
  }

  const hasMentors = initialMentors.length > 0
  const hasFilters = filters.expertise !== 'all' || filters.keyword !== ''
  const expertiseOptions = [
    { value: 'all', label: '全部专长' },
    ...availableExpertise.map((t) => ({ value: t, label: t })),
  ]

  return (
    <div className="space-y-5">
      {/* ===== 筛选条 ===== */}
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="搜索导师姓名、职称或公司"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:flex lg:w-auto lg:items-end">
            <Select
              label="专长"
              value={expertise}
              onChange={(e) => onExpertiseChange(e.target.value)}
              options={expertiseOptions}
              className="lg:w-40"
            />
            {(hasFilters || keyword) && (
              <Button
                variant="ghost"
                size="md"
                leftIcon={<X className="h-4 w-4" />}
                onClick={() => {
                  setExpertise('all')
                  setKeyword('')
                  navigate({ expertise: 'all', keyword: '' })
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
            <span className="font-semibold text-ink-secondary">
              {initialMentors.length}
            </span>{' '}
            位导师
          </span>
        </div>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <MentorListSkeleton />
      ) : hasMentors ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            variant={hasFilters ? 'search' : 'default'}
            title={hasFilters ? '未找到符合条件的导师' : '暂无创业导师'}
            description={
              hasFilters ? '试试调整筛选条件或更换关键词' : '敬请期待导师入驻'
            }
          />
        </div>
      )}
    </div>
  )
}

// 导师列表骨架屏
function MentorListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-line bg-white p-5"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}
