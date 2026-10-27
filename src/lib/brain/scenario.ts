export type BrainContextKind =
  | 'general'
  | 'order'
  | 'purchase'
  | 'price'
  | 'education'
  | 'review'

export type ReviewBrainRole = 'requester' | 'printer' | 'material_supplier'

export interface BrainEvidence {
  label: string
  value: string
  verified: boolean
  sourceUrl?: string
}

export interface BrainContextInput {
  kind: BrainContextKind
  title: string
  evidence?: BrainEvidence[]
  draftFields?: Record<string, string>
}

export interface BrainDraft {
  title: string
  status: 'needs_confirmation'
  fields: Record<string, string>
}

export interface BrainDecision {
  title: string
  summary: string
  nextStep: string
}

export interface DeterministicReviewDecision {
  mode: 'review'
  response: string
  decision: BrainDecision
  sources: BrainEvidence[]
  draft: BrainDraft
}

const priceLikeField = /(price|价格|预算|amount|金额|targetPrice)/i

export function sanitizeBrainContext(input: BrainContextInput): BrainContextInput {
  const evidence = (input.evidence ?? []).filter((item) => item.verified)
  const draftFields = Object.fromEntries(
    Object.entries(input.draftFields ?? {}).filter(([key]) => !priceLikeField.test(key)),
  )

  return {
    kind: input.kind,
    title: input.title.trim().slice(0, 120),
    evidence,
    draftFields,
  }
}

const REVIEW_DECISIONS: Record<ReviewBrainRole, Omit<DeterministicReviewDecision, 'mode'>> = {
  requester: {
    response: '需求已整理为可核对的宣传物料清单。下一步由印刷厂确认工艺可行性与排产窗口；演示内容不会写入真实订单。',
    decision: {
      title: '需求草稿已就绪',
      summary: '版式、数量、交付地区与周期已按同一需求单整理。',
      nextStep: '切换到印刷厂角色查看生产核对项。',
    },
    sources: [
      { label: '场景', value: '校园开放日宣传物料', verified: true },
      { label: '边界', value: '评审演示，不计入真实业务', verified: true },
    ],
    draft: {
      title: '需求发布草稿',
      status: 'needs_confirmation',
      fields: { category: '校园宣传物料', status: '演示待确认' },
    },
  },
  printer: {
    response: '生产核对项已整理为报价草稿。评审中仅展示工艺与交付协同逻辑，不把演示报价当作真实市场报价。',
    decision: {
      title: '报价核对已就绪',
      summary: '已将工艺、产能窗口与交付要求放在同一张待确认草稿中。',
      nextStep: '切换到原料供应商角色查看供货衔接。',
    },
    sources: [
      { label: '上游需求', value: '校园开放日宣传物料', verified: true },
      { label: '边界', value: '演示报价不进入真实报价表', verified: true },
    ],
    draft: {
      title: '印刷报价草稿',
      status: 'needs_confirmation',
      fields: { craft: '工艺待核对', status: '演示待确认' },
    },
  },
  material_supplier: {
    response: '供货方案已按材料、起供条件与交付衔接整理。评审中的材料信息用于说明协同链路，不表示公开纸价或实时供货承诺。',
    decision: {
      title: '供货衔接已就绪',
      summary: '原料信息与生产需求已被关联为一张待确认供货草稿。',
      nextStep: '回到需求方查看三角色闭环状态。',
    },
    sources: [
      { label: '协同对象', value: '校园宣传物料印刷需求', verified: true },
      { label: '边界', value: '演示供货方案不进入真实供货表', verified: true },
    ],
    draft: {
      title: '原料供货草稿',
      status: 'needs_confirmation',
      fields: { material: '纸张规格待确认', status: '演示待确认' },
    },
  },
}

export function createDeterministicReviewDecision(role: ReviewBrainRole): DeterministicReviewDecision {
  return { mode: 'review', ...REVIEW_DECISIONS[role] }
}
