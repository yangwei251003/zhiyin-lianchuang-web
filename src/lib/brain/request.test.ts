import { describe, expect, it } from 'vitest'
import { buildBrainPrompt, parseBrainRequest } from './request'

describe('智印大脑请求解析', () => {
  it('limits the user message and removes client supplied unverified price context', () => {
    const parsed = parseBrainRequest({
      message: '请帮我整理采购核对项',
      context: {
        kind: 'price',
        title: '双胶纸行情',
        evidence: [
          { label: '来源', value: '国家统计局', verified: true },
          { label: '参考价', value: '6200 元/吨', verified: false },
        ],
        draftFields: { paperType: '双胶纸', targetPrice: '6200' },
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.context.evidence).toHaveLength(1)
    expect(parsed.data.context.draftFields).toEqual({ paperType: '双胶纸' })
  })

  it('keeps the model prompt bounded to verified evidence and confirmation-only actions', () => {
    const prompt = buildBrainPrompt({
      kind: 'purchase',
      title: '纸张集采',
      evidence: [{ label: '活动状态', value: '公开活动', verified: true }],
      draftFields: { paperType: '双胶纸' },
    })

    expect(prompt).toContain('活动状态：公开活动')
    expect(prompt).toContain('用户确认')
    expect(prompt).toContain('不得编造市场价格')
  })
})
