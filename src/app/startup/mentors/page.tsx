import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarCheck, Users } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { PUBLIC_MENTORS } from '@/lib/public-content'

export const metadata: Metadata = {
  title: '创业导师 · 智印联创',
  description: '查看项目已确认的校内专业导师和企业产业导师信息。',
}

export default function MentorsPage() {
  return (
    <main className="pb-12">
      <section className="border-b-2 border-environment bg-white">
        <Container className="py-8 sm:py-10">
          <nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span className="mx-1.5">/</span>
            <Link href="/startup" className="hover:text-primary">产教实践</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-secondary">创业导师</span>
          </nav>
          <p className="text-xs font-semibold text-environment">导师支持</p>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-ink-primary sm:text-3xl">
            <Users className="h-6 w-6 text-environment" />
            创业导师
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">
            以下导师信息以项目商业计划书为依据。咨询范围、时间和具体安排将在双方确认后另行沟通。
          </p>
        </Container>
      </section>

      <Container className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PUBLIC_MENTORS.map((mentor) => (
            <article key={mentor.name} className="rounded-lg border border-line bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-environment-bg text-base font-semibold text-environment">
                  {mentor.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-ink-primary">{mentor.name}</h2>
                  <p className="mt-1 text-sm text-ink-secondary">{mentor.title}</p>
                  <p className="mt-3 text-sm leading-6 text-ink-secondary">{mentor.expertise}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-6 flex flex-col gap-4 border-l-2 border-environment bg-environment-bg px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              <CalendarCheck className="h-4 w-4 text-environment" />
              提交咨询需求
            </h2>
            <p className="mt-1 text-sm leading-6 text-ink-secondary">导师排班与咨询流程确认后，平台会依据提交内容安排后续联系。</p>
          </div>
          <Link href="/feedback" className="inline-flex h-10 shrink-0 items-center gap-1 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light">
            提交需求 <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </Container>
    </main>
  )
}
