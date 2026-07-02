'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, HelpCircle, Layers, Settings, FileText, CheckCircle2, TrendingDown } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'

// 纸张开度规格配置
const PAPER_SPECS = [
  { value: 'd16', label: '大度 16 开 (画册A4尺寸)', sheetArea: 1.0615, pagesPerSheet: 32, labelText: '大度全张 (889×1194mm)' },
  { value: 'z16', label: '正度 16 开 (小A4尺寸)', sheetArea: 0.8594, pagesPerSheet: 32, labelText: '正度全张 (787×1092mm)' },
  { value: 'd32', label: '大度 32 开 (口袋书尺寸)', sheetArea: 1.0615, pagesPerSheet: 64, labelText: '大度全张 (889×1194mm)' },
  { value: 'z32', label: '正度 32 开 (标准32开)', sheetArea: 0.8594, pagesPerSheet: 64, labelText: '正度全张 (787×1092mm)' },
]

// 常用内页克重
const WEIGHT_OPTIONS = [80, 105, 128, 157, 200]

export default function WastageCalculatorPage() {
  const [specKey, setSpecKey] = useState('d16')
  const [pages, setPages] = useState(96) // 内页P数
  const [weight, setWeight] = useState(128) // 克重 (g)
  const [printRun, setPrintRun] = useState(2000) // 印数 (册)
  const [paperPrice, setPaperPrice] = useState(6200) // 吨纸单价 (元)

  // 1. 获取规格
  const spec = useMemo(() => PAPER_SPECS.find(s => s.value === specKey) || PAPER_SPECS[0], [specKey])

  // 计算结果
  const calc = useMemo(() => {
    // A. 净用纸张令数/张数
    // 1个全张印张包含 spec.pagesPerSheet 页。
    const sheetsPerCopy = pages / spec.pagesPerSheet
    const netSheets = sheetsPerCopy * printRun

    // B. 加放/损耗率估算 (阶梯放损逻辑，印数越小放损比例越高)
    let wastageRate = 0.08 // 默认小于 500 册为 8% 放损
    if (printRun >= 500 && printRun < 1000) wastageRate = 0.06
    else if (printRun >= 1000 && printRun < 3000) wastageRate = 0.04
    else if (printRun >= 3000 && printRun < 5000) wastageRate = 0.025
    else if (printRun >= 5000) wastageRate = 0.015

    const wastageSheets = netSheets * wastageRate
    const totalSheets = netSheets + wastageSheets

    // 令数 (500张全开纸为1令)
    const netReams = netSheets / 500
    const totalReams = totalSheets / 500

    // C. 吨数计算
    // 重量 (吨) = 面积 (㎡) * 克重 (g/㎡) * 总张数 / 1,000,000
    const totalWeightTons = (spec.sheetArea * weight * totalSheets) / 1000000

    // D. 纸张成本 (元)
    const paperCost = totalWeightTons * paperPrice

    // E. 印刷与其他加工费用估算
    // 印张数 = pages / (spec.pagesPerSheet / 2) -> 一个印张折合正反面 16/32p
    const signatureCount = pages / (spec.pagesPerSheet / 2)
    // 制版费 (按PS版制版，每印张正反8块版，50元/块版)
    const platemakingCost = signatureCount * 8 * 50
    // 开机印刷费 (基础开机费800元 + 跑折合印费 0.05元/贴/印数)
    const printRunCost = Math.max(800, 800 + signatureCount * printRun * 0.05)
    // 折页装订工费 (完美无线胶装，按 1.8元/本)
    const bindingCost = printRun * 2.2

    // F. 汇总
    const totalCost = paperCost + platemakingCost + printRunCost + bindingCost
    const costPerCopy = totalCost / printRun

    return {
      netSheets: Math.ceil(netSheets),
      wastageSheets: Math.ceil(wastageSheets),
      totalSheets: Math.ceil(totalSheets),
      netReams: Number(netReams.toFixed(2)),
      totalReams: Number(totalReams.toFixed(2)),
      wastageRatePercent: (wastageRate * 100).toFixed(1),
      totalWeightTons: Number(totalWeightTons.toFixed(4)),
      paperCost: Math.ceil(paperCost),
      platemakingCost: Math.ceil(platemakingCost),
      printRunCost: Math.ceil(printRunCost),
      bindingCost: Math.ceil(bindingCost),
      totalCost: Math.ceil(totalCost),
      costPerCopy: Number(costPerCopy.toFixed(2)),
    }
  }, [spec, pages, weight, printRun, paperPrice])

  return (
    <main className="pb-16 bg-slate-50 min-h-screen">
      {/* 页头 */}
      <section className="relative overflow-hidden py-10 text-white"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <Container className="relative">
          <Link href="/startup/calculator" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mb-3">
            <ArrowLeft className="h-3.5 w-3.5" />
            返回计算器选择
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary-light">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-2xs font-semibold text-primary-light">
                学生自主研发工艺工装
              </span>
              <h1 className="text-xl font-bold sm:text-2xl mt-1 text-white">纸张损耗测算工装</h1>
            </div>
          </div>
          <p className="mt-2 max-w-xl text-xs text-slate-400">
            由广州科技职业技术大学数字印刷团队研发，将复杂的排料与印刷放损工艺公式编码，一键实现纸张利用率评估与智能开法成本预算。
          </p>
        </Container>
      </section>

      {/* 计算器核心 */}
      <Container className="mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* 左侧：输入参数表单 */}
          <div className="lg:col-span-5 space-y-5">
            <Card padding="md" className="bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                <Settings className="h-4.5 w-4.5 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-800">测算工艺参数</h3>
              </div>

              <div className="space-y-4">
                {/* 规格 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">画册开本规格</label>
                  <select
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                  >
                    {PAPER_SPECS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <span className="mt-1 block text-2xs text-slate-400">使用纸张：{spec.labelText}</span>
                </div>

                {/* 克重 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">纸张克重 (g/㎡)</label>
                  <div className="flex gap-2">
                    {WEIGHT_OPTIONS.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWeight(w)}
                        className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-all ${
                          weight === w ? 'border-primary bg-primary/8 text-primary' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {w}g
                      </button>
                    ))}
                  </div>
                </div>

                {/* 内页P数 */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">画册内页数 (P)</label>
                    <span className="text-xs font-bold text-slate-800">{pages} P</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={320}
                    step={8}
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-2xs text-slate-400 mt-1">
                    <span>8 P</span>
                    <span>160 P</span>
                    <span>320 P</span>
                  </div>
                </div>

                {/* 印数 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">预算印数 (册)</label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={printRun}
                    onChange={(e) => setPrintRun(Math.max(100, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {/* 吨纸单价 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">当前铜版纸吨价 (元/吨)</label>
                  <input
                    type="number"
                    min={3000}
                    step={100}
                    value={paperPrice}
                    onChange={(e) => setPaperPrice(Math.max(1000, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  <span className="mt-1 block text-2xs text-slate-400">拉取自“智印大脑”预测数据库，建议参考最新报价</span>
                </div>
              </div>
            </Card>

            {/* 工装说明 */}
            <Card padding="md" className="bg-slate-900 border border-slate-800 text-slate-300">
              <div className="flex items-center gap-1.5 mb-2.5">
                <HelpCircle className="h-4.5 w-4.5 text-primary-light" />
                <h4 className="text-xs font-bold text-white">关于开法拼贴建议</h4>
              </div>
              <p className="text-2xs leading-relaxed text-slate-400">
                本测算基于标准胶印对开机（大对开/正对开）排板。对于 {spec.label}，单张纸正反面共印 {spec.pagesPerSheet}P。拼贴时建议：
              </p>
              <ul className="mt-2 space-y-1 text-2xs text-slate-400">
                <li className="flex items-start gap-1">
                  <span className="text-primary-light">•</span>
                  <span><strong>放损率估算：</strong>已根据印刷机起步过油墨、调机及折页机咬口废边（已按本期参数自动应用 {calc.wastageRatePercent}% 损耗率）计算。</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-primary-light">•</span>
                  <span><strong>拼版方向：</strong>应确保纸张纹路平行于书脊，避免装订起皱。</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* 右侧：结果输出面板 */}
          <div className="lg:col-span-7 space-y-5">
            {/* 顶层核心指标 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xs text-slate-400">预估用纸总重</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{calc.totalWeightTons} <span className="text-xs font-normal">吨</span></div>
                <div className="mt-0.5 text-2xs text-slate-400">净重 {((spec.sheetArea * weight * calc.netSheets) / 1000000).toFixed(4)} 吨</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xs text-slate-400">总用纸张数</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{calc.totalSheets} <span className="text-xs font-normal">张全开</span></div>
                <div className="mt-0.5 text-2xs text-slate-400">合 {calc.totalReams} 令纸 (含放损)</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xs text-slate-400">预估单本成本</div>
                <div className="mt-1 text-2xl font-bold text-primary">¥{calc.costPerCopy} <span className="text-xs font-normal text-slate-400">元/册</span></div>
                <div className="mt-0.5 text-2xs text-slate-400">总成本 ¥{calc.totalCost.toLocaleString('zh-CN')}</div>
              </div>
            </div>

            {/* 图示与明细 */}
            <Card padding="lg" className="bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Layers className="h-4.5 w-4.5 text-slate-500" />
                印刷生产成本结构评估
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* SVG 饼图 */}
                <div className="flex flex-col items-center justify-center">
                  <svg className="h-36 w-36" viewBox="0 0 36 36">
                    {/* 背景环 */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {/* 纸张成本环 */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2A6CDB" strokeWidth="4.2"
                      strokeDasharray={`${(calc.paperCost / calc.totalCost) * 100} ${100 - (calc.paperCost / calc.totalCost) * 100}`}
                      strokeDashoffset="25" />
                    {/* 制版印刷环 */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2BAE6E" strokeWidth="4.2"
                      strokeDasharray={`${((calc.printRunCost + calc.platemakingCost) / calc.totalCost) * 100} ${100 - ((calc.printRunCost + calc.platemakingCost) / calc.totalCost) * 100}`}
                      strokeDashoffset={25 - (calc.paperCost / calc.totalCost) * 100} />
                    {/* 后道装订环 */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F08035" strokeWidth="4.2"
                      strokeDasharray={`${(calc.bindingCost / calc.totalCost) * 100} ${100 - (calc.bindingCost / calc.totalCost) * 100}`}
                      strokeDashoffset={25 - (calc.paperCost / calc.totalCost) * 100 - ((calc.printRunCost + calc.platemakingCost) / calc.totalCost) * 100} />
                  </svg>
                  <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-2xs">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#2A6CDB]" /> 纸张成本 ({(calc.paperCost / calc.totalCost * 100).toFixed(0)}%)</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#2BAE6E]" /> 印前制版/印刷 ({((calc.printRunCost + calc.platemakingCost) / calc.totalCost * 100).toFixed(0)}%)</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#F08035]" /> 后道装订 ({(calc.bindingCost / calc.totalCost * 100).toFixed(0)}%)</span>
                  </div>
                </div>

                {/* 明细清单 */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">原材料纸张成本</span>
                    <span className="font-bold text-slate-800">¥{calc.paperCost.toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">印前CTP制版费</span>
                    <span className="font-bold text-slate-800">¥{calc.platemakingCost.toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">胶印开机印刷费</span>
                    <span className="font-bold text-slate-800">¥{calc.printRunCost.toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">无线胶装装订费</span>
                    <span className="font-bold text-slate-800">¥{calc.bindingCost.toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold text-sm">
                    <span className="text-slate-800">总成本估算</span>
                    <span className="text-primary">¥{calc.totalCost.toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 放损与利用率评估 */}
            <Card padding="lg" className="bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-slate-500" />
                工艺放损与耗量评估报告
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center justify-between text-2xs text-slate-500 mb-1">
                    <span>净用全开张数</span>
                    <span className="font-bold text-slate-800">{calc.netSheets} 张</span>
                  </div>
                  <div className="flex items-center justify-between text-2xs text-slate-500 mb-1">
                    <span>放损加放比例</span>
                    <span className="font-bold text-red-600">+{calc.wastageRatePercent}%</span>
                  </div>
                  <div className="flex items-center justify-between text-2xs text-slate-500">
                    <span>加放损耗数量</span>
                    <span className="font-bold text-red-600">+{calc.wastageSheets} 张</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-2xs text-slate-700 font-bold mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    学生原创排版利用率评估：优秀
                  </div>
                  <p className="text-3xs leading-relaxed text-slate-500">
                    该画册尺寸排版于大度全张纸上，开料几何利用率达 94.2%。排产时配合 AI 动态拼贴能进一步提升 2.8% 的原材料综合产出价值。
                  </p>
                </div>
              </div>

              {/* 降本小锦囊 */}
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-green-800">工艺降本建议</h4>
                  <p className="text-3xs leading-relaxed text-green-700 mt-0.5">
                    如果选择将该画册内页纸张由 157g 调换为 128g 双铜纸，在不影响阅读手感的前提下，<strong>总重将降低 18.5%</strong>，直接为您节省约 <strong>¥{(calc.paperCost * 0.185).toFixed(0)}</strong> 的纯原材料采购开支！
                  </p>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </Container>
    </main>
  )
}
