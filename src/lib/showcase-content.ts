export type ShowcaseModule = 'orders' | 'purchase' | 'startup' | 'training'

export interface ShowcaseItem {
  id: string
  module: ShowcaseModule
  displayLabel: '演示样例' | '公开资料参考'
  title: string
  summary: string
  coverImage: string
  sourceName: string
  sourceUrl: string
  publishedAt: string
  capturedAt: string
  isDemo: boolean
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  { id: 'order-packaging', module: 'orders', displayLabel: '演示样例', title: '食品包装盒彩印协同需求', summary: '用于展示包装盒彩印的需求拆解、工艺沟通与交付节点，不代表平台真实订单。', coverImage: '/images/startup/case_1.jpg', sourceName: '智印联创项目展示内容', sourceUrl: '/about', publishedAt: '2025-01-01', capturedAt: '2026-07-12', isDemo: true },
  { id: 'order-brochure', module: 'orders', displayLabel: '演示样例', title: '企业画册短版印刷需求', summary: '展示画册类任务的纸张、页数、装订和交期信息组织方式，不代表平台真实交易。', coverImage: '/images/startup/article_2.jpg', sourceName: '智印联创项目展示内容', sourceUrl: '/about', publishedAt: '2025-01-01', capturedAt: '2026-07-12', isDemo: true },
  { id: 'purchase-coated', module: 'purchase', displayLabel: '公开资料参考', title: '铜版纸材料参考', summary: '用于展示纸张品类、规格与采购沟通入口；页面不展示未核验的采购价格或成团进度。', coverImage: '/images/purchase/coated_paper.jpg', sourceName: '项目本地素材库', sourceUrl: '/images/purchase/coated_paper.jpg', publishedAt: '2026-07-01', capturedAt: '2026-07-12', isDemo: false },
  { id: 'purchase-ctp', module: 'purchase', displayLabel: '公开资料参考', title: 'CTP 版材材料参考', summary: '用于展示印前耗材的产品图文信息与后续询价流程。', coverImage: '/images/purchase/ctp_plates.jpg', sourceName: '项目本地素材库', sourceUrl: '/images/purchase/ctp_plates.jpg', publishedAt: '2026-07-01', capturedAt: '2026-07-12', isDemo: false },
  { id: 'startup-route', module: 'startup', displayLabel: '公开资料参考', title: '印刷创业筹备路径', summary: '基于项目商业计划书的筹备、设备、客户与运营路径整理。', coverImage: '/images/startup/article_1.jpg', sourceName: '智印联创商业计划书', sourceUrl: '/startup', publishedAt: '2025-01-01', capturedAt: '2026-07-12', isDemo: false },
  { id: 'startup-case', module: 'startup', displayLabel: '公开资料参考', title: '产教融合项目案例', summary: '展示公开项目案例的图文结构，具体经营数据不作为平台业绩展示。', coverImage: '/images/startup/case_2.jpg', sourceName: '智印联创商业计划书', sourceUrl: '/startup/cases', publishedAt: '2025-01-01', capturedAt: '2026-07-12', isDemo: false },
  { id: 'training-print', module: 'training', displayLabel: '公开资料参考', title: '胶印设备与工艺现场', summary: '本地授权设备视频，用于认识印刷机组、走纸与色彩控制的基础环节。', coverImage: '/images/auth_side.jpg', sourceName: '项目本地视频素材', sourceUrl: '/videos/heidelberg.mp4', publishedAt: '2026-06-30', capturedAt: '2026-07-12', isDemo: false },
  { id: 'training-prepress', module: 'training', displayLabel: '公开资料参考', title: '印前制版基础', summary: '从文件检查、制版到上机准备的学习路径，适合作为实训前置阅读。', coverImage: '/images/purchase/ps_plates.jpg', sourceName: '项目本地素材库', sourceUrl: '/images/purchase/ps_plates.jpg', publishedAt: '2026-07-01', capturedAt: '2026-07-12', isDemo: false },
]

export const ASSET_MANIFEST = [
  { path: '/videos/heidelberg.mp4', purpose: '首页与培训工艺现场视频', source: '项目本地素材', license: '项目方确认可用', alt: '印刷设备运行画面' },
  { path: '/videos/manroland.mp4', purpose: '首页备用设备视频', source: '项目本地素材', license: '项目方确认可用', alt: '印刷设备走纸画面' },
  { path: '/images/purchase/coated_paper.jpg', purpose: '集采材料展示', source: '项目本地素材', license: '项目方确认可用', alt: '铜版纸材料' },
  { path: '/images/startup/article_1.jpg', purpose: '创业资源展示', source: '项目本地素材', license: '项目方确认可用', alt: '印刷创业资料' },
  { path: '/images/external/press-studio.jpg', purpose: '订单大厅协同信号台背景', source: 'Pexels / AI25.Studio Studio', sourceUrl: 'https://www.pexels.com/photo/view-of-graphic-designers-studio-with-a-press-and-posters-6620972/', license: 'Pexels License（免费下载和使用）', downloadedAt: '2026-07-12', alt: '创意工作室内的传统印刷设备与海报' },
  { path: '/images/external/press-production.png', purpose: '集采商城材料光谱背景', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/machinery-in-factory-19316517/', license: 'Pexels License（免费下载和使用）', downloadedAt: '2026-07-12', alt: '正在运行的工业印刷设备细节' },
  { path: '/images/external/press-tools.jpg', purpose: '创业孵化视觉背景', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/person-working-on-industrial-machine-6620977/', license: 'Pexels License（免费下载和使用）', downloadedAt: '2026-07-12', alt: '工作人员调整印刷设备' },
  { path: '/images/external/press-detail.jpg', purpose: '技术培训工艺卡片插图', source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/green-and-black-industrial-machine-1440504/', license: 'Pexels License（免费下载和使用）', downloadedAt: '2026-07-12', alt: '工业印刷设备的精密机械细节' },
] as const
