import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileSearch,
  PackageSearch,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react'
import { HomeHeroMedia } from '@/components/home/HomeHeroMedia'
import { Reveal } from '@/components/motion/Reveal'
import {
  HOME_CAPABILITIES,
  HOME_FAQ,
  HOME_FLOW,
  HOME_ROLES,
} from '@/lib/home-content'
import {
  PUBLIC_PARTNERS,
  PUBLIC_RESEARCH_FACTS,
} from '@/lib/public-content'

export const metadata: Metadata = {
  title: '智印联创 - 印刷产业协同服务平台',
  description: '连接印刷需求、生产能力、原料供应和来源清晰的纸价情报。',
}

const roleIcons = {
  requester: ClipboardList,
  printer: Factory,
  material_supplier: ShoppingCart,
} as const

const capabilityIcons = [PackageSearch, ShoppingCart, FileSearch] as const

export default function HomePage() {
  return (
    <main className="bg-white text-[#172033]">
      <section className="border-b border-[#D9DEE6]">
        <div className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-7xl items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(420px,.92fr)]">
          <div className="flex items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#B45309]">印刷产业协同服务平台</p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.12] tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
                让印刷供需<br />更清楚地协同
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#526174]">
                连接需求方、印刷厂与原料供应商，让需求、产能、报价和采购信息沿同一条路径流动。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/review"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#D97706] px-6 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-[#B45309] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173B63]"
                >
                  进入评审演示
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/orders"
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#173B63] px-6 text-sm font-semibold text-[#173B63] transition duration-200 ease-out hover:bg-[#EEF3F8] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
                >
                  查看真实服务
                </Link>
              </div>
            </div>
          </div>
          <HomeHeroMedia />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">先选择角色，再进入业务</h2>
            <p className="mt-4 text-base leading-7 text-[#526174]">每种角色只看到与当前任务有关的入口，减少在功能列表中反复寻找。</p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {HOME_ROLES.map((role, index) => {
            const Icon = roleIcons[role.id]
            const span = index === 0 ? 'lg:col-span-5' : index === 1 ? 'lg:col-span-4' : 'lg:col-span-3'
            return (
              <Reveal key={role.id} className={span} delay={index * 0.06}>
                <Link
                  href={role.href}
                  className="group flex h-full min-h-64 flex-col border border-[#D9DEE6] bg-white p-6 transition duration-200 ease-out hover:-translate-y-1 hover:border-[#173B63] hover:shadow-[0_16px_40px_rgba(23,59,99,.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
                >
                  <Icon className="size-7 text-[#173B63]" strokeWidth={1.6} aria-hidden />
                  <h3 className="mt-auto pt-10 text-xl font-bold">{role.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#526174]">{role.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#173B63] group-hover:text-[#D97706]">
                    进入工作区 <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="border-y border-[#D9DEE6] bg-[#F6F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">一条需求如何穿过产业链</h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 lg:grid-cols-4">
            {HOME_FLOW.map(([title, description], index) => (
              <Reveal key={title} delay={index * 0.07}>
                <li className="relative border-l-2 border-[#173B63] pl-5 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-6">
                  <span className="text-sm font-semibold text-[#D97706]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#526174]">{description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-end">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">从调研事实出发</h2>
            <p className="mt-4 text-sm leading-6 text-[#526174]">以下信息来自项目团队 2025 年企业调研，不代表平台实时经营成绩。</p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {PUBLIC_RESEARCH_FACTS.map((fact, index) => (
              <Reveal key={fact.label} delay={index * 0.06}>
                <div className="border-t-2 border-[#D97706] pt-5">
                  <p className="text-4xl font-bold tabular-nums text-[#173B63]">{fact.value}</p>
                  <p className="mt-3 text-sm font-bold">{fact.label}</p>
                  <p className="mt-2 text-xs leading-5 text-[#6B7280]">{fact.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#D9DEE6] bg-[#F6F7F8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">围绕协同闭环建设三项能力</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            {HOME_CAPABILITIES.map((item, index) => {
              const Icon = capabilityIcons[index]
              const featured = index === 0
              return (
                <Reveal key={item.title} className={featured ? 'lg:row-span-2' : ''} delay={index * 0.06}>
                  <Link
                    href={item.href}
                    className={`group grid h-full overflow-hidden border border-[#D9DEE6] bg-white ${featured ? 'sm:grid-cols-[1fr_1.05fr] lg:grid-cols-1' : 'sm:grid-cols-[180px_1fr]'}`}
                  >
                    <div className={`relative ${featured ? 'min-h-64 lg:min-h-80' : 'min-h-44'}`}>
                      <Image src={item.media} alt="" fill className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]" sizes={featured ? '(min-width:1024px) 55vw, 100vw' : '(min-width:1024px) 240px, 100vw'} />
                    </div>
                    <div className="flex flex-col p-6">
                      <Icon className="size-6 text-[#173B63]" strokeWidth={1.6} aria-hidden />
                      <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#526174]">{item.description}</p>
                      <span className="mt-auto pt-6 text-sm font-semibold text-[#173B63] group-hover:text-[#D97706]">查看服务</span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-0 border-x border-[#D9DEE6] lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative min-h-80 lg:min-h-[520px]">
          <Image src="/images/external/press-tools.jpg" alt="印刷工具与生产实践场景" fill className="object-cover" sizes="(min-width:1024px) 55vw, 100vw" />
        </div>
        <Reveal className="flex items-center bg-[#173B63] p-7 text-white sm:p-10 lg:p-12">
          <div>
            <BookOpenCheck className="size-8 text-[#F5B45B]" strokeWidth={1.6} aria-hidden />
            <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">产教实践进入真实业务场景</h2>
            <p className="mt-5 text-base leading-7 text-[#DCE6F0]">学习资源、导师指导与测算工具围绕真实印刷流程组织，帮助学生理解需求、生产和供应链。</p>
            <Link href="/startup" className="mt-8 inline-flex min-h-11 items-center gap-2 bg-white px-5 text-sm font-semibold text-[#173B63] transition hover:bg-[#F6F7F8] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5B45B]">
              进入产教实践中心 <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <ShieldCheck className="size-8 text-[#047857]" strokeWidth={1.6} aria-hidden />
            <h2 className="mt-6 text-3xl font-bold tracking-tight">可信信息有明确边界</h2>
            <p className="mt-4 text-sm leading-6 text-[#526174]">公开事实、合作单位、媒体与价格信息都应保留来源。未完成核验的内容不会包装成平台成绩。</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <div className="h-full border border-[#D9DEE6] p-6">
                <Building2 className="size-6 text-[#173B63]" aria-hidden />
                <h3 className="mt-5 text-lg font-bold">已确认合作单位</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#526174]">
                  {PUBLIC_PARTNERS.map((partner) => <li key={partner}>{partner}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="h-full border border-[#D9DEE6] bg-[#F6F7F8] p-6">
                <CheckCircle2 className="size-6 text-[#047857]" aria-hidden />
                <h3 className="mt-5 text-lg font-bold">公开原则</h3>
                <p className="mt-4 text-sm leading-6 text-[#526174]">真实数据与演示场景分开；纸价展示规格、地区、时间和来源；实际合作以双方确认条款为准。</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D9DEE6] bg-[#F6F7F8]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">常见问题</h2></Reveal>
          <div className="mt-8 space-y-3">
            {HOME_FAQ.map((item, index) => (
              <Reveal key={item.question} delay={Math.min(index * 0.04, 0.12)}>
                <details className="group border border-[#D9DEE6] bg-white p-5 open:border-[#173B63]">
                  <summary className="cursor-pointer list-none pr-8 text-base font-bold marker:hidden">{item.question}</summary>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-[#526174]">{item.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173B63] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-3xl font-bold">准备进入真实业务区？</h2>
            <p className="mt-3 text-sm leading-6 text-[#DCE6F0]">注册后完善主体资料，再按角色进入需求、产能或供应工作台。</p>
          </div>
          <Link href="/register" className="inline-flex min-h-12 w-fit items-center gap-2 bg-[#D97706] px-6 text-sm font-semibold text-white transition hover:bg-[#B45309] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            建立平台账号 <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  )
}
