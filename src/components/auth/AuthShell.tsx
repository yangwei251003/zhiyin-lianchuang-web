import type { ReactNode } from 'react'
import Image from 'next/image'

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-[calc(100vh-4.25rem)] bg-[#F6F7F8] md:grid-cols-[minmax(320px,.88fr)_minmax(0,1.12fr)]">
      <aside className="relative hidden overflow-hidden border-r border-[#D9DEE6] bg-[#102A43] text-white md:block">
        <Image src="/images/auth_side.jpg" alt="印刷生产与协同场景" fill priority className="object-cover opacity-35" />
        <div className="relative flex min-h-full flex-col justify-between p-10 lg:p-14">
          <div>
            <div className="inline-flex border border-white/30 bg-white px-3 py-2">
              <Image src="/images/zhiyin-logo.png" alt="智印联创" width={160} height={32} className="h-7 w-auto object-contain" />
            </div>
            <p className="mt-16 text-xs font-semibold tracking-[.18em] text-[#F5B45B]">印刷产业协同服务平台</p>
            <h1 className="mt-5 max-w-lg text-4xl font-bold leading-[1.08] tracking-tight lg:text-5xl">从身份建立，进入真实协同</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#DCE6F0]">账号资料、企业认证与业务身份分别核验。需求、报价、供货与采购意向均保留在明确的规则与确认流程中。</p>
          </div>
          <ol className="grid gap-px border border-white/25 bg-white/20 sm:grid-cols-3">
            {['建立账号', '完善主体资料', '进入对应工作台'].map((step, index) => (
              <li key={step} className="bg-[#102A43]/90 p-4">
                <span className="text-xs font-semibold text-[#F5B45B]">0{index + 1}</span>
                <p className="mt-2 text-sm font-bold">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
      <section className="flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  )
}
