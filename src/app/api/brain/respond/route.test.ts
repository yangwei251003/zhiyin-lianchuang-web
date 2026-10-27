import { beforeEach, describe, expect, it, vi } from 'vitest'

const runBrainRequest = vi.hoisted(() => vi.fn())

vi.mock('@/lib/brain/server', () => ({ runBrainRequest }))

import { POST } from './route'

describe('POST /api/brain/respond', () => {
  beforeEach(() => runBrainRequest.mockReset())

  it('rejects an incomplete request before calling the brain service', async () => {
    const response = await POST(new Request('http://localhost/api/brain/respond', {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
    }))

    expect(response.status).toBe(400)
    expect(runBrainRequest).not.toHaveBeenCalled()
  })

  it('returns the private conversation response without writing a business record', async () => {
    runBrainRequest.mockResolvedValue({
      conversationId: '00000000-0000-4000-8000-000000000001',
      content: '请先核对工艺与交付地区。',
      fallback: false,
      draft: null,
    })

    const response = await POST(new Request('http://localhost/api/brain/respond', {
      method: 'POST',
      body: JSON.stringify({
        message: '帮我整理需求',
        context: { kind: 'order', title: '宣传物料' },
      }),
    }))

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ content: '请先核对工艺与交付地区。' })
    expect(runBrainRequest).toHaveBeenCalledWith(expect.objectContaining({ message: '帮我整理需求' }))
  })
})
