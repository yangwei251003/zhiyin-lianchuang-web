import type { Metadata } from 'next'
import Link from 'next/link'
import { BriefcaseBusiness } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/common/EmptyState'

export const metadata: Metadata = { title: '加入我们 · 智印联创', description: '查看经审核后公开的项目招募信息。' }

export default function JoinPage() {
  return <main className="pb-12"><section className="border-b-2 border-society bg-white"><Container className="py-8 sm:py-10"><nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑"><Link href="/" className="hover:text-primary">首页</Link><span className="mx-1.5">/</span><Link href="/about" className="hover:text-primary">关于智印联创</Link><span className="mx-1.5">/</span><span className="text-ink-secondary">加入我们</span></nav><p className="text-xs font-semibold text-society">招募信息</p><h1 className="mt-2 text-2xl font-bold text-ink-primary sm:text-3xl">加入我们</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">公开岗位、实习机会和招募流程将在信息审核后发布。</p></Container></section><Container className="mt-8"><div className="rounded-lg border border-line bg-white"><EmptyState title="暂无公开招募信息" description="后续如有经确认的岗位或项目招募，会在这里发布。" icon={<BriefcaseBusiness className="h-10 w-10" strokeWidth={1.5} />} action={<Link href="/feedback" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light">提交联系需求</Link>} /></div></Container></main>
}
