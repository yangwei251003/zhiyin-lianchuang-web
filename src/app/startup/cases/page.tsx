import type { Metadata } from 'next'
import Link from 'next/link'
import { Lightbulb } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { CaseList } from '@/components/startup/CaseList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '创业案例 · 智印联创',
  description: '印刷行业真实创业案例，从设备选型到月营收突破的成长故事。',
}

type CaseRow = Database['public']['Tables']['cases']['Row']

interface CasesPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 创业案例列表页（服务端组件）
// 筛选通过 URL searchParams 驱动：服务端读取参数重新查询
export default async function CasesPage({ searchParams }: CasesPageProps) {
  const params = await searchParams
  const industry = params.industry || 'all'
  const keyword = (params.keyword || '').trim()

  const supabase = await createClient()

  // 主查询：案例列表
  let query = supabase.from('cases').select('*')

  if (industry !== 'all') {
    query = query.eq('industry', industry)
  }
  if (keyword) {
    const kw = keyword.replace(/,/g, '\\,')
    query = query.or(`title.ilike.%${kw}%,summary.ilike.%${kw}%`)
  }

  const { data: cases } = await query.order('created_at', {
    ascending: false,
  })
  const caseList = (cases ?? []) as CaseRow[]

  // 聚合可选行业：取所有案例的 industry 去重
  const { data: allIndustryRows } = await supabase
    .from('cases')
    .select('industry')
  const industrySet = new Set<string>()
  for (const row of allIndustryRows ?? []) {
    const ind = (row as { industry: string | null }).industry
    if (ind) industrySet.add(ind)
  }
  const availableIndustries = Array.from(industrySet).sort()

  return (
    <main className="pb-12">
      {/* ===== 页头 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #F08035 0%, #F5A66B 60%, #F8C08A 100%)',
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
              创业孵化
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">创业案例</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <Lightbulb className="h-7 w-7" />
            创业案例
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            真实印刷创业者的成长故事，从起步到盈利的完整路径参考
          </p>
        </Container>
      </section>

      {/* ===== 列表区 ===== */}
      <Container className="mt-6">
        <CaseList
          initialCases={caseList}
          filters={{ industry, keyword }}
          availableIndustries={availableIndustries}
        />
      </Container>
    </main>
  )
}
