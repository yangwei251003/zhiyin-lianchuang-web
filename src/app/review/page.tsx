import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { ReviewAccessForm } from '@/components/review/ReviewAccessForm'
import { hasReviewSession } from '@/lib/review/server'

export const metadata: Metadata = {
  title: '评审演示',
  description: '进入智印联创独立评审演示，体验印刷需求、产能与原料供给协同。',
}

export default async function ReviewPage() {
  if (await hasReviewSession()) redirect('/review/workspace')

  return (
    <main className="min-h-[100dvh] bg-[#F6F7F8] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#D9DEE6] bg-white lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="p-6 sm:p-10 lg:p-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#173B63] hover:text-[#D97706]">
            <ArrowLeft className="size-4" aria-hidden />
            返回网站首页
          </Link>
          <p className="mt-12 text-sm font-semibold text-[#B45309]">受控评审入口</p>
          <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight text-[#172033] sm:text-5xl">
            看懂一笔印刷需求如何完成产业协同
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#526174]">
            通过校园开放日宣传物料场景，切换需求方、印刷厂和原料供应商，体验同一业务在产业链中的传递。
          </p>
          <ReviewAccessForm />
        </section>

        <aside className="border-t border-[#D9DEE6] bg-[#173B63] p-6 text-white sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
          <h2 className="text-xl font-bold">演示边界清晰</h2>
          <ul className="mt-7 space-y-6 text-sm leading-6 text-[#E4ECF4]">
            {[
              '演示订单、报价和供货方案不会写入真实业务表。',
              '金额与数量均有明确演示标识，不作为运营成绩。',
              '真实调研、合作单位和纸价信息仍按来源核验。',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#F5B45B]" strokeWidth={1.7} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  )
}
