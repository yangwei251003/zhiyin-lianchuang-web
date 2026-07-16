import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Calculator, ClipboardCheck, GraduationCap, MessagesSquare, Users } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { BrainContextLauncher } from '@/components/brain/BrainContextLauncher'
import { PUBLIC_MENTORS, PUBLIC_PARTNERS, PUBLIC_RESEARCH_FACTS } from '@/lib/public-content'

export const metadata: Metadata = { title: '产教实践中心 · 智印联创', description: '围绕真实印刷产业问题开展学习、实训、导师辅导与项目验证。' }

const modules = [
  { icon: BookOpen, index: '01', title: '行业学习资源', desc: '经来源与内容审核后公开的印刷经营、工艺与协同材料。', href: '/startup/articles' },
  { icon: Users, index: '02', title: '产业导师辅导', desc: '连接校内专业导师与企业产业导师，围绕具体问题开展辅导。', href: '/startup/mentors' },
  { icon: Calculator, index: '03', title: '实践测算工具', desc: '用自填参数核对损耗、物料和筹备成本，不承诺经营结果。', href: '/startup/calculator' },
  { icon: MessagesSquare, index: '04', title: '实践项目申请', desc: '提交课题、实训需求或企业问题，由平台按流程联系确认。', href: '/feedback' },
]

export default function PracticeCenterPage() {
  return <main className="bg-[#f4f2ec] pb-20">
    <section className="relative min-h-[560px] overflow-hidden bg-[#14263d] text-white">
      <Image src="/images/external/press-tools.jpg" alt="师生与产业导师在印刷设备旁开展实践" fill priority sizes="100vw" className="object-cover object-center opacity-55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,38,61,.98)_0%,rgba(20,38,61,.86)_48%,rgba(20,38,61,.25)_100%)]" />
      <Container className="relative flex min-h-[560px] items-end py-12 sm:items-center sm:py-20">
        <Reveal className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f29a70]">Industry × Education</p><h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">把产业真问题<br />带进实践现场</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">产教实践中心围绕需求拆解、工艺判断、报价协同、原料采购和项目复盘组织学习与实训。这里提供方法与连接，不包装未经核验的创业成绩。</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/startup/articles" className="inline-flex min-h-12 items-center gap-2 bg-[#c84f20] px-5 text-sm font-bold text-white hover:bg-[#a93e18]">进入学习资源 <ArrowRight className="h-4 w-4" /></Link><Link href="/feedback" className="inline-flex min-h-12 items-center gap-2 border border-white/60 px-5 text-sm font-bold text-white hover:bg-white hover:text-[#14263d]">提交实践课题</Link></div></Reveal>
      </Container>
    </section>

    <Container className="py-14 sm:py-20">
      <BrainContextLauncher context="education" label="拆解实践任务" description="从需求、生产和采购的真实约束出发，形成可复核的实践任务草稿。" />
      <Reveal><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c84f20]">Practice modules</p><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><h2 className="text-3xl font-bold text-[#14263d] sm:text-4xl">从学习到真实问题验证</h2><p className="max-w-md text-sm leading-6 text-[#5c6672]">每个模块都以可交付成果为终点：需求单、工艺清单、测算表、复盘记录。</p></div></Reveal>
      <div className="mt-9 grid gap-px overflow-hidden border border-[#cbd1d7] bg-[#cbd1d7] sm:grid-cols-2 lg:grid-cols-4">{modules.map((module, i) => { const Icon = module.icon; return <Reveal key={module.title} delay={i * .05} className="bg-white p-6"><span className="font-mono text-xs font-bold text-[#c84f20]">{module.index}</span><Icon className="mt-8 h-7 w-7 text-[#14263d]" strokeWidth={1.6} /><h3 className="mt-5 text-lg font-bold text-[#14263d]">{module.title}</h3><p className="mt-3 min-h-24 text-sm leading-6 text-[#5c6672]">{module.desc}</p><Link href={module.href} className="inline-flex items-center gap-1 text-sm font-bold text-[#c84f20]">进入模块 <ArrowRight className="h-4 w-4" /></Link></Reveal> })}</div>
    </Container>

    <section className="border-y border-[#cbd1d7] bg-white"><Container className="grid gap-10 py-14 lg:grid-cols-[.8fr_1.2fr] lg:py-20"><Reveal><GraduationCap className="h-9 w-9 text-[#c84f20]" /><h2 className="mt-5 text-3xl font-bold text-[#14263d]">一条可复盘的实践路径</h2><p className="mt-4 text-sm leading-7 text-[#5c6672]">不是展示“成功神话”，而是把每一步依据、判断和输出留存下来，让学生、导师和企业共同复核。</p></Reveal><ol className="grid gap-4 sm:grid-cols-2">{['提出真实产业问题','完成需求与工艺拆解','导师和企业联合辅导','形成成果并复盘归档'].map((step, i) => <Reveal key={step} delay={i * .05} className="border-t-2 border-[#14263d] px-1 py-5"><span className="font-mono text-xs text-[#c84f20]">0{i + 1}</span><h3 className="mt-3 font-bold text-[#14263d]">{step}</h3><p className="mt-2 text-sm text-[#5c6672]">{i === 0 ? '明确对象、场景、限制与验收方式。' : i === 1 ? '形成可执行清单和测算依据。' : i === 2 ? '记录修改意见与关键决策。' : '保留过程材料，不虚构经营结果。'}</p></Reveal>)}</ol></Container></section>

    <Container className="grid gap-10 py-14 lg:grid-cols-2 lg:py-20"><section><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c84f20]">Confirmed mentors</p><h2 className="mt-3 text-2xl font-bold text-[#14263d]">已确认导师</h2><p className="mt-2 text-sm text-[#5c6672]">信息来自项目商业计划书，具体辅导安排以平台确认通知为准。</p><div className="mt-6 grid gap-3">{PUBLIC_MENTORS.map((mentor) => <div key={mentor.name} className="grid grid-cols-[48px_1fr] gap-4 border border-[#cbd1d7] bg-white p-5"><span className="flex h-12 w-12 items-center justify-center bg-[#14263d] text-lg font-bold text-white">{mentor.name[0]}</span><div><h3 className="font-bold text-[#14263d]">{mentor.name}</h3><p className="mt-1 text-sm text-[#c84f20]">{mentor.title}</p><p className="mt-2 text-sm text-[#5c6672]">{mentor.expertise}</p></div></div>)}</div></section><section><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c84f20]">Evidence base</p><h2 className="mt-3 text-2xl font-bold text-[#14263d]">实践选题依据</h2><p className="mt-2 text-sm text-[#5c6672]">以下仅为 2025 年团队调研样本结果，不代表平台运营成绩。</p><dl className="mt-6 border-y border-[#cbd1d7]">{PUBLIC_RESEARCH_FACTS.map((fact) => <div key={fact.label} className="grid grid-cols-[90px_1fr] gap-4 border-b border-[#cbd1d7] py-5 last:border-0"><dt className="text-2xl font-black text-[#c84f20]">{fact.value}</dt><dd><strong className="block text-[#14263d]">{fact.label}</strong><span className="mt-1 block text-sm text-[#5c6672]">{fact.detail}</span></dd></div>)}</dl><div className="mt-6"><p className="text-sm font-bold text-[#14263d]">项目合作单位（商业计划书载明）</p><ul className="mt-3 space-y-2 text-sm text-[#5c6672]">{PUBLIC_PARTNERS.map((partner) => <li key={partner} className="flex gap-2"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c84f20]" />{partner}</li>)}</ul></div></section></Container>
  </main>
}
