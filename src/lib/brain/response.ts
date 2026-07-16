import type { BrainResponseRequest } from './request'
import { createBrainDraft, type BrainDraftPayload } from './workspace'

export interface BrainResponse {
  content: string
  fallback: boolean
  draft: BrainDraftPayload | null
}

export type BrainCompletion = () => Promise<string>

function getCompliantFallback(kind: BrainResponseRequest['context']['kind']): string {
  if (kind === 'price') {
    return '纸价只应依据页面中已核验的来源、规格、地区和时间进行核对。请先确认纸种、用量和交付要求，再向符合条件的供应方获取正式报价。'
  }
  return '智能服务暂时不可用。你可以先核对当前页面已展示的需求、规格、来源或认证状态，并在原业务表单中确认下一步。'
}

export async function createBrainResponse(
  input: BrainResponseRequest,
  complete: BrainCompletion,
): Promise<BrainResponse> {
  const draft = createBrainDraft(input.context)
  try {
    const content = (await complete()).trim()
    if (!content) throw new Error('Empty model response')
    return { content, fallback: false, draft }
  } catch {
    return { content: getCompliantFallback(input.context.kind), fallback: true, draft }
  }
}
