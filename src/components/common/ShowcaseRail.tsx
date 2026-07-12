import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SHOWCASE_ITEMS, type ShowcaseModule } from '@/lib/showcase-content'

export function ShowcaseRail({ module, title }: { module: ShowcaseModule; title: string }) {
  const items = SHOWCASE_ITEMS.filter((item) => item.module === module)
  return <section className="mt-8"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold text-cyan-300">图文信息台</p><h2 className="mt-1 text-xl font-bold text-white">{title}</h2></div><p className="text-xs text-slate-400">来源与采集时间已标注</p></div><div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-2">{items.map((item) => <article key={item.id} className="group w-72 shrink-0 snap-start overflow-hidden rounded-xl border border-white/15 bg-white/8 backdrop-blur-sm"><div className="relative aspect-[16/10]"><Image src={item.coverImage} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="288px" /></div><div className="p-4"><span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">{item.displayLabel}</span><h3 className="mt-3 font-semibold text-white">{item.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{item.summary}</p><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>{item.sourceName}</span><Link href={item.sourceUrl} className="inline-flex items-center gap-1 text-cyan-200 hover:text-white">查看 <ExternalLink className="size-3" /></Link></div><p className="mt-2 text-xs text-slate-500">采集于 {item.capturedAt}</p></div></article>)}</div></section>
}
