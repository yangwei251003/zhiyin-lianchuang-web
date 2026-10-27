'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, FileText, HelpCircle, Layers, Settings } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'

const PAPER_SPECS = [
  { value: 'd16', label: '大度 16 开（画册 A4 尺寸）', sheetArea: 1.0615, pagesPerSheet: 32, sheet: '889×1194mm' },
  { value: 'z16', label: '正度 16 开（小 A4 尺寸）', sheetArea: 0.8594, pagesPerSheet: 32, sheet: '787×1092mm' },
  { value: 'd32', label: '大度 32 开（口袋书尺寸）', sheetArea: 1.0615, pagesPerSheet: 64, sheet: '889×1194mm' },
  { value: 'z32', label: '正度 32 开（标准 32 开）', sheetArea: 0.8594, pagesPerSheet: 64, sheet: '787×1092mm' },
]

const WEIGHT_OPTIONS = [80, 105, 128, 157, 200]

export default function WastageCalculatorPage() {
  const [specKey, setSpecKey] = useState('d16')
  const [pages, setPages] = useState(96)
  const [weight, setWeight] = useState(128)
  const [printRun, setPrintRun] = useState(2000)
  const [wastageRate, setWastageRate] = useState(4)
  const [paperPrice, setPaperPrice] = useState('')

  const spec = useMemo(() => PAPER_SPECS.find((item) => item.value === specKey) ?? PAPER_SPECS[0], [specKey])
  const calc = useMemo(() => {
    const sheetsPerCopy = pages / spec.pagesPerSheet
    const netSheets = sheetsPerCopy * printRun
    const extraSheets = netSheets * (wastageRate / 100)
    const totalSheets = netSheets + extraSheets
    const totalWeightTons = (spec.sheetArea * weight * totalSheets) / 1_000_000
    const numericPrice = Number(paperPrice)
    const materialBudget = Number.isFinite(numericPrice) && numericPrice > 0 ? totalWeightTons * numericPrice : null

    return {
      netSheets: Math.ceil(netSheets),
      extraSheets: Math.ceil(extraSheets),
      totalSheets: Math.ceil(totalSheets),
      totalReams: Number((totalSheets / 500).toFixed(2)),
      totalWeightTons: Number(totalWeightTons.toFixed(4)),
      materialBudget,
    }
  }, [pages, paperPrice, printRun, spec, wastageRate, weight])

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-16">
      <section className="border-b border-[#E5E7EB] bg-[#1E3A5F] py-10 text-white">
        <Container>
          <Link href="/startup/calculator" className="inline-flex items-center gap-1 text-xs text-[#D6E5F0] hover:text-white">
            <ArrowLeft className="size-3.5" />返回计算器选择
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <Calculator className="size-7" />
            <div>
              <p className="text-xs font-medium text-[#D6E5F0]">教学与前期估算工具</p>
              <h1 className="text-2xl font-bold">纸张用量测算</h1>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#D6E5F0]">按自填参数估算画册用纸量。未接入或推算纸价；材料预算仅在你输入已有报价后计算。</p>
        </Container>
      </section>

      <Container className="mt-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-5 lg:col-span-5" aria-label="测算参数">
            <Card padding="md" className="border border-[#E5E7EB] bg-white shadow-none">
              <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <Settings className="size-4 text-[#1E3A5F]" />
                <h2 className="text-sm font-bold text-[#1F2937]">输入参数</h2>
              </div>
              <div className="mt-5 space-y-5">
                <label className="block text-sm font-medium text-[#374151]">画册开本规格
                  <select value={specKey} onChange={(event) => setSpecKey(event.target.value)} className="mt-2 w-full rounded-sm border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm">
                    {PAPER_SPECS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <span className="mt-1 block text-xs text-[#6B7280]">按 {spec.sheet} 全张纸计算</span>
                </label>
                <fieldset><legend className="text-sm font-medium text-[#374151]">纸张克重</legend><div className="mt-2 grid grid-cols-5 gap-2">
                  {WEIGHT_OPTIONS.map((item) => <button key={item} type="button" onClick={() => setWeight(item)} className={`min-h-10 rounded-sm border text-sm font-medium ${weight === item ? 'border-[#1E3A5F] bg-[#EEF3F8] text-[#1E3A5F]' : 'border-[#D1D5DB] bg-white text-[#374151]'}`}>{item}g</button>)}
                </div></fieldset>
                <label className="block text-sm font-medium text-[#374151]">内页数（P）<input type="number" min="4" step="4" value={pages} onChange={(event) => setPages(Math.max(4, Number(event.target.value) || 4))} className="mt-2 w-full rounded-sm border border-[#D1D5DB] px-3 py-2.5 text-sm" /></label>
                <label className="block text-sm font-medium text-[#374151]">印数（册）<input type="number" min="1" step="100" value={printRun} onChange={(event) => setPrintRun(Math.max(1, Number(event.target.value) || 1))} className="mt-2 w-full rounded-sm border border-[#D1D5DB] px-3 py-2.5 text-sm" /></label>
                <label className="block text-sm font-medium text-[#374151]">计划加放率（%）<input type="number" min="0" max="100" step="0.1" value={wastageRate} onChange={(event) => setWastageRate(Math.min(100, Math.max(0, Number(event.target.value) || 0)))} className="mt-2 w-full rounded-sm border border-[#D1D5DB] px-3 py-2.5 text-sm" /><span className="mt-1 block text-xs text-[#6B7280]">请按实际设备、工艺和供应商建议填写。</span></label>
                <label className="block text-sm font-medium text-[#374151]">已取得的纸张报价（元/吨，选填）<input type="number" min="0" step="1" value={paperPrice} onChange={(event) => setPaperPrice(event.target.value)} placeholder="例如：供应商书面报价" className="mt-2 w-full rounded-sm border border-[#D1D5DB] px-3 py-2.5 text-sm" /><span className="mt-1 block text-xs text-[#6B7280]">本工具不提供市场价格或推荐报价。</span></label>
              </div>
            </Card>
            <Card padding="md" className="border border-[#E5E7EB] bg-white shadow-none"><div className="flex gap-2"><HelpCircle className="mt-0.5 size-4 shrink-0 text-[#1E3A5F]" /><p className="text-xs leading-6 text-[#4B5563]">计算结果为基础数量估算，不包含拼版、纸张纹向、纸张规格差异、停机损耗、印后工艺、税费、运输和交付等因素。请由生产人员复核后使用。</p></div></Card>
          </section>

          <section className="space-y-5 lg:col-span-7" aria-label="测算结果">
            <div className="grid gap-4 sm:grid-cols-3">
              <Result label="预计总用纸量" value={`${calc.totalWeightTons} 吨`} detail={`净用 ${calc.netSheets.toLocaleString('zh-CN')} 张`} />
              <Result label="预计全张纸数" value={`${calc.totalSheets.toLocaleString('zh-CN')} 张`} detail={`约 ${calc.totalReams} 令，含加放`} />
              <Result label="预计加放张数" value={`${calc.extraSheets.toLocaleString('zh-CN')} 张`} detail={`按自填 ${wastageRate}% 加放率`} />
            </div>
            <Card padding="lg" className="border border-[#E5E7EB] bg-white shadow-none">
              <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3"><Layers className="size-4 text-[#1E3A5F]" /><h2 className="text-base font-bold text-[#1F2937]">用纸量明细</h2></div>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <Metric label="单张全开纸面积" value={`${spec.sheetArea} 平方米`} />
                <Metric label="单张可承载内页" value={`${spec.pagesPerSheet} P`} />
                <Metric label="净用全张纸数" value={`${calc.netSheets.toLocaleString('zh-CN')} 张`} />
                <Metric label="加放后全张纸数" value={`${calc.totalSheets.toLocaleString('zh-CN')} 张`} />
                <Metric label="加放后令数" value={`${calc.totalReams} 令`} />
                <Metric label="加放后重量" value={`${calc.totalWeightTons} 吨`} />
              </dl>
            </Card>
            <Card padding="lg" className="border border-[#E5E7EB] bg-white shadow-none"><div className="flex items-center gap-2"><FileText className="size-4 text-[#1E3A5F]" /><h2 className="text-base font-bold text-[#1F2937]">材料预算参考</h2></div>{calc.materialBudget === null ? <p className="mt-3 text-sm leading-6 text-[#4B5563]">尚未填写纸张报价，因此不显示金额。可填入已取得的供应商书面报价进行内部预算。</p> : <p className="mt-3 text-sm leading-6 text-[#4B5563]">按自填报价计算的材料预算约为 <strong className="text-[#1E3A5F]">¥{Math.ceil(calc.materialBudget).toLocaleString('zh-CN')}</strong>。该金额不构成平台报价、采购建议或交易承诺。</p>}</Card>
          </section>
        </div>
      </Container>
    </main>
  )
}

function Result({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="border border-[#E5E7EB] bg-white p-5"><p className="text-sm text-[#6B7280]">{label}</p><p className="mt-2 text-2xl font-bold text-[#1E3A5F]">{value}</p><p className="mt-2 text-xs text-[#6B7280]">{detail}</p></div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-[#E5E7EB] pb-3"><dt className="text-[#6B7280]">{label}</dt><dd className="mt-1 font-semibold text-[#1F2937]">{value}</dd></div>
}
