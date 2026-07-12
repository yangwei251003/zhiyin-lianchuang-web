import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileCheck2,
  Handshake,
  Leaf,
  LineChart,
  PackageSearch,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import {
  PRICE_DATA_STATUS,
  PUBLIC_PARTNERS,
  PUBLIC_PLATFORM_PROFILE,
  PUBLIC_RESEARCH_FACTS,
} from '@/lib/public-content'
import { HeroBackground } from '@/components/home/HeroBackground'

export const metadata: Metadata = {
  title: '智印联创 - 印刷产业协同服务平台',
  description:
    '智印联创面向中小印刷企业提供订单撮合、集中采购、纸价信息与创业孵化服务。',
}

const roles = [
  {
    title: '我有印刷需求',
    description: '发布清晰需求，寻找合适的印刷服务能力。',
    href: '/orders/publish',
    icon: ClipboardList,
  },
  {
    title: '我是印刷厂商',
    description: '展示设备与工艺能力，获取匹配的订单机会。',
    href: '/orders',
    icon: Factory,
  },
  {
    title: '我要采购耗材',
    description: '查看集采项目、提交采购意向并统一询价。',
    href: '/purchase',
    icon: ShoppingCart,
  },
] as const

const services = [
  {
    title: '供需撮合',
    description: '按品类、工艺、地区和交期整理供需信息，支持后续沟通。',
    href: '/orders',
    icon: Handshake,
  },
  {
    title: '集中采购',
    description: '以采购意向聚合需求，推动透明询价与供应商比选。',
    href: '/purchase',
    icon: PackageSearch,
  },
  {
    title: '纸价信息',
    description: '接入获授权市场数据后，按规格和区域呈现价格与趋势。',
    href: '/prediction/铜版纸',
    icon: LineChart,
  },
  {
    title: '创业孵化',
    description: '连接实训、导师、设备选型与产业资源对接服务。',
    href: '/startup',
    icon: Sparkles,
  },
] as const

const chain = [
  ['原材料', '纸张与耗材信息、采购需求聚合'],
  ['纸张生产', '供应商资质与报价口径管理'],
  ['印前制版', '工艺要求与文件交付协同'],
  ['印刷工厂', '订单接单、产能展示与智能匹配'],
  ['印后加工', '工艺协作与交期衔接'],
  ['包装设计', '需求拆解与设计资源对接'],
  ['物流配送', '交付节点与服务沟通'],
  ['品牌客户', '需求发布与供应商选择'],
] as const

const process = [
  ['注册入驻', '建立账号与企业基础资料', '/register', '去注册'],
  ['企业认证', '提交企业信息，等待审核', '/mine/auth', '去认证'],
  ['发布需求', '发布订单或产能信息', '/orders/publish', '去发布'],
  ['沟通成交', '在线查看报价，线下完成交易', '/orders', '查看订单'],
] as const

export default function HomePage() {
  return (
    <main className="bg-white text-[#172033]">
      <section className="relative overflow-hidden border-b border-cyan-300/20 bg-[#061020] text-white">
        <HeroBackground />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-300 via-fuchsia-500 to-yellow-300" aria-hidden />
            <p className="mt-7 text-sm font-semibold text-cyan-200">未来印刷产业协同平台</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-6xl">
              {PUBLIC_PLATFORM_PROFILE.name}
              <span className="mt-3 block text-2xl font-semibold text-cyan-100 sm:text-3xl">
                {PUBLIC_PLATFORM_PROFILE.tagline}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              为印刷企业提供清晰的供需沟通、采购意向和行业信息服务，让协作从需求描述开始。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 px-6 text-base font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,.35)] transition hover:-translate-y-0.5"
              >
                免费入驻
                <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link
                href="/prediction/铜版纸"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <BarChart3 className="size-5" aria-hidden />
                查看纸价信息
              </Link>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">{PUBLIC_PLATFORM_PROFILE.launchNotice}</p>
          </div>

          <aside className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="absolute right-0 top-0 h-24 w-24 border-b border-l border-[#D9DEE6] print-dots" aria-hidden />
            <div className="relative flex items-start justify-between gap-6 border-b border-[#D9DEE6] pb-6">
              <div>
                <p className="text-xs font-semibold text-cyan-200">服务索引</p>
                <h2 className="mt-2 text-xl font-bold text-white">从产业协作的真实需求出发</h2>
              </div>
              <Image src="/images/企业logo.png" alt="智印联创" width={160} height={32} className="h-8 w-auto object-contain" />
            </div>
            <div className="relative mt-2 divide-y divide-[#D9DEE6]">
              {PUBLIC_PARTNERS.map((partner) => (
                <div key={partner} className="flex gap-3 py-4">
                  <Building2 className="mt-0.5 size-5 shrink-0 text-[#047857]" strokeWidth={1.7} aria-hidden />
                  <p className="text-sm leading-6 text-slate-200">{partner}</p>
                </div>
              ))}
            </div>
            <p className="relative mt-5 border-l-2 border-fuchsia-400 pl-3 text-xs leading-5 text-slate-300">公开内容与价格信息均以已核验来源为准，不以示例数据填充。</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-6 border-b border-[#D9DEE6] pb-4">
          <div>
            <p className="print-index text-xs font-semibold">01 / 协同入口</p>
            <h2 className="mt-2 text-2xl font-bold text-[#172033]">明确角色，再开始协作</h2>
          </div>
        </div>
        <div className="grid border-l border-t border-[#D9DEE6] md:grid-cols-3">
          {roles.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group border-b border-r border-[#D9DEE6] bg-white p-6 transition-colors hover:bg-[#F6F7F8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
            >
              <Icon className="size-7 text-[#173B63] group-hover:text-[#D97706]" strokeWidth={1.7} aria-hidden />
              <h3 className="mt-10 text-xl font-bold text-[#172033]">{title}</h3>
              <p className="mt-2 text-base leading-7 text-[#425066]">{description}</p>
              <span className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-[#173B63] group-hover:text-[#D97706]">
                进入服务
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#1E3A5F]">调研依据</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1F2937]">从真实行业问题出发</h2>
            <p className="mt-3 text-base leading-7 text-[#4B5563]">
              以下信息来自项目团队 2025 年企业调研，不代表平台实时经营数据。
            </p>
          </div>
          <div className="mt-8 grid divide-y divide-[#E5E7EB] border-y border-[#E5E7EB] md:grid-cols-3 md:divide-x md:divide-y-0">
            {PUBLIC_RESEARCH_FACTS.map((fact) => (
              <div key={fact.label} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <p className="text-4xl font-bold text-[#1E3A5F]">{fact.value}</p>
                <p className="mt-2 text-base font-semibold text-[#1F2937]">{fact.label}</p>
                <p className="mt-1 text-sm leading-6 text-[#6B7280]">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-[#1E3A5F]">核心服务</p>
        <h2 className="mt-2 text-3xl font-bold text-[#1F2937]">围绕印刷企业的协同需求</h2>
        <div className="mt-8 grid gap-px border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={href} className="group bg-white p-6 transition-colors hover:bg-[#FAFAF8]">
              <Icon className="size-7 text-[#1E3A5F] group-hover:text-[#D97706]" strokeWidth={1.8} aria-hidden />
              <h3 className="mt-5 text-lg font-bold text-[#1F2937]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4B5563]">{description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#1E3A5F]">了解详情 <ArrowRight className="size-4" aria-hidden /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#1E3A5F]">产业协同</p>
          <h2 className="mt-2 text-3xl font-bold text-[#1F2937]">覆盖印刷产业链关键环节</h2>
          <div className="mt-8 grid border-l border-t border-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-4">
            {chain.map(([name, detail], index) => (
              <details key={name} className="group border-b border-r border-[#E5E7EB] bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-[#1F2937] marker:hidden">
                  <span className="mr-3 text-sm text-[#8A9199]">{String(index + 1).padStart(2, '0')}</span>
                  {name}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{detail}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-sm font-semibold text-[#1E3A5F]">纸价信息</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1F2937]">价格数据按授权来源呈现</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#4B5563]">{PRICE_DATA_STATUS.detail}</p>
            <Link href="/prediction/铜版纸" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm border border-[#1E3A5F] px-4 text-sm font-semibold text-[#1E3A5F] hover:bg-[#EEF3F8]">
              查看数据接入说明
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <aside className="border border-[#B45309] bg-[#FFFBEB] p-6">
            <p className="text-sm font-semibold text-[#92400E]">数据状态</p>
            <p className="mt-3 text-xl font-bold text-[#1F2937]">{PRICE_DATA_STATUS.status}</p>
            <dl className="mt-5 space-y-3 text-sm text-[#4B5563]">
              <div><dt className="font-semibold text-[#1F2937]">拟接入来源</dt><dd className="mt-1">{PRICE_DATA_STATUS.source}</dd></div>
              <div><dt className="font-semibold text-[#1F2937]">更新原则</dt><dd className="mt-1">{PRICE_DATA_STATUS.updateFrequency}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#1E3A5F]">合作流程</p>
          <h2 className="mt-2 text-3xl font-bold text-[#1F2937]">从入驻到对接，路径清晰可见</h2>
          <ol className="mt-8 grid gap-4 lg:grid-cols-4">
            {process.map(([title, description, href, action], index) => (
              <li key={title} className="border-t-2 border-[#1E3A5F] pt-5">
                <p className="text-sm font-semibold text-[#8A9199]">步骤 {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-lg font-bold text-[#1F2937]">{title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#4B5563]">{description}</p>
                <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#1E3A5F] hover:text-[#D97706]">
                  {action}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#1E3A5F]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:flex lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#D6E5F0]">准备好开始协同了吗？</p>
            <h2 className="mt-2 text-3xl font-bold text-white">立即入驻，开启数字化升级</h2>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#D6E5F0]">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4" aria-hidden />SSL 加密</span>
              <span className="inline-flex items-center gap-2"><FileCheck2 className="size-4" aria-hidden />企业认证</span>
              <span className="inline-flex items-center gap-2"><Leaf className="size-4" aria-hidden />绿色生产支持</span>
            </div>
          </div>
          <Link href="/register" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#D97706] px-6 text-base font-semibold text-white hover:bg-[#B45309] lg:mt-0">
            免费入驻
            <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  )
}
