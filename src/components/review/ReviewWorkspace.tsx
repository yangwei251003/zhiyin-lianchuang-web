'use client'

import { useReducer } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { REVIEW_ROLES } from '@/lib/review/review-content'
import { createInitialReviewScenario, reviewScenarioReducer } from '@/lib/review/scenario'
import { ReviewRolePanel } from './ReviewRolePanel'

export function ReviewWorkspace() {
  const [state, dispatch] = useReducer(reviewScenarioReducer, undefined, createInitialReviewScenario)

  return (
    <div className="min-h-[100dvh] bg-[#F6F7F8] pb-16">
      <header className="border-b border-[#D9DEE6] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[#B45309]">智印联创评审演示</p>
            <h1 className="mt-2 text-3xl font-bold text-[#172033]">一条需求，三种产业角色</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526174]">
              依次体验需求发布、印刷报价和原料供货。页面中的金额与数量均为演示内容。
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'reset' })}
            className="inline-flex min-h-11 w-fit items-center gap-2 border border-[#173B63] px-4 text-sm font-semibold text-[#173B63] transition hover:bg-[#EEF3F8] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
          >
            <RotateCcw className="size-4" aria-hidden />
            重置演示
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <nav className="grid gap-px border border-[#D9DEE6] bg-[#D9DEE6] sm:grid-cols-3" aria-label="演示角色">
          {REVIEW_ROLES.map((role) => {
            const active = state.activeRole === role.id
            const complete = state.completedActions.includes(role.action)
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => dispatch({ type: 'switch_role', role: role.id })}
                aria-current={active ? 'step' : undefined}
                className={`min-h-16 bg-white px-4 py-3 text-left transition duration-200 ease-out focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#D97706] ${active ? 'text-[#173B63] shadow-[inset_0_-3px_0_#D97706]' : 'text-[#526174] hover:bg-[#FAFBFC]'}`}
              >
                <span className="block text-sm font-bold">{role.title}</span>
                <span className="mt-1 block text-xs">{complete ? '已完成' : '待体验'}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              data-motion-safe
              key={state.activeRole}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <ReviewRolePanel
                role={state.activeRole}
                completedActions={state.completedActions}
                onComplete={(action) => dispatch({ type: 'complete_action', action })}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
