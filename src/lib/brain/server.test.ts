import { beforeEach, describe, expect, it, vi } from 'vitest'

const createClient = vi.hoisted(() => vi.fn())
const zhipuChatCompletion = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/server', () => ({ createClient }))
vi.mock('@/lib/ai/zhipu', () => ({ zhipuChatCompletion }))

import { runBrainRequest } from './server'

describe('智印大脑私有会话', () => {
  beforeEach(() => {
    createClient.mockReset()
    zhipuChatCompletion.mockReset()
  })

  it('writes a snapshot for every row in a bulk message insert', async () => {
    const insertMessages = vi.fn().mockResolvedValue({ error: null })
    const insertConversation = vi.fn(() => ({
      select: () => ({
        single: vi.fn().mockResolvedValue({
          data: { id: '00000000-0000-4000-8000-000000000001' },
          error: null,
        }),
      }),
    }))
    const updateConversation = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }))

    createClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '00000000-0000-4000-8000-000000000002' } } }) },
      from: vi.fn((table: string) => {
        if (table === 'brain_conversations') return { insert: insertConversation, update: updateConversation }
        if (table === 'brain_messages') return { insert: insertMessages }
        throw new Error(`Unexpected table: ${table}`)
      }),
    })
    zhipuChatCompletion.mockResolvedValue({ content: '请先核对工艺与交付地区。' })

    await runBrainRequest({
      message: '帮我整理需求',
      context: { kind: 'general', title: '协同总览', evidence: [] },
    })

    expect(insertMessages).toHaveBeenCalledWith([
      expect.objectContaining({ role: 'user', source_snapshot: [] }),
      expect.objectContaining({ role: 'assistant', source_snapshot: [] }),
    ])
  })

  it('returns the generated result as a temporary session when message persistence fails', async () => {
    const deleteConversation = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }))
    const insertConversation = vi.fn(() => ({
      select: () => ({
        single: vi.fn().mockResolvedValue({
          data: { id: '00000000-0000-4000-8000-000000000003' },
          error: null,
        }),
      }),
    }))

    createClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '00000000-0000-4000-8000-000000000004' } } }) },
      from: vi.fn((table: string) => {
        if (table === 'brain_conversations') return {
          insert: insertConversation,
          update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
          delete: deleteConversation,
        }
        if (table === 'brain_messages') return { insert: vi.fn().mockResolvedValue({ error: { message: 'constraint error' } }) }
        throw new Error(`Unexpected table: ${table}`)
      }),
    })
    zhipuChatCompletion.mockResolvedValue({ content: '请先确认规格、数量和交付地区。' })

    await expect(runBrainRequest({
      message: '帮我整理需求',
      context: { kind: 'general', title: '协同总览', evidence: [] },
    })).resolves.toMatchObject({
      conversationId: null,
      content: '请先确认规格、数量和交付地区。',
    })
    expect(deleteConversation).toHaveBeenCalled()
  })
})
