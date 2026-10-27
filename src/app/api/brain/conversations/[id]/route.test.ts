import { beforeEach, describe, expect, it, vi } from 'vitest'

const getBrainConversation = vi.hoisted(() => vi.fn())

vi.mock('@/lib/brain/server', () => ({
  BrainRequestError: class BrainRequestError extends Error {
    constructor(public status: number, message: string) { super(message) }
  },
  getBrainConversation,
}))

import { GET } from './route'

describe('GET /api/brain/conversations/[id]', () => {
  beforeEach(() => getBrainConversation.mockReset())

  it('returns the current user private conversation and drafts', async () => {
    const id = '00000000-0000-4000-8000-000000000001'
    getBrainConversation.mockResolvedValue({ conversation: { id }, messages: [], drafts: [] })

    const response = await GET(new Request(`http://localhost/api/brain/conversations/${id}`), {
      params: Promise.resolve({ id }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ conversation: { id }, messages: [], drafts: [] })
  })
})
