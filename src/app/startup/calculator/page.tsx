'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, Wallet, Layers, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { InvestmentCalculator } from '@/components/startup/InvestmentCalculator'

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<'investment' | 'selector'>('selector')

  return (
    <main className="pb-16 bg-slate-50 min-h-screen">
      {/* 页头 */}
      <section
        className="relative overflow-hidden py-12 text-white"
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <Container className="relative">
          <nav className="mb-3 text-xs text-white/70" aria-label="面包屑">
            <Link href="/" className="hover:text-white">首页</Link>
            <span className="mx-1.5">/</span>
            <Link href="/startup" className="hover:text-white">创业孵化</Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">智能测算中心</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <Calculator className="h-7 w-7" />
            数智化测算中心
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80">
            提供创业预算记录与画册用纸量估算。结果仅用于前期测算，实际生产请以工艺单、供应商报价和合同约定为准。
          </p>
        </Container>
      </section>

      <Container className="mt-8">
        {activeTab === 'selector' ? (
          /* 选择面板 */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* 卡片 1: 创业资金计算器 */}
            <div
              onClick={() => setActiveTab('investment')}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-purple-600" />
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-4 transition-transform group-hover:scale-110">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">创业资金投资计算器</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  汇总厂房、设备、原材料和人员等自填预算项目，帮助梳理前期资金准备范围。
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-purple-600">
                立即测算资金 <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* 卡片 2: 纸张损耗测算工装 */}
            <Link
              href="/startup/calculator/wastage"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 transition-transform group-hover:scale-110">
                  <Layers className="h-6 w-6" />
                </div>
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-3xs font-semibold text-blue-600 mb-2">
                  学生专利工装成果
                </span>
                <h3 className="text-lg font-bold text-slate-900">纸张损耗与工艺测算工装</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  根据开本、页数、克重、印数和自填损耗率估算用纸张数、令数及重量；可选填已取得的供应商报价作材料预算参考。
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                立即使用损耗工装 <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

          </div>
        ) : (
          /* 投资计算器主体 */
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab('selector')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              ← 返回选择其他工具
            </button>
            <InvestmentCalculator />
          </div>
        )}
      </Container>
    </main>
  )
}
