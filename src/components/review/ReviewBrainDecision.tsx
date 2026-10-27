import { Bot, ShieldCheck } from 'lucide-react'
import { createDeterministicReviewDecision, type ReviewBrainRole } from '@/lib/brain/scenario'

export function ReviewBrainDecision({ role }: { role: ReviewBrainRole }) {
  const result = createDeterministicReviewDecision(role)

  return (
    <section className="mt-7 border-l-2 border-[#173B63] bg-white p-4" aria-label="智印大脑评审决策">
      <div className="flex items-center gap-2 text-sm font-bold text-[#173B63]">
        <Bot className="size-4" aria-hidden /> 智印大脑
      </div>
      <p className="mt-2 text-xs font-semibold text-[#B45309]">稳定演示 · 不调用模型、不写入真实业务</p>
      <h3 className="mt-3 text-sm font-bold text-[#172033]">{result.decision.title}</h3>
      <p className="mt-2 text-xs leading-5 text-[#526174]">{result.decision.summary}</p>
      <ul className="mt-4 space-y-2 border-t border-[#D9DEE6] pt-3 text-xs leading-5 text-[#526174]">
        {result.sources.map((source) => (
          <li key={source.label} className="flex gap-2">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#047857]" aria-hidden />
            <span><strong className="font-semibold text-[#173B63]">{source.label}</strong>：{source.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
