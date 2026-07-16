import 'server-only'

import { zhipuChatCompletion } from '@/lib/ai/zhipu'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'
import { buildBrainPrompt, type BrainResponseRequest } from './request'
import { createBrainResponse } from './response'

export class BrainRequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

export interface BrainServiceResult {
  conversationId: string | null
  content: string
  fallback: boolean
  draft: { id: string; title: string; status: 'needs_confirmation'; fields: Json } | null
}

function toEvidenceSnapshot(input: BrainResponseRequest): Json {
  return (input.context.evidence ?? []).map((item) =>
    item.sourceUrl
      ? { label: item.label, value: item.value, verified: item.verified, sourceUrl: item.sourceUrl }
      : { label: item.label, value: item.value, verified: item.verified },
  )
}

export async function runBrainRequest(input: BrainResponseRequest): Promise<BrainServiceResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let conversationId: string | null = null

  if (user) {
    if (input.conversationId) {
      const { data: conversation } = await supabase
        .from('brain_conversations')
        .select('id')
        .eq('id', input.conversationId)
        .maybeSingle()
      if (!conversation) throw new BrainRequestError(404, '未找到属于当前账号的智印大脑会话。')
      conversationId = conversation.id
    } else {
      const { data: conversation, error } = await supabase
        .from('brain_conversations')
        .insert({ user_id: user.id, context_kind: input.context.kind, title: input.context.title })
        .select('id')
        .single()
      if (error || !conversation) throw new BrainRequestError(500, '智印大脑会话创建失败。')
      conversationId = conversation.id
    }
  }

  const response = await createBrainResponse(input, async () => {
    const completion = await zhipuChatCompletion({
      messages: [
        { role: 'system', content: buildBrainPrompt(input.context) },
        { role: 'user', content: input.message },
      ],
      temperature: 0.35,
      maxTokens: 700,
    })
    return completion.content
  })

  if (!user || !conversationId) {
    return { conversationId: null, content: response.content, fallback: response.fallback, draft: null }
  }

  const evidence = toEvidenceSnapshot(input)
  const { error: messageError } = await supabase.from('brain_messages').insert([
    { conversation_id: conversationId, user_id: user.id, role: 'user', content: input.message },
    { conversation_id: conversationId, user_id: user.id, role: 'assistant', content: response.content, source_snapshot: evidence },
  ])
  if (messageError) throw new BrainRequestError(500, '智印大脑消息保存失败。')

  await supabase
    .from('brain_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  if (!response.draft) {
    return { conversationId, content: response.content, fallback: response.fallback, draft: null }
  }

  const { data: draft, error: draftError } = await supabase
    .from('brain_drafts')
    .insert({
      user_id: user.id,
      conversation_id: conversationId,
      context_kind: response.draft.contextKind,
      title: response.draft.title,
      fields: response.draft.fields,
      status: response.draft.status,
    })
    .select('id, title, status, fields')
    .single()
  if (draftError || !draft) throw new BrainRequestError(500, '智印大脑草稿保存失败。')

  return {
    conversationId,
    content: response.content,
    fallback: response.fallback,
    draft: {
      id: draft.id,
      title: draft.title,
      status: 'needs_confirmation',
      fields: draft.fields,
    },
  }
}

export async function confirmBrainDraft(id: string): Promise<{
  id: string
  contextKind: 'order' | 'purchase' | 'price' | 'education'
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new BrainRequestError(401, '请先登录后确认智印大脑草稿。')

  const { data: draft, error } = await supabase
    .from('brain_drafts')
    .update({ status: 'confirmed' })
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('status', 'needs_confirmation')
    .select('id, context_kind')
    .maybeSingle()
  if (error || !draft) throw new BrainRequestError(404, '未找到可确认的智印大脑草稿。')

  return { id: draft.id, contextKind: draft.context_kind }
}

export async function listBrainConversations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new BrainRequestError(401, '请先登录后查看智印大脑历史。')

  const { data, error } = await supabase
    .from('brain_conversations')
    .select('id, title, context_kind, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(30)
  if (error) throw new BrainRequestError(500, '智印大脑历史读取失败。')
  return data ?? []
}

export async function getBrainConversation(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new BrainRequestError(401, '请先登录后查看智印大脑历史。')

  const { data: conversation, error: conversationError } = await supabase
    .from('brain_conversations')
    .select('id, title, context_kind, created_at, updated_at')
    .eq('id', id)
    .maybeSingle()
  if (conversationError) throw new BrainRequestError(500, '智印大脑会话读取失败。')
  if (!conversation) throw new BrainRequestError(404, '未找到属于当前账号的智印大脑会话。')

  const [{ data: messages, error: messagesError }, { data: drafts, error: draftsError }] = await Promise.all([
    supabase.from('brain_messages').select('id, role, content, source_snapshot, created_at').eq('conversation_id', id).order('created_at', { ascending: true }),
    supabase.from('brain_drafts').select('id, title, context_kind, fields, status, created_at').eq('conversation_id', id).order('created_at', { ascending: false }),
  ])
  if (messagesError || draftsError) throw new BrainRequestError(500, '智印大脑会话内容读取失败。')

  return { conversation, messages: messages ?? [], drafts: drafts ?? [] }
}
