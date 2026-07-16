import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { PersistedBrainContextKind } from '@/lib/brain/workspace'

export function BrainContextLauncher({
  context,
  label = '用智印大脑整理核对项',
  description,
}: {
  context: PersistedBrainContextKind
  label?: string
  description?: string
}) {
  return (
    <aside className="border-l-2 border-[#D97706] bg-[#FAFBFC] p-4 sm:p-5" aria-label="智印大脑场景助手">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-[#D97706]" strokeWidth={1.7} aria-hidden />
          <div>
            <p className="text-sm font-bold text-[#173B63]">智印大脑</p>
            <p className="mt-1 text-sm leading-6 text-[#526174]">
              {description ?? '先梳理当前页面已明确的信息与边界，再生成由你确认的下一步草稿。'}
            </p>
          </div>
        </div>
        <Link href={`/brain?context=${context}`} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#173B63] px-3 text-sm font-semibold text-[#173B63] transition hover:bg-[#EEF3F8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]">
          {label} <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </aside>
  )
}
