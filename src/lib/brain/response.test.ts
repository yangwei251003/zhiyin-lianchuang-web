import { describe, expect, it } from 'vitest'
import { createBrainResponse } from './response'

describe('智印大脑响应', () => {
  it('returns a confirmation-only draft with a successful assistant response', async () => {
    const result = await createBrainResponse(
      {
        message: '帮我整理需求信息',
        context: { kind: 'order', title: '宣传物料', draftFields: { category: '画册' } },
      },
      async () => '请先核对数量、工艺和交付地区。',
    )

    expect(result).toMatchObject({
      content: '请先核对数量、工艺和交付地区。',
      fallback: false,
      draft: { title: '需求草稿', status: 'needs_confirmation' },
    })
  })

  it('uses a compliant fallback when the model is unavailable', async () => {
    const result = await createBrainResponse(
      { message: '双胶纸价格会涨吗？', context: { kind: 'price', title: '纸价情报' } },
      async () => { throw new Error('unavailable') },
    )

    expect(result.fallback).toBe(true)
    expect(result.content).toContain('已核验的来源')
    expect(result.content).not.toContain('预测价格')
  })
})
