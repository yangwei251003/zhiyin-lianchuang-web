import { beforeEach, describe, expect, it, vi } from 'vitest'

const confirmBrainDraft = vi.hoisted(() => vi.fn())

vi.mock('@/lib/brain/server', () => ({
  BrainRequestError: class BrainRequestError extends Error {
    constructor(public status: number, message: string) { super(message) }
  },
  confirmBrainDraft,
}))

import { POST } from './route'

describe('POST /api/brain/drafts/[id]/confirm', () => {
  beforeEach(() => confirmBrainDraft.mockReset())

  it('only returns the existing business form target after confirmation', async () => {
    const draftId = '00000000-0000-4000-8000-000000000001'
    confirmBrainDraft.mockResolvedValue({ id: draftId, contextKind: 'order' })

    const response = await POST(new Request(`http://localhost/api/brain/drafts/${draftId}/confirm`), {
      params: Promise.resolve({ id: draftId }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ target: `/orders/publish?brainDraft=${draftId}` })
    expect(confirmBrainDraft).toHaveBeenCalledWith(draftId)
  })
})
