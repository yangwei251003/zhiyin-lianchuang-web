'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { CaseCard } from './CaseCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import type { Database } from '@/types/database'

type CaseRow = Database['public']['Tables']['cases']['Row']

export interface CaseListProps {
  initialCases: CaseRow[]
  filters: {
    industry: string
    keyword: string
  }
  /** 可选行业列表（服务端聚合） */
  availableIndustries: string[]
}

// 构建案例列表 URL
function buildCaseUrl(next: {
  industry: string
  keyword: string
}): string {
  const params = new URLSearchParams()
  if (next.industry && next.industry !== 'all')
    params.set('industry', next.industry)
  if (next.keyword) params.set('keyword', next.keyword)
  const qs = params.toString()
  return qs ? `/startup/cases?${qs}` : '/startup/cases'
}

// 案例列表客户端组件
// 筛选通过更新 URL 触发服务端重新查询（searchParams 驱动）
export function CaseList({
  initialCases,
  filters,
  availableIndustries,
}: CaseListProps) {
  const filterKey = `${filters.industry}:${filters.keyword}`
  return <CaseListContent key={filterKey} initialCases={initialCases} filters={filters} availableIndustries={availableIndustries} />
}

function CaseListContent({
  initialCases,
  filters,
  availableIndustries,
}: CaseListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [industry, setIndustry] = useState(filters.industry)
  const [keyword, setKeyword] = useState(filters.keyword)

  // 关键词搜索防抖（500ms）
  useEffect(() => {
    const trimmed = keyword.trim()
    if (trimmed === filters.keyword) return
    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(buildCaseUrl({ industry, keyword: trimmed }))
      })
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  const navigate = (next: {
    industry?: string
    keyword?: string
  }) => {
    startTransition(() => {
      router.push(
        buildCaseUrl({
          industry: next.industry ?? industry,
          keyword: (next.keyword ?? keyword).trim(),
        }),
      )
    })
  }

  const onIndustryChange = (value: string) => {
    setIndustry(value)
    navigate({ industry: value })
  }

  const hasCases = initialCases.length > 0
  const hasFilters = filters.industry !== 'all' || filters.keyword !== ''
  const industryOptions = [
    { value: 'all', label: '全部行业' },
    ...availableIndustries.map((t) => ({ value: t, label: t })),
  ]

  return (
    <div className="space-y-5">
      {/* ===== 筛选条 ===== */}
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="搜索案例标题或摘要"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:flex lg:w-auto lg:items-end">
            <Select
              label="行业"
              value={industry}
              onChange={(e) => onIndustryChange(e.target.value)}
              options={industryOptions}
              className="lg:w-40"
            />
            {(hasFilters || keyword) && (
              <Button
                variant="ghost"
                size="md"
                leftIcon={<X className="h-4 w-4" />}
                onClick={() => {
                  setIndustry('all')
                  setKeyword('')
                  navigate({ industry: 'all', keyword: '' })
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
              {initialCases.length}
            </span>{' '}
            个案例
          </span>
        </div>
      </div>

      {/* ===== 列表区 ===== */}
      {isPending ? (
        <CaseListSkeleton />
      ) : hasCases ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialCases.map((item) => (
            <CaseCard key={item.id} caseItem={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white shadow-sm">
          <EmptyState
            variant={hasFilters ? 'search' : 'default'}
            title={hasFilters ? '未找到符合条件的案例' : '暂无创业案例'}
            description={
              hasFilters ? '试试调整筛选条件或更换关键词' : '敬请期待新案例上线'
            }
          />
        </div>
      )}
    </div>
  )
}

// 案例列表骨架屏
function CaseListSkeleton() {
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
            <div className="grid grid-cols-2 gap-2 border-t border-line-light pt-2.5">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
