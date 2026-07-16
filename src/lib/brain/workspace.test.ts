import { describe, expect, it } from 'vitest'
import { createBrainDraft } from './workspace'

describe('智印大脑草稿', () => {
  it('creates a confirmation-only purchase draft without price fields', () => {
    expect(
      createBrainDraft({
        kind: 'purchase',
        title: '双胶纸集采',
        evidence: [],
        draftFields: { paperType: '双胶纸', targetPrice: '6200' },
      }),
    ).toEqual({
      contextKind: 'purchase',
      title: '采购核对草稿',
      fields: { paperType: '双胶纸' },
      status: 'needs_confirmation',
    })
  })

  it('does not create a business draft for a general question', () => {
    expect(createBrainDraft({ kind: 'general', title: '工艺说明' })).toBeNull()
  })
})
