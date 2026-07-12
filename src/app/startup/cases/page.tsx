import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Lightbulb } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/common/EmptyState'

export const metadata: Metadata = {
  title: '创业案例 · 智印联创',
  description: '查看经案例主体授权并完成审核后公开的创业实践材料。',
}

export default function CasesPage() {
  return (
    <main className="pb-12">
      <section className="border-b-2 border-society bg-white">
        <Container className="py-8 sm:py-10">
          <nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span className="mx-1.5">/</span>
            <Link href="/startup" className="hover:text-primary">创业孵化</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-secondary">创业案例</span>
          </nav>
          <p className="text-xs font-semibold text-society">公开实践材料</p>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-ink-primary sm:text-3xl">
            <Lightbulb className="h-6 w-6 text-society" />
            创业案例
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">
            仅展示已获案例主体授权且完成审核的内容。平台不公开未经确认的投入、营收、客户或经营结果。
          </p>
        </Container>
      </section>

      <Container className="mt-6">
        <div className="rounded-lg border border-line bg-white">
          <EmptyState
            title="公开案例征集中"
            description="案例主体授权和事实核验完成后，相关内容会在此处发布。"
            icon={<BookOpen className="h-10 w-10" strokeWidth={1.5} />}
            action={
              <Link href="/feedback" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light">
                提交案例线索
              </Link>
            }
          />
        </div>
      </Container>
    </main>
  )
}
