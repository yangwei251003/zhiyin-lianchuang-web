import { beforeEach, describe, expect, it, vi } from 'vitest'

const listBrainConversations = vi.hoisted(() => vi.fn())

vi.mock('@/lib/brain/server', () => ({
  BrainRequestError: class BrainRequestError extends Error {
    constructor(public status: number, message: string) { super(message) }
  },
  listBrainConversations,
}))

import { GET } from './route'

describe('GET /api/brain/conversations', () => {
  beforeEach(() => listBrainConversations.mockReset())

  it('returns only the current user conversation index', async () => {
    listBrainConversations.mockResolvedValue([
      { id: '00000000-0000-4000-8000-000000000001', title: '宣传物料', context_kind: 'order' },
    ])

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      conversations: [{ id: '00000000-0000-4000-8000-000000000001', title: '宣传物料', context_kind: 'order' }],
    })
  })
})
