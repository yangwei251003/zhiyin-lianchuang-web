import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SHOWCASE_ITEMS, type ShowcaseModule } from '@/lib/showcase-content'
import { createClient } from '@/lib/supabase/server'

export async function ShowcaseRail({ module, title }: { module: ShowcaseModule; title: string }) {
  const supabase = await createClient()
  const { data: snapshots } = await supabase.from('public_content_snapshots').select('*').eq('module', module).order('captured_at', { ascending: false }).limit(12)
  const items = snapshots?.length ? snapshots.map((item) => ({ id: item.id, displayLabel: item.display_label, title: item.title, summary: item.summary, coverImage: item.cover_image || '/images/external/press-detail.jpg', sourceName: item.source_name, sourceUrl: item.source_url.startsWith('http') || item.source_url.startsWith('/') ? item.source_url : '/sources', capturedAt: item.captured_at.slice(0, 10) })) : SHOWCASE_ITEMS.filter((item) => item.module === module)
  if (!items.length) return null
  return <section className="mt-10 border-t border-[#bfc6ce] pt-8"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#c84f20]">Source-labelled references</p><h2 className="mt-2 text-2xl font-bold text-[#14263d]">{title}</h2></div><p className="text-xs text-[#66717d]">演示、来源与采集时间均明确标注</p></div><div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3">{items.map((item) => <article key={item.id} className="group w-72 shrink-0 snap-start border border-[#cbd1d7] bg-white"><div className="relative aspect-[16/10] overflow-hidden"><Image src={item.coverImage} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="288px" /></div><div className="p-4"><span className="border-l-2 border-[#c84f20] pl-2 text-xs font-semibold text-[#7a3b23]">{item.displayLabel}</span><h3 className="mt-3 font-semibold text-[#14263d]">{item.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5c6672]">{item.summary}</p><div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#707b86]"><span className="truncate">{item.sourceName}</span><Link href={item.sourceUrl} className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#14263d]">查看 <ExternalLink className="size-3" /></Link></div><p className="mt-2 text-xs text-[#8a939d]">记录于 {item.capturedAt}</p></div></article>)}</div></section>
}
