export const HOME_ROLES = [
  {
    id: 'requester',
    title: '我有印刷需求',
    description: '把品类、工艺、数量和交期说明清楚，集中比较印刷方案。',
    href: '/orders/publish',
  },
  {
    id: 'printer',
    title: '我是印刷厂',
    description: '展示设备与产能，查看匹配需求并提交完整报价。',
    href: '/orders',
  },
  {
    id: 'material_supplier',
    title: '我是原料供应商',
    description: '对接纸张与耗材采购需求，提交可审核的供货方案。',
    href: '/purchase',
  },
] as const

export const HOME_CAPABILITIES = [
  {
    title: '供需协同',
    description: '用统一需求字段连接需求方、印刷产能与报价沟通。',
    href: '/orders',
    media: '/images/external/press-production.png',
  },
  {
    title: '集中采购',
    description: '聚合真实采购意向，由平台审核活动和供应方案。',
    href: '/purchase',
    media: '/images/purchase/coated_paper.jpg',
  },
  {
    title: '纸价情报',
    description: '按来源、规格、地区和时间呈现已核验公开报价。',
    href: '/prediction/白卡纸',
    media: '/images/purchase/woodfree_paper.jpg',
  },
] as const

export const HOME_FLOW = [
  ['需求成形', '把产品、数量、工艺、交期与预算转为可比较的需求。'],
  ['产能响应', '印刷厂依据设备、排期和交付条件提交报价。'],
  ['原料协同', '供应商围绕纸张与耗材给出供货条件。'],
  ['方案确认', '各方在线核对信息，实际合同与结算由双方确认。'],
] as const

export const HOME_FAQ = [
  {
    question: '网站中的演示数据会进入真实订单吗？',
    answer: '不会。评审演示使用独立状态，页面会持续标注演示场景，不写入真实订单、报价或集采统计。',
  },
  {
    question: '纸价信息能否直接作为采购报价？',
    answer: '不能。平台只呈现来源、规格与时间明确的行情参考，实际采购以供应商正式报价和合同条款为准。',
  },
  {
    question: '印刷厂和原料供应商如何参与？',
    answer: '完成账号与企业资料审核后，可按身份进入相应工作台，发布产能或提交供货方案。',
  },
  {
    question: '产教实践中心提供什么？',
    answer: '提供公开学习资源、导师介绍、创业与生产测算工具，以及项目申请入口，不承诺投资回报。',
  },
] as const
