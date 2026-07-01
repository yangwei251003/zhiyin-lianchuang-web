import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { InvestmentCalculator } from '@/components/startup/InvestmentCalculator'

export const metadata: Metadata = {
  title: '投资计算器 · 智印联创',
  description: '一键测算印刷创业投资：设备购置、场地租金、原材料、人员工资、回本周期。',
}

// 投资计算器页（服务端组件）
// 计算器为只读工具，开放访问，无需登录
export default async function CalculatorPage() {
  return (
    <main className="pb-12">
      {/* ===== 页头 ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #7C3AED 0%, #6D28D9 55%, #5B21B6 100%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
          }}
        />
        <Container className="relative py-10 sm:py-12">
          <nav
            className="mb-3 text-xs text-white/70"
            aria-label="面包屑"
          >
            <Link href="/" className="hover:text-white">
              首页
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/startup" className="hover:text-white">
              创业孵化
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">投资计算器</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <Calculator className="h-7 w-7" />
            投资计算器
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            选择设备类型、规模、城市与员工人数，一键测算创业总投入与回本周期
          </p>
        </Container>
      </section>

      {/* ===== 计算器主体 ===== */}
      <Container size="lg" className="mt-6">
        <InvestmentCalculator />
      </Container>
    </main>
  )
}
