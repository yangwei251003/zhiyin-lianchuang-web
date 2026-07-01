import type { Metadata } from 'next'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { MentorList } from '@/components/startup/MentorList'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: '创业导师 · 智印联创',
  description: '资深印刷行业专家 1 对 1 创业指导，设备选型、成本控制、客户开发、电商运营。',
}

type MentorRow = Database['public']['Tables']['mentors']['Row']

interface MentorsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// 创业导师列表页（服务端组件）
// 筛选通过 URL searchParams 驱动：服务端读取参数重新查询
export default async function MentorsPage({ searchParams }: MentorsPageProps) {
  const params = await searchParams
  const expertise = params.expertise || 'all'
  const keyword = (params.keyword || '').trim()

  const supabase = await createClient()

  // 主查询：导师列表
  let query = supabase.from('mentors').select('*')

  if (expertise !== 'all') {
    // expertise 数组 contains 筛选
    query = query.contains('expertise', [expertise])
  }
  if (keyword) {
    const kw = keyword.replace(/,/g, '\\,')
    query = query.or(
      `name.ilike.%${kw}%,title.ilike.%${kw}%,company.ilike.%${kw}%`,
    )
  }

  const { data: mentors } = await query.order('created_at', {
    ascending: false,
  })
  const mentorList = (mentors ?? []) as MentorRow[]

  // 聚合可选专长：取所有导师的 expertise 去重
  const { data: allExpertiseRows } = await supabase
    .from('mentors')
    .select('expertise')
  const expertiseSet = new Set<string>()
  for (const row of allExpertiseRows ?? []) {
    const arr = (row as { expertise: string[] | null }).expertise
    if (Array.isArray(arr)) {
      arr.forEach((t) => expertiseSet.add(t))
    }
  }
  const availableExpertise = Array.from(expertiseSet).sort()

  return (
    <main className="pb-12">
      {/* ===== 页头 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2BAE6E 0%, #4ECB9E 60%, #6FD9B5 100%)',
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
            <span className="text-white">创业导师</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <Users className="h-7 w-7" />
            创业导师
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            资深印刷行业专家 1 对 1 指导，覆盖设备选型、成本控制、客户开发、电商运营
          </p>
        </Container>
      </section>

      {/* ===== 列表区 ===== */}
      <Container className="mt-6">
        <MentorList
          initialMentors={mentorList}
          filters={{ expertise, keyword }}
          availableExpertise={availableExpertise}
        />
      </Container>
    </main>
  )
}
