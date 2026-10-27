'use client'

import { FormEvent, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, KeyRound } from 'lucide-react'

const subscribeToHydration = () => () => undefined
const getClientHydrationSnapshot = () => true
const getServerHydrationSnapshot = () => false

export function ReviewAccessForm() {
  const router = useRouter()
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  )
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/review/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(result.error ?? '暂时无法进入评审演示。')
        return
      }
      router.push('/review/workspace')
      router.refresh()
    } catch {
      setError('网络连接失败，请稍后重试。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="review-code" className="block text-sm font-semibold text-[#172033]">
          评审码
        </label>
        <div className="relative mt-2">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#6B7280]" aria-hidden />
          <input
            id="review-code"
            name="review-code"
            type="password"
            autoComplete="off"
            disabled={!hydrated}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-h-12 w-full border border-[#B8C0CC] bg-white py-3 pl-11 pr-3 text-base text-[#172033] outline-none transition focus:border-[#173B63] focus:ring-2 focus:ring-[#173B63]/15"
            placeholder="请输入赛事提供的评审码"
            aria-describedby={error ? 'review-code-error' : 'review-code-help'}
          />
        </div>
        <p id="review-code-help" className="mt-2 text-xs leading-5 text-[#6B7280]">
          评审演示与真实业务数据隔离，操作不会产生真实订单或报价。
        </p>
        {error && <p id="review-code-error" className="mt-2 text-sm text-[#B42318]" role="alert">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={!hydrated || submitting || !code.trim()}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#D97706] px-5 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-[#B45309] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#C8CDD5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173B63]"
      >
        {submitting ? '正在验证' : '进入评审演示'}
        {!submitting && <ArrowRight className="size-4" aria-hidden />}
      </button>
    </form>
  )
}
