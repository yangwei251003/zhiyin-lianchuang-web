'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function SupplyOfferForm({ purchaseId, existing }: { purchaseId: string; existing?: { unit_price: number; minimum_quantity: number; delivery_days: number; note: string; status: string } | null }) {
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/business/supply-offers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        purchaseId,
        unitPrice: Number(form.get('unitPrice')),
        minimumQuantity: Number(form.get('minimumQuantity')),
        deliveryDays: Number(form.get('deliveryDays')),
        note: String(form.get('note') ?? ''),
      }),
    })
    const result = await response.json()
    setSaving(false)
    setMessage(response.ok ? '供货方案已进入平台审核，未被自动公开。' : result.error)
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-line pt-4">
      <div>
        <p className="text-sm font-semibold text-ink-primary">原料供应商供货方案</p>
        <p className="mt-1 text-xs leading-5 text-ink-tertiary">仅认证原料供应商可提交。方案先进入待审区，不代表平台采纳或背书。</p>
      </div>
      <Input name="unitPrice" type="number" min="0.01" step="0.01" required label="含税单价（元）" defaultValue={existing?.unit_price} />
      <div className="grid grid-cols-2 gap-3">
        <Input name="minimumQuantity" type="number" min="1" step="1" required label="起订量" defaultValue={existing?.minimum_quantity} />
        <Input name="deliveryDays" type="number" min="1" step="1" required label="交期（天）" defaultValue={existing?.delivery_days} />
      </div>
      <label className="block text-sm font-medium text-ink-primary">供货说明
        <textarea name="note" maxLength={500} defaultValue={existing?.note} className="mt-1.5 min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </label>
      {existing && <p className="text-xs text-ink-tertiary">当前状态：{existing.status}</p>}
      {message && <p role="status" className="text-sm text-ink-secondary">{message}</p>}
      <Button type="submit" loading={saving} disabled={saving} className="w-full">保存供货方案</Button>
    </form>
  )
}
