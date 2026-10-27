import { describe, expect, it } from 'vitest'
import { getDraftConfirmationTarget } from './draft-redirect'

describe('智印大脑草稿确认跳转', () => {
  it('returns an existing business form route without posting a record', () => {
    expect(getDraftConfirmationTarget('order', 'draft-1')).toBe('/orders/publish?brainDraft=draft-1')
    expect(getDraftConfirmationTarget('purchase', 'draft-1')).toBe('/purchase?brainDraft=draft-1')
  })

  it('keeps price and education drafts in their read-only assistance pages', () => {
    expect(getDraftConfirmationTarget('price', 'draft-1')).toBe('/prediction/%E7%99%BD%E5%8D%A1%E7%BA%B8?brainDraft=draft-1')
    expect(getDraftConfirmationTarget('education', 'draft-1')).toBe('/startup?brainDraft=draft-1')
  })
})
