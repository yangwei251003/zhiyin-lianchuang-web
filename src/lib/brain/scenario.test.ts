import { describe, expect, it } from 'vitest'
import {
  createDeterministicReviewDecision,
  sanitizeBrainContext,
} from './scenario'

describe('智印大脑场景边界', () => {
  it('removes unverified price-like data from model context', () => {
    expect(
      sanitizeBrainContext({
        kind: 'price',
        title: '双胶纸情报',
        evidence: [
          { label: '来源', value: '国家统计局', verified: true },
          { label: '价格', value: '6200 元/吨', verified: false },
        ],
        draftFields: { paperType: '双胶纸', targetPrice: '6200' },
      }),
    ).toEqual({
      kind: 'price',
      title: '双胶纸情报',
      evidence: [{ label: '来源', value: '国家统计局', verified: true }],
      draftFields: { paperType: '双胶纸' },
    })
  })

  it('returns a fixed review decision without a market prediction', () => {
    const result = createDeterministicReviewDecision('printer')

    expect(result.mode).toBe('review')
    expect(result.decision.title).toContain('报价')
    expect(result.sources).toHaveLength(2)
    expect(result.response).not.toMatch(/预测|建议价格|实时行情/)
    expect(result.draft.status).toBe('needs_confirmation')
  })
})
