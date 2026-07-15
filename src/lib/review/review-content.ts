import type { BusinessRole, ReviewAction } from './scenario'

export interface ReviewRoleDefinition {
  id: BusinessRole
  title: string
  description: string
  action: ReviewAction
  actionLabel: string
}

export const REVIEW_ROLES: ReviewRoleDefinition[] = [
  {
    id: 'requester',
    title: '需求方',
    description: '整理校园开放日物料需求，发布后比较印刷方案。',
    action: 'publish_requirement',
    actionLabel: '发布演示需求',
  },
  {
    id: 'printer',
    title: '印刷厂',
    description: '核对工艺、交期与产能，提交完整印刷报价。',
    action: 'submit_bid',
    actionLabel: '提交演示报价',
  },
  {
    id: 'material_supplier',
    title: '原料供应商',
    description: '根据用纸规格提供供货方案，支持后续集采比选。',
    action: 'submit_supply_offer',
    actionLabel: '提交演示供货方案',
  },
]

export const REVIEW_STORY = {
  isDemo: true,
  title: '校园开放日宣传物料协同',
  summary: '一条需求如何连接印刷产能、纸张供货与采购沟通。',
  requirement: {
    location: '广州',
    deliveryWindow: '确认方案后 10 个工作日',
    budget: '演示预算 ¥38,000-¥52,000',
    items: [
      '招生画册 2,000 册，A4，24P，骑马钉',
      '三折宣传单 5,000 张，双面彩印',
      '活动手提袋 800 个，覆哑膜',
    ],
  },
  printerOffer: {
    price: '演示报价 ¥46,800',
    delivery: '8 个工作日',
    note: '画册与折页合版生产，手提袋同步排产。',
  },
  supplyOffer: {
    material: '157g 铜版纸',
    price: '演示参考 ¥6,480/吨',
    minimum: '起供 1 吨',
    delivery: '确认后 3 天内到厂',
  },
} as const
