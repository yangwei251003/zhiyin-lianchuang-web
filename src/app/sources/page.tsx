import Link from 'next/link'
import { Container } from '@/components/layout/Container'

const sources = [
  { name: '智印联创 2025 年企业调研', type: '项目自有', use: '公开展示问卷样本量与已在商业计划书中载明的调研结果；不推断平台运营成绩。', license: '项目团队确认可公开内容' },
  { name: '中国政府采购网', type: '官方公开', use: '受保护采集接口只保存公开公告标题、原始链接与摘要，人工审核后才可展示。', license: '以官方页面与使用规则为准' },
  { name: 'Pexels', type: '许可媒体', use: '补充印刷设备、纸张与生产场景实拍；本地优化后用于页面背景和叙事媒体。', license: 'Pexels License；不暗示人物或品牌背书' },
  { name: '项目本地媒体', type: '项目授权', use: '包括印刷设备视频、封面图与团队提供素材；保留文件与用途台账。', license: '项目已有授权范围内使用' },
] as const

export default function SourcesPage() { return <main className="pb-20"><div className="bg-[#14263d] text-white"><Container className="py-12"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f29a70]">Provenance ledger</p><h1 className="mt-3 text-3xl font-bold">数据与媒体来源说明</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">公开内容遵循“采集 → 待审 → 人工批准 → 发布/到期下架”。未授权价格站、设备厂商媒体与无法核验的合作成绩不会被抓取公开。</p></Container></div><Container size="lg" className="pt-10"><div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">{sources.map((source) => <article key={source.name} className="bg-white p-6"><span className="text-xs font-semibold text-[#c84f20]">{source.type}</span><h2 className="mt-2 text-lg font-bold text-[#14263d]">{source.name}</h2><p className="mt-3 text-sm leading-6 text-ink-secondary">{source.use}</p><p className="mt-4 border-t border-line pt-3 text-xs text-ink-tertiary">许可/依据：{source.license}</p></article>)}</div><div className="mt-8 flex gap-3"><Link href="/privacy" className="border border-[#14263d] px-4 py-3 text-sm font-semibold text-[#14263d]">查看隐私政策</Link><Link href="/feedback" className="bg-[#14263d] px-4 py-3 text-sm font-semibold text-white">报告来源问题</Link></div></Container></main> }
