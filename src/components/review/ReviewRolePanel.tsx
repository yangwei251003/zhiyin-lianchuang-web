'use client'

import { Check, Factory, FileText, PackageCheck } from 'lucide-react'
import { REVIEW_ROLES, REVIEW_STORY } from '@/lib/review/review-content'
import type { BusinessRole, ReviewAction } from '@/lib/review/scenario'

interface ReviewRolePanelProps {
  role: BusinessRole
  completedActions: ReviewAction[]
  onComplete: (action: ReviewAction) => void
}

const ROLE_ICON = {
  requester: FileText,
  printer: Factory,
  material_supplier: PackageCheck,
} as const

export function ReviewRolePanel({
  role,
  completedActions,
  onComplete,
}: ReviewRolePanelProps) {
  const definition = REVIEW_ROLES.find((item) => item.id === role) ?? REVIEW_ROLES[0]
  const Icon = ROLE_ICON[role]
  const completed = completedActions.includes(definition.action)

  return (
    <section className="border border-[#D9DEE6] bg-white" aria-labelledby={`review-${role}`}>
      <header className="flex flex-col gap-5 border-b border-[#D9DEE6] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center bg-[#EEF3F8] text-[#173B63]">
            <Icon className="size-5" strokeWidth={1.7} aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#B45309]">演示场景，不计入真实业务</p>
            <h2 id={`review-${role}`} className="mt-1 text-2xl font-bold text-[#172033]">
              {definition.title}工作台
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526174]">
              {definition.description}
            </p>
          </div>
        </div>
        <span className="w-fit border border-[#D97706] px-3 py-1.5 text-xs font-semibold text-[#92400E]">
          演示场景
        </span>
      </header>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[#D9DEE6]">
          <h3 className="text-lg font-bold text-[#172033]">{REVIEW_STORY.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#526174]">{REVIEW_STORY.summary}</p>

          {role === 'requester' && (
            <div className="mt-6 grid gap-5 sm:grid-cols-[minmax(0,1fr)_220px]">
              <ul className="space-y-3 text-sm leading-6 text-[#344258]">
                {REVIEW_STORY.requirement.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-[#047857]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <dl className="space-y-3 bg-[#F6F7F8] p-4 text-sm">
                <div><dt className="text-[#6B7280]">交付地区</dt><dd className="mt-1 font-semibold text-[#172033]">{REVIEW_STORY.requirement.location}</dd></div>
                <div><dt className="text-[#6B7280]">交付周期</dt><dd className="mt-1 font-semibold text-[#172033]">{REVIEW_STORY.requirement.deliveryWindow}</dd></div>
                <div><dt className="text-[#6B7280]">预算</dt><dd className="mt-1 font-semibold text-[#172033]">{REVIEW_STORY.requirement.budget}</dd></div>
              </dl>
            </div>
          )}

          {role === 'printer' && (
            <dl className="mt-6 grid gap-5 bg-[#F6F7F8] p-5 sm:grid-cols-3">
              <div><dt className="text-xs text-[#6B7280]">报价</dt><dd className="mt-2 font-bold text-[#172033]">{REVIEW_STORY.printerOffer.price}</dd></div>
              <div><dt className="text-xs text-[#6B7280]">交付</dt><dd className="mt-2 font-bold text-[#172033]">{REVIEW_STORY.printerOffer.delivery}</dd></div>
              <div><dt className="text-xs text-[#6B7280]">排产说明</dt><dd className="mt-2 text-sm leading-6 text-[#344258]">{REVIEW_STORY.printerOffer.note}</dd></div>
            </dl>
          )}

          {role === 'material_supplier' && (
            <dl className="mt-6 grid gap-5 bg-[#F6F7F8] p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div><dt className="text-xs text-[#6B7280]">纸张</dt><dd className="mt-2 font-bold text-[#172033]">{REVIEW_STORY.supplyOffer.material}</dd></div>
              <div><dt className="text-xs text-[#6B7280]">参考价</dt><dd className="mt-2 font-bold text-[#172033]">{REVIEW_STORY.supplyOffer.price}</dd></div>
              <div><dt className="text-xs text-[#6B7280]">起供</dt><dd className="mt-2 font-bold text-[#172033]">{REVIEW_STORY.supplyOffer.minimum}</dd></div>
              <div><dt className="text-xs text-[#6B7280]">交付</dt><dd className="mt-2 font-bold text-[#172033]">{REVIEW_STORY.supplyOffer.delivery}</dd></div>
            </dl>
          )}
        </div>

        <aside className="border-t border-[#D9DEE6] bg-[#FAFBFC] p-5 sm:p-7 lg:border-t-0">
          <p className="text-sm font-semibold text-[#173B63]">当前任务</p>
          <p className="mt-3 text-sm leading-6 text-[#526174]">
            完成后会自动切换到下一角色，展示同一业务在产业链中的传递。
          </p>
          {completed ? (
            <div className="mt-6 flex items-center gap-3 border border-[#86B8A5] bg-[#F0FDF7] p-4 text-sm font-semibold text-[#046C4E]" role="status">
              <Check className="size-5" aria-hidden />
              本角色任务已完成
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(definition.action)}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center bg-[#D97706] px-4 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-[#B45309] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173B63]"
            >
              {definition.actionLabel}
            </button>
          )}
        </aside>
      </div>
    </section>
  )
}
