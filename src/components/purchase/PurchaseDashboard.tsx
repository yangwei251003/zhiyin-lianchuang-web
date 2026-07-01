'use client'

import { useState } from 'react'
import {
  TrendingDown,
  Sparkles,
  Layers,
  Award,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Percent,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export function PurchaseDashboard() {
  const [activeTab, setActiveTab] = useState<'progress' | 'price' | 'new-category' | 'supplier'>('progress')

  const tabs = [
    { id: 'progress', label: '成团进度与促单建议', icon: Sparkles },
    { id: 'price', label: '集采价格优势分析', icon: TrendingDown },
    { id: 'new-category', label: '拟增集采品类预告', icon: Layers },
    { id: 'supplier', label: '知名品牌直供拓展', icon: Award },
  ] as const

  return (
    <Card padding="lg" className="border-line bg-gradient-to-br from-white to-primary-bg-subtle/20 shadow-md">
      {/* 头部装饰 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line-light pb-4">
        <div>
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-primary-bg px-2.5 py-0.5 text-2xs font-semibold text-primary">
            <Zap className="h-3 w-3 fill-primary animate-pulse" />
            集采决策分析大盘
          </span>
          <h2 className="text-xl font-bold text-ink-primary sm:text-2xl">
            平台集采动态与采购策略
          </h2>
          <p className="mt-1 text-xs text-ink-tertiary">
            汇聚全网印刷商需求，对标最新市场行情，助您做出高收益采购决策
          </p>
        </div>
        
        {/* 数据摘要 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg bg-white border border-line px-3 py-1.5 shadow-2xs">
            <span className="block text-3xs text-ink-tertiary">历史最大降幅</span>
            <span className="text-sm font-extrabold text-success-light">12.0%</span>
          </div>
          <div className="rounded-lg bg-white border border-line px-3 py-1.5 shadow-2xs">
            <span className="block text-3xs text-ink-tertiary">成团率均值</span>
            <span className="text-sm font-extrabold text-primary">49.8%</span>
          </div>
        </div>
      </div>

      {/* 交互式 Tab 菜单 */}
      <div className="mt-5 overflow-x-auto">
        <div className="flex border-b border-line-light min-w-max pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-base cursor-pointer',
                  isSelected
                    ? 'border-primary text-primary bg-primary-bg/20 rounded-t-md font-bold'
                    : 'border-transparent text-ink-secondary hover:text-primary hover:border-primary/30'
                )}
              >
                <Icon className={cn('h-4 w-4', isSelected ? 'text-primary' : 'text-ink-tertiary')} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab 内容区 */}
      <div className="mt-6">
        {/* 1. 成团进度与促单建议 */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-in-up">
            {/* 铜版纸 */}
            <div className="group rounded-xl border border-line bg-white p-4.5 transition-all duration-base hover:border-primary-light hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-primary">铜版纸200g联合集采第3期</span>
                <Badge variant="primary" size="sm">进行中</Badge>
              </div>
              
              {/* 进度条 */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-2xs">
                  <span className="text-ink-tertiary">已认购: 23件 / 目标: 50件</span>
                  <span className="font-bold text-primary">46%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-slow" style={{ width: '46%' }} />
                </div>
              </div>

              {/* 策略分析 */}
              <div className="mt-4 rounded-lg bg-canvas p-3 border border-line-light">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                  <div>
                    <span className="block text-2xs font-bold text-ink-secondary">诊断与策略</span>
                    <p className="mt-1 text-2xs leading-relaxed text-ink-tertiary">
                      当前成团率 46%，进度相对较慢。建议加大在华南、华东地区纸张采购大厅的定向推广，吸引有高端宣传册印刷需求的工厂参与拼单。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 双胶纸 */}
            <div className="group rounded-xl border border-line bg-white p-4.5 transition-all duration-base hover:border-warning hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-primary">双胶纸100g开学季集采专场</span>
                <Badge variant="warning" size="sm">临近截单</Badge>
              </div>
              
              {/* 进度条 */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-2xs">
                  <span className="text-ink-tertiary">已认购: 18件 / 目标: 30件</span>
                  <span className="font-bold text-warning">60%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
                  <div className="h-full bg-warning transition-all duration-slow" style={{ width: '60%' }} />
                </div>
              </div>

              {/* 策略分析 */}
              <div className="mt-4 rounded-lg bg-canvas p-3 border border-line-light">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 text-warning shrink-0 animate-pulse" />
                  <div>
                    <span className="block text-2xs font-bold text-ink-secondary">诊断与策略</span>
                    <p className="mt-1 text-2xs leading-relaxed text-ink-tertiary">
                      成团率达 60%，成团可能性极高。已开启 05 天倒计时限时抢位。建议通过平台系统向发布过画册/书刊订单的采购商推送短信与App强弹窗。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 大豆油墨 */}
            <div className="group rounded-xl border border-line bg-white p-4.5 transition-all duration-base hover:border-success hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-primary">环保大豆油墨 季度集采</span>
                <Badge variant="success" size="sm">人气高涨</Badge>
              </div>
              
              {/* 进度条 */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-2xs">
                  <span className="text-ink-tertiary">已认购: 87件 / 目标: 200件</span>
                  <span className="font-bold text-success">43.5%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
                  <div className="h-full bg-success transition-all duration-slow" style={{ width: '43.5%' }} />
                </div>
              </div>

              {/* 策略分析 */}
              <div className="mt-4 rounded-lg bg-canvas p-3 border border-line-light">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-success shrink-0" />
                  <div>
                    <span className="block text-2xs font-bold text-ink-secondary">诊断与策略</span>
                    <p className="mt-1 text-2xs leading-relaxed text-ink-tertiary">
                      参与人数最多（87人已参团），但距离大单目标（200件）还有差距。可主打环保绿色理念，引导印刷厂采购环保认证物料以备大宗政企采购投标。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 集采价格优势分析 */}
        {activeTab === 'price' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in-up">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-ink-primary">联合集采价格与零售市场对比</h3>
              </div>
              <p className="text-xs leading-relaxed text-ink-secondary">
                联合集采能够将散户需求打包，直接向上游纸厂（如晨鸣、太阳等）或大代理商直签采购。价格相比常规市场零售价有非常显著的价差，降幅普遍在 <strong>5% ~ 12%</strong>。
              </p>

              {/* 直观的柱状比价图 */}
              <div className="space-y-3.5 rounded-lg border border-line bg-canvas p-4">
                <div>
                  <div className="flex justify-between text-2xs mb-1">
                    <span className="font-medium text-ink-primary">铜版纸200g (元/件)</span>
                    <span className="text-success font-semibold">节省约 ¥500+ / 8.5%</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-2xs">
                      <span className="w-14 text-ink-tertiary">本期集采</span>
                      <div className="flex-1 h-5 bg-primary/20 border border-primary/30 rounded overflow-hidden flex items-center px-2">
                        <span className="text-primary font-bold">¥6,200</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-2xs">
                      <span className="w-14 text-ink-tertiary">市场零售</span>
                      <div className="flex-1 h-5 bg-ink-tertiary/20 border border-ink-tertiary/30 rounded overflow-hidden flex items-center px-2">
                        <span className="text-ink-secondary">¥6,500 ~ ¥7,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-line-light pt-3">
                  <div className="flex justify-between text-2xs mb-1">
                    <span className="font-medium text-ink-primary">环保四色油墨 (元/套)</span>
                    <span className="text-success font-semibold">节省约 ¥42 / 13.5%</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-2xs">
                      <span className="w-14 text-ink-tertiary">本期集采</span>
                      <div className="flex-1 h-5 bg-success/20 border border-success/30 rounded overflow-hidden flex items-center px-2">
                        <span className="text-success font-bold">¥268</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-2xs">
                      <span className="w-14 text-ink-tertiary">市场零售</span>
                      <div className="flex-1 h-5 bg-ink-tertiary/20 border border-ink-tertiary/30 rounded overflow-hidden flex items-center px-2">
                        <span className="text-ink-secondary">¥310</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 精美配图/配文 */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-2xs lg:flex-row">
              <div className="relative aspect-video w-full overflow-hidden bg-canvas lg:aspect-auto lg:w-44 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/purchase/coated_paper.jpg"
                  alt="Coated Paper Stock"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-3xs font-semibold text-white backdrop-blur-xs">
                  <ShieldCheck className="h-3 w-3 text-success-light" />
                  正品保障
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h4 className="text-xs font-bold text-ink-primary">为什么选择平台集采？</h4>
                  <p className="mt-1.5 text-2xs leading-relaxed text-ink-secondary">
                    传统印刷厂由于规模较小，单独向造纸厂订货时拿不到批发价，还要承担高昂的物流拼车费用。
                  </p>
                  <p className="mt-1 text-2xs leading-relaxed text-ink-tertiary">
                    智印联创平台通过聚集百家印刷厂零散需求，代表联盟与大纸厂进行大宗交易订购，统一配送，真正实现降本。
                  </p>
                </div>
                <div className="mt-3 border-t border-line-light pt-2 flex items-center justify-between text-3xs text-ink-tertiary">
                  <span>数据来源: 卓创资讯 & 1688平台</span>
                  <span className="text-primary font-medium flex items-center gap-0.5">了解采购流程 <ArrowRight className="h-3 w-3" /></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. 拟增集采品类预告 */}
        {activeTab === 'new-category' && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-ink-primary">拟新增集采品类（2026年Q3规划）</h3>
            </div>
            <p className="text-xs leading-relaxed text-ink-secondary">
              针对广大印刷厂成员反馈的需求，平台计划在下个季度拓展集采物资种类，涵盖卡纸、特种印刷纸、耗材以及配套版材：
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { name: '白卡纸', desc: '包装盒、手提袋常用纸张' },
                { name: '牛皮纸', desc: '环保信封、手提纸袋主要原料' },
                { name: '数码卷筒纸', desc: '卷筒数码喷墨机专用卷筒纸' },
                { name: '胶刊纸', desc: '大众书刊、教材课本标准用纸' },
                { name: 'UV油墨', desc: '高亮、固化迅速的工业油墨' },
                { name: 'PS/CTP版材', desc: '大中型胶印必备高纯度版材' },
                { name: '覆膜材料', desc: '亮膜、哑膜、触感膜等后道材料' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-lg border border-line-light bg-white p-3.5 transition-all duration-base hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                >
                  <div>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary-bg text-2xs font-extrabold text-primary group-hover:scale-105 transition-transform">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h4 className="mt-2 text-xs font-bold text-ink-primary">{item.name}</h4>
                    <p className="mt-1 text-3xs leading-relaxed text-ink-tertiary">{item.desc}</p>
                  </div>
                  <span className="mt-3 block text-3xs text-primary/70 font-semibold group-hover:text-primary transition-colors cursor-pointer">
                    投递意向 &rarr;
                  </span>
                </div>
              ))}
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line p-4 text-center bg-canvas/30">
                <span className="text-xs font-bold text-ink-secondary">想要其他物资？</span>
                <button className="mt-2 rounded bg-primary px-3 py-1 text-3xs font-semibold text-white shadow hover:bg-primary-light transition-colors cursor-pointer">
                  提交您的采购建议
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. 知名品牌直供拓展 */}
        {activeTab === 'supplier' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-in-up">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-ink-primary">供应商拓展与绿色直供通道</h3>
              </div>
              <p className="text-xs leading-relaxed text-ink-secondary">
                为确保集采品质及货源的绝对稳定性，智印联创只选择与国内外行业巨头及通过国家绿色环保认证的顶尖原材料企业建立合作：
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-white p-4">
                  <span className="text-xs font-bold text-ink-primary">大型原浆造纸厂（直供直签）</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['太阳纸业', '晨鸣纸业', '华泰股份', '亚太森博'].map((s) => (
                      <Badge key={s} variant="outline" size="sm">{s}</Badge>
                    ))}
                  </div>
                  <p className="mt-2.5 text-3xs leading-normal text-ink-tertiary">
                    直连国内一流纸业巨头，缩短分销层级，确保每一件原纸纸质优良、吸墨均匀、克重足额。
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-white p-4">
                  <span className="text-xs font-bold text-ink-primary">绿色环保油墨/耗材供应商</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['杭华油墨', '乐迪新材料', '格林春天', '华光精工'].map((s) => (
                      <Badge key={s} variant="outline" size="sm">{s}</Badge>
                    ))}
                  </div>
                  <p className="mt-2.5 text-3xs leading-normal text-ink-tertiary">
                    主推大豆环保油墨、无VOCs排放耗材，帮助联盟内中小型印厂顺利通过环保检查，争取大客户订单。
                  </p>
                </div>
              </div>
            </div>

            {/* 宣传卡片 */}
            <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-5 shadow-2xs">
              <div className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-success-bg text-success">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-ink-primary">平台绿色质检服务</h4>
                <p className="text-3xs leading-relaxed text-ink-tertiary">
                  智印联创平台拥有独立的质检团队，对所有集采出厂物资进行随机物理及化学性能检验（吸墨性、拉伸强度、白度等），不合格物料平台承诺全额退款。
                </p>
              </div>
              <div className="mt-4 border-t border-line-light pt-3 text-3xs text-ink-tertiary flex justify-between items-center">
                <span>安全 · 绿色 · 质优</span>
                <span className="font-semibold text-success flex items-center gap-0.5">查看绿色认证 <ArrowRight className="h-3 w-3" /></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
