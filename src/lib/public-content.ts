/**
 * 仅包含已在商业计划书中出现或经项目方确认可公开的信息。
 * 任何用户量、成交金额、市场价格和预测结论都不得在这里伪造。
 */
export const PUBLIC_PLATFORM_PROFILE = {
  name: '智印联创',
  tagline: '印刷产业协同服务平台',
  description:
    '面向中小印刷企业的产教融合协同服务平台，连接订单撮合、集中采购、纸价信息与创业孵化服务。',
  launchNotice: '本站当前为功能测试预览，完成备案与数据授权后正式上线。',
} as const

export const PUBLIC_RESEARCH_FACTS = [
  {
    value: '312',
    label: '调研样本企业',
    detail: '2025 年团队调研，覆盖 7 个省份',
  },
  {
    value: '78.6%',
    label: '价格信息不及时',
    detail: '受访企业反馈原材料价格信息存在滞后',
  },
  {
    value: '82.7%',
    label: '有集采参与意愿',
    detail: '受访企业期待透明的采购与质量保障机制',
  },
] as const

export const PUBLIC_PARTNERS = [
  '广州七色彩广告策划有限公司',
  '广州艺汇科技有限公司',
] as const

export const PUBLIC_MENTORS = [
  {
    name: '叶作龙',
    title: '校内专业导师',
    expertise: '数字印刷专业教学与项目指导',
  },
  {
    name: '邹均长',
    title: '企业产业导师',
    expertise: '企业管理、市场开拓与供应链整合',
  },
] as const

export const PRICE_DATA_STATUS = {
  source: '卓创资讯造纸产业链数据',
  status: '待授权接入',
  updateFrequency: '授权后按日更新',
  detail:
    '当前不展示未获授权的市场价格、预测数值或采购建议。数据接入后将标注纸种、规格、区域、单位、更新时间与来源。',
} as const
