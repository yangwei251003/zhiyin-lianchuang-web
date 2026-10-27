'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function BidReviewActions({ bidId }: { bidId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  async function review(status: 'accepted' | 'rejected') {
    setSaving(true); setError('')
    const response = await fetch(`/api/business/bids/${bidId}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) })
    const result = await response.json()
    setSaving(false)
    if (!response.ok) { setError(result.error); return }
    router.refresh()
  }
  return <div className="mt-3"><div className="flex gap-2"><button type="button" disabled={saving} onClick={() => review('accepted')} className="bg-[#14263d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">采纳报价</button><button type="button" disabled={saving} onClick={() => review('rejected')} className="border border-line px-3 py-2 text-xs font-semibold text-ink-secondary disabled:opacity-50">拒绝</button></div>{error && <p className="mt-2 text-xs text-danger" role="alert">{error}</p>}</div>
}
