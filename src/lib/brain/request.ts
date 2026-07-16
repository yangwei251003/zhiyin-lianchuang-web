import { z } from 'zod'
import {
  sanitizeBrainContext,
  type BrainContextInput,
  type BrainContextKind,
} from './scenario'

const modelContextKinds = ['general', 'order', 'purchase', 'price', 'education'] as const

const evidenceSchema = z.object({
  label: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(180),
  verified: z.boolean(),
  sourceUrl: z.string().url().max(1000).optional(),
})

const contextSchema = z.object({
  kind: z.enum(modelContextKinds),
  title: z.string().trim().min(1).max(120),
  evidence: z.array(evidenceSchema).max(6).optional(),
  draftFields: z.record(z.string().max(40), z.string().trim().max(180)).superRefine((value, ctx) => {
    if (Object.keys(value).length > 12) {
      ctx.addIssue({ code: 'custom', message: '草稿字段过多' })
    }
  }).optional(),
})

const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  context: contextSchema,
  conversationId: z.string().uuid().optional(),
}).strip()

export type BrainResponseRequest = {
  message: string
  context: BrainContextInput & { kind: Exclude<BrainContextKind, 'review'> }
  conversationId?: string
}

export function parseBrainRequest(input: unknown):
  | { success: true; data: BrainResponseRequest }
  | { success: false } {
  const parsed = requestSchema.safeParse(input)
  if (!parsed.success) return { success: false }

  return {
    success: true,
    data: {
      message: parsed.data.message,
      context: sanitizeBrainContext(parsed.data.context) as BrainResponseRequest['context'],
      conversationId: parsed.data.conversationId,
    },
  }
}

export function buildBrainPrompt(context: BrainContextInput): string {
  const safe = sanitizeBrainContext(context)
  const evidence = safe.evidence?.length
    ? safe.evidence.map((item) => `${item.label}：${item.value}`).join('\n')
    : '暂无可引用的公开证据。'
  const fields = Object.entries(safe.draftFields ?? {})
    .map(([key, value]) => `${key}：${value}`)
    .join('\n') || '暂无草稿字段。'

  return [
    '你是“智印大脑”，负责帮助印刷产业协同中的信息整理与决策准备。回复使用中文，简洁、可核对。',
    '不得编造市场价格、未来数值预测、交期、企业资质、合作记录或经营成绩。不得替用户发布需求、报价、供货方案或集采。',
    '你只能给出“证据—判断—待确认草稿—下一步”的建议；所有写入都必须由用户在原业务表单中确认。',
    '纸价问题必须强调仅以页面中已核验的来源、规格、地区和时间为准，不输出具体预测价格。',
    `当前场景：${safe.kind} / ${safe.title}`,
    `可引用证据：\n${evidence}`,
    `可补全草稿字段：\n${fields}`,
    '请先说明证据边界，再提出不超过三条可执行核对项，并明确下一步需要用户确认。',
  ].join('\n\n')
}
