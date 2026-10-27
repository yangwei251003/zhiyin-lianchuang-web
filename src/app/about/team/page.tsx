import type { Metadata } from 'next'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { PUBLIC_MENTORS, PUBLIC_PARTNERS } from '@/lib/public-content'

export const metadata: Metadata = { title: '团队与支持 · 智印联创', description: '查看智印联创已确认的导师支持与合作单位信息。' }

export default function TeamPage() {
  return <main className="pb-12"><section className="border-b-2 border-environment bg-white"><Container className="py-8 sm:py-10"><nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑"><Link href="/" className="hover:text-primary">首页</Link><span className="mx-1.5">/</span><Link href="/about" className="hover:text-primary">关于智印联创</Link><span className="mx-1.5">/</span><span className="text-ink-secondary">团队与支持</span></nav><p className="text-xs font-semibold text-environment">项目支持</p><h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-ink-primary sm:text-3xl"><Users className="h-6 w-6 text-environment" />团队与支持</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">为保护个人信息，项目成员资料仅在获得本人授权后公开。以下为已确认可公开的导师与合作单位。</p></Container></section><Container className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2"><section><h2 className="text-xl font-bold text-ink-primary">项目导师</h2><div className="mt-4 space-y-3">{PUBLIC_MENTORS.map((mentor) => <article key={mentor.name} className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink-primary">{mentor.name} · {mentor.title}</h3><p className="mt-2 text-sm leading-6 text-ink-secondary">{mentor.expertise}</p></article>)}</div></section><section><h2 className="text-xl font-bold text-ink-primary">合作单位</h2><ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">{PUBLIC_PARTNERS.map((partner) => <li key={partner} className="px-4 py-4 text-sm font-medium text-ink-primary">{partner}</li>)}</ul></section></Container></main>
}
