import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ShowcaseRail } from '@/components/common/ShowcaseRail'

export const metadata: Metadata = { title: '技术培训 · 智印联创', description: '查看带来源说明的印刷技术学习材料。' }

const paths = [['印前检查', '文件规范、色彩模式与出血检查'], ['设备认知', '走纸、供墨与安全操作要点'], ['质量控制', '色差、套印与成品检查流程']] as const

export default function TrainingPage() {
  return <main className="min-h-screen bg-[#061020] pb-12 text-white"><section className="relative overflow-hidden border-b border-cyan-300/20"><video className="absolute inset-0 h-full w-full object-cover opacity-30" autoPlay muted loop playsInline poster="/images/hero_bg.jpg"><source src="/videos/manroland.mp4" type="video/mp4" /></video><div className="absolute inset-0 bg-gradient-to-r from-[#061020] via-[#061020]/80 to-blue-950/40" /><Container className="relative py-14 sm:py-20"><nav className="text-xs text-slate-300" aria-label="面包屑"><Link href="/" className="hover:text-white">首页</Link><span className="mx-1.5">/</span><span>技术培训</span></nav><p className="mt-8 text-sm font-semibold text-cyan-200">印刷实训中心</p><h1 className="mt-2 text-3xl font-bold sm:text-5xl">从设备现场到生产流程</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">使用项目本地设备视频与带来源说明的学习资料，建立可复用的印刷工艺认知路径。</p><a href="#training-path" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 px-5 font-semibold shadow-[0_0_24px_rgba(34,211,238,.3)]">进入学习路径 <ArrowRight className="size-4" /></a></Container></section><Container id="training-path" className="mt-8"><div className="grid gap-4 md:grid-cols-3">{paths.map(([title, detail], index) => <article key={title} className="rounded-xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm"><span className="text-xs text-fuchsia-300">阶段 0{index + 1}</span><BookOpen className="mt-6 size-6 text-cyan-300" /><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p></article>)}</div><ShowcaseRail module="training" title="工艺现场与学习资料" /><section className="mt-8 flex gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-sm leading-6 text-cyan-50"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-cyan-300" /><p>本页视频和图文资料均标注来源。外部课程仅提供原始入口，不转载受版权保护的正文或视频。</p></section></Container></main>
}
