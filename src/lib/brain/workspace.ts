import { sanitizeBrainContext, type BrainContextInput } from './scenario'

export type PersistedBrainContextKind = 'order' | 'purchase' | 'price' | 'education'

export interface BrainDraftPayload {
  contextKind: PersistedBrainContextKind
  title: string
  fields: Record<string, string>
  status: 'needs_confirmation'
}

const DRAFT_TITLES: Record<PersistedBrainContextKind, string> = {
  order: '需求草稿',
  purchase: '采购核对草稿',
  price: '纸价采购核对单',
  education: '产教实践任务草稿',
}

export function createBrainDraft(input: BrainContextInput): BrainDraftPayload | null {
  const context = sanitizeBrainContext(input)
  if (context.kind === 'general' || context.kind === 'review') return null

  return {
    contextKind: context.kind,
    title: DRAFT_TITLES[context.kind],
    fields: context.draftFields ?? {},
    status: 'needs_confirmation',
  }
}
