'use client'

import { useState } from 'react'
import {
  TrendingUp,
  Building2,
  ShoppingCart,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowRightLeft,
  Info,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface MarketBenchmarkingProps {
  paperType: string
}

export function MarketBenchmarking({ paperType }: MarketBenchmarkingProps) {
  const [benchmarkTab, setBenchmarkTab] = useState<'gov' | '1688'>('gov')

  // 根据 paperType 渲染不同的 2026原材料行情
  const renderMarket行情 = () => {
    if (paperType === '铜版纸') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600 animate-pulse" />
            <h3 className="text-sm font-bold text-ink-primary">2026年 铜版纸最新行情分析</h3>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3">
              <span className="block text-3xs text-ink-tertiary">卓创主流均价</span>
              <span className="text-base font-extrabold text-indigo-900">约 ¥4,600 / 吨</span>
              <span className="mt-1 block text-3xs text-ink-tertiary">较前期持平（6月30日数据）</span>
            </div>
            <div className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3">
              <span className="block text-3xs text-ink-tertiary">华南、华东参考价</span>
              <span className="text-base font-extrabold text-indigo-900">¥5,450 ~ ¥5,750</span>
              <span className="mt-1 block text-3xs text-ink-tertiary">沿海产业带集聚区价格</span>
            </div>
            <div className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3">
              <span className="block text-3xs text-ink-tertiary">华北、华中参考价</span>
              <span className="text-base font-extrabold text-indigo-900">¥5,700 ~ ¥5,850</span>
              <span className="mt-1 block text-3xs text-ink-tertiary">内陆及北方造纸基地价格</span>
            </div>
          </div>
          <div className="rounded-lg bg-canvas p-3.5 border border-line-light">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-2xs leading-relaxed text-ink-secondary">
                <strong className="text-ink-primary">规格特征：</strong>
                157g 铜版纸作为标准规格，占据目前市场最主流地位。铜版纸价格受涂布工艺和原浆质量影响，通常比同克重的双胶纸高出 <strong>20% ~ 50%</strong> 左右。当前市场呈现供给充足、均价震荡盘整的特点。
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (paperType === '双胶纸') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600 animate-pulse" />
            <h3 className="text-sm font-bold text-ink-primary">2026年 双胶纸最新行情分析</h3>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3">
              <span className="block text-3xs text-ink-tertiary">行业均价参考</span>
              <span className="text-base font-extrabold text-indigo-900">约 ¥5,238 / 吨</span>
              <span className="mt-1 block text-3xs text-success font-medium">稳中有升态势 ↑</span>
            </div>
            <div className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3">
              <span className="block text-3xs text-ink-tertiary">主流纸企报价</span>
              <span className="text-base font-extrabold text-indigo-900">¥4,900 ~ ¥5,300</span>
              <span className="mt-1 block text-3xs text-ink-tertiary">大型造纸厂直签大盘价</span>
            </div>
            <div className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3">
              <span className="block text-3xs text-ink-tertiary">高端纸/特种纸</span>
              <span className="text-base font-extrabold text-indigo-900">¥5,600 ~ ¥6,200</span>
              <span className="mt-1 block text-3xs text-ink-tertiary">高白度、高平滑度双胶纸</span>
            </div>
          </div>
          <div className="rounded-lg bg-canvas p-3.5 border border-line-light">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-2xs leading-relaxed text-ink-secondary">
                <strong className="text-ink-primary">规格特征：</strong>
                双胶纸是书刊、说明书印刷的主要用纸。<strong>70g - 80g</strong> 规格为最主流的书刊印刷标准用纸。当前中小纸企的双胶纸价格维持在较低的 <strong>¥4,500 ~ ¥4,900/吨</strong>。受学期备货旺季影响，近期价格略有支撑。
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 默认展示其他纸种的宏观分析
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600 animate-pulse" />
          <h3 className="text-sm font-bold text-ink-primary">2026年 {paperType} 行情大盘参考</h3>
        </div>
        <p className="text-xs leading-relaxed text-ink-secondary">
          当前国内 {paperType} 市场价格基本保持平稳，主要造纸企业产能出货正常。由于本季度为印刷耗材常规采购周期，预计整体波动在 <strong>&plusmn;3.5%</strong> 以内，建议印刷工厂采取“按需采购、少量多次”的备货策略，以规避价格波动风险。
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-line p-3 text-center bg-canvas/30">
            <span className="block text-3xs text-ink-tertiary">建议备货周期</span>
            <span className="text-sm font-extrabold text-ink-primary">15 - 30 天</span>
          </div>
          <div className="rounded-lg border border-line p-3 text-center bg-canvas/30">
            <span className="block text-3xs text-ink-tertiary">市场价格走势</span>
            <span className="text-sm font-extrabold text-primary">震荡盘整</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card padding="lg" className="border-line bg-white shadow-sm animate-fade-in-up">
      {/* 行情分析 */}
      <div className="border-b border-line-light pb-5">
        {renderMarket行情()}
      </div>

      {/* 多渠道价格对标面板 */}
      <div className="mt-6">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-ink-primary flex items-center gap-1.5">
              <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
              多渠道价格对标参考
            </h3>
            <p className="text-3xs text-ink-tertiary mt-0.5">
              对比政府采购中标价、1688批发价，帮您快速评估采购水位
            </p>
          </div>

          {/* 交互式对标切换 Tab */}
          <div className="inline-flex rounded-lg bg-canvas p-1 self-start sm:self-auto border border-line-light">
            <button
              onClick={() => setBenchmarkTab('gov')}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-base cursor-pointer',
                benchmarkTab === 'gov'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-ink-secondary hover:text-indigo-600'
              )}
            >
              <Building2 className="h-3.5 w-3.5" />
              政府采购报价
            </button>
            <button
              onClick={() => setBenchmarkTab('1688')}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-base cursor-pointer',
                benchmarkTab === '1688'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-ink-secondary hover:text-indigo-600'
              )}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              B2B平台批发价
            </button>
          </div>
        </div>

        {/* Tab 内容 1: 政府采购报价 */}
        {benchmarkTab === 'gov' && (
          <div className="space-y-5 animate-fade-in-up">
            {/* 项目 1 */}
            <div className="rounded-xl border border-line p-4 space-y-3 bg-canvas/20">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="outline" size="sm" className="bg-indigo-50 border-indigo-200 text-indigo-700">国家大宗采购</Badge>
                  <h4 className="mt-1 text-xs font-bold text-ink-primary">甘肃省人民政府办公厅印刷厂大宗纸张采购 (2026-2028)</h4>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="block text-3xs text-ink-tertiary">项目最高限价</span>
                  <span className="text-xs font-extrabold text-indigo-900">一包 130万 / 二包 71万</span>
                </div>
              </div>

              {/* 需求详情表格 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-3xs">
                  <thead>
                    <tr className="border-b border-line-light bg-canvas text-ink-tertiary font-semibold">
                      <th className="p-2 w-16">包号</th>
                      <th className="p-2">物资类型</th>
                      <th className="p-2">采购数量</th>
                      <th className="p-2">尺寸规格</th>
                      <th className="p-2">采购用途</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-light text-ink-secondary">
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-medium text-indigo-600">一包</td>
                      <td className="p-2 font-bold text-ink-primary">80克数码卷筒纸</td>
                      <td className="p-2">170 吨</td>
                      <td className="p-2">440mm</td>
                      <td className="p-2">喷墨数码机印刷</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-medium text-indigo-600">一包</td>
                      <td className="p-2 font-bold text-ink-primary">80-120克牛皮纸</td>
                      <td className="p-2">10 吨</td>
                      <td className="p-2">787 &times; 1092mm</td>
                      <td className="p-2">信封制作专场</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-medium text-indigo-600">二包</td>
                      <td className="p-2 font-bold text-ink-primary">80克防静电复印原纸</td>
                      <td className="p-2">50 吨</td>
                      <td className="p-2">880 &times; 1230mm</td>
                      <td className="p-2">复印原浆纸数码机用</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-medium text-indigo-600">二包</td>
                      <td className="p-2 font-bold text-ink-primary">157-250克铜版纸</td>
                      <td className="p-2">15 吨</td>
                      <td className="p-2">890 &times; 1240mm</td>
                      <td className="p-2">封面用纸</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-medium text-indigo-600">二包</td>
                      <td className="p-2 font-bold text-ink-primary">70-80克胶刊纸</td>
                      <td className="p-2">25 吨</td>
                      <td className="p-2">880 &times; 1230mm</td>
                      <td className="p-2">胶刊纸书刊、文头用纸</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 项目 2 */}
            <div className="rounded-xl border border-line p-4 space-y-3 bg-canvas/20">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="outline" size="sm" className="bg-indigo-50 border-indigo-200 text-indigo-700">军队工厂定点采购</Badge>
                  <h4 className="mt-1 text-xs font-bold text-ink-primary">中国人民解放军第四二一零工厂纸张采购项目</h4>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="block text-3xs text-ink-tertiary">中标供应商及金额</span>
                  <span className="text-xs font-extrabold text-success">廊坊市耀华纸业 (¥1,577,440.00)</span>
                </div>
              </div>

              {/* 采购明细 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-3xs">
                  <thead>
                    <tr className="border-b border-line-light bg-canvas text-ink-tertiary font-semibold">
                      <th className="p-2">物资名称</th>
                      <th className="p-2">尺寸规格参数</th>
                      <th className="p-2">采购数量</th>
                      <th className="p-2">交付标准</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-light text-ink-secondary">
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-bold text-ink-primary">双胶纸（胶版印刷纸）</td>
                      <td className="p-2">880 &times; 1230mm / 787 &times; 1092mm</td>
                      <td className="p-2">600 令 + 600 令</td>
                      <td className="p-2 text-ink-tertiary">正品原浆出厂，托盘发货</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-bold text-ink-primary">铜版纸</td>
                      <td className="p-2">880 &times; 1230mm / 970 &times; 940mm</td>
                      <td className="p-2">2400 令 + 300 令</td>
                      <td className="p-2 text-ink-tertiary">高光白度，印刷无粉尘</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-bold text-ink-primary">无光铜版纸</td>
                      <td className="p-2">880 &times; 1230mm</td>
                      <td className="p-2">200 令</td>
                      <td className="p-2 text-ink-tertiary">哑粉纸质，适合高级画册</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2 font-bold text-ink-primary">米白双胶纸</td>
                      <td className="p-2">889 &times; 1194mm / 890 &times; 1240mm</td>
                      <td className="p-2">440 令 + 120 令</td>
                      <td className="p-2 text-ink-tertiary">温润护眼色调，主要教材用纸</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 内容 2: 1688批发价 */}
        {benchmarkTab === '1688' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="rounded-lg bg-indigo-50/30 p-3 flex items-center gap-2 border border-indigo-100 text-3xs text-indigo-850">
              <Info className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>数据来源于阿里巴巴 1688 批发平台，数据反映的是当前华南、华东印刷产业密集区商家的主流出厂价格，可作为散单或小批量定制比价基准。</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left border-collapse text-3xs">
                <thead>
                  <tr className="border-b border-line bg-canvas text-ink-tertiary font-semibold">
                    <th className="p-3">产品名称</th>
                    <th className="p-3">参考批发单价</th>
                    <th className="p-3">平台历史成交笔数</th>
                    <th className="p-3">主要产地</th>
                    <th className="p-3">备注</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-secondary">
                  <tr className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3 font-bold text-ink-primary">企业宣传画册印刷</td>
                    <td className="p-3 text-primary font-bold">¥1.00 <span className="text-3xs text-ink-tertiary font-normal">/册</span></td>
                    <td className="p-3">2,889 笔</td>
                    <td className="p-3 flex items-center gap-1"><MapPin className="h-3 w-3 text-ink-tertiary" /> 广州市白云区</td>
                    <td className="p-3 text-ink-tertiary">精装书本册定制</td>
                  </tr>
                  <tr className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3 font-bold text-ink-primary">海报宣传单彩页印刷</td>
                    <td className="p-3 text-primary font-bold">¥0.13 <span className="text-3xs text-ink-tertiary font-normal">/张</span></td>
                    <td className="p-3">3,266 笔</td>
                    <td className="p-3 flex items-center gap-1"><MapPin className="h-3 w-3 text-ink-tertiary" /> 上海市松江区</td>
                    <td className="p-3 text-ink-tertiary">支持 A5/A4/A3 拼版印刷</td>
                  </tr>
                  <tr className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3 font-bold text-ink-primary">卡纸酒店房卡套印刷</td>
                    <td className="p-3 text-primary font-bold">¥0.05 <span className="text-3xs text-ink-tertiary font-normal">/个</span></td>
                    <td className="p-3">1,272 笔</td>
                    <td className="p-3 flex items-center gap-1"><MapPin className="h-3 w-3 text-ink-tertiary" /> 东莞市</td>
                    <td className="p-3 text-ink-tertiary">纸卡个性化定制</td>
                  </tr>
                  <tr className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3 font-bold text-ink-primary">宣传画册折页说明书</td>
                    <td className="p-3 text-primary font-bold">¥0.01 <span className="text-3xs text-ink-tertiary font-normal">/页</span></td>
                    <td className="p-3">2,029 笔</td>
                    <td className="p-3 flex items-center gap-1"><MapPin className="h-3 w-3 text-ink-tertiary" /> 广州市</td>
                    <td className="p-3 text-ink-tertiary">折页大厂，厂家直销</td>
                  </tr>
                  <tr className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3 font-bold text-ink-primary">A4打印纸整箱批发70g</td>
                    <td className="p-3 text-primary font-bold">¥120.00 <span className="text-3xs text-ink-tertiary font-normal">/箱</span></td>
                    <td className="p-3">1,371 笔</td>
                    <td className="p-3 flex items-center gap-1"><MapPin className="h-3 w-3 text-ink-tertiary" /> 临沂市</td>
                    <td className="p-3 text-ink-tertiary">8 包装，足张足克保证</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
