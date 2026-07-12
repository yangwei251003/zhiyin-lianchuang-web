import type { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/common/EmptyState'

export const metadata: Metadata = { title: '技术培训 · 智印联创', description: '查看经审核后公开的印刷技术学习材料。' }

export default function TrainingPage() {
  return <main className="pb-12"><section className="border-b-2 border-environment bg-white"><Container className="py-8 sm:py-10"><nav className="mb-4 text-xs text-ink-tertiary" aria-label="面包屑"><Link href="/" className="hover:text-primary">首页</Link><span className="mx-1.5">/</span><span className="text-ink-secondary">技术培训</span></nav><p className="text-xs font-semibold text-environment">学习资源</p><h1 className="mt-2 text-2xl font-bold text-ink-primary sm:text-3xl">技术培训</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">课程、视频与学习材料将在版权、来源和适用范围确认后公开。</p></Container></section><Container className="mt-8"><div className="rounded-lg border border-line bg-white"><EmptyState title="培训内容筹备中" description="已授权的学习材料上线后会在这里展示。" icon={<GraduationCap className="h-10 w-10" strokeWidth={1.5} />} action={<Link href="/feedback" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-light">提交学习需求</Link>} /></div></Container></main>
}
