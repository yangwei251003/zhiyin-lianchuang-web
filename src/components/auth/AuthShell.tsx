import type { ReactNode } from 'react'
import Image from 'next/image'

interface AuthShellProps {
  children: ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="flex min-h-[calc(100vh-4.25rem)] items-stretch">
      {/* ===== 左侧品牌装饰区（桌面） ===== */}
      <aside
        className="relative hidden w-1/2 overflow-hidden md:flex flex-col justify-between p-12"
      >
        {/* 背景视觉图片 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/auth_side.jpg"
            alt="工业印刷 AI 平台"
            fill
            priority
            className="object-cover"
          />
          {/* 暗色偏蓝遮罩：确保文字识别度 */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(6,16,32,0.85) 0%, rgba(13,26,48,0.7) 100%)',
            }}
          />
        </div>

        {/* 工业网格 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* 顶部 Logo (一致的视觉样式) */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div
            className="relative h-9 w-9 overflow-hidden rounded-lg"
            style={{ background: 'linear-gradient(135deg, #1A75E8, #0D4FC4)' }}
          >
            <div className="absolute bottom-1 left-1 h-3 w-3 rounded-full bg-[#2BAE6E] opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-black text-white leading-none" style={{ letterSpacing: '-0.03em' }}>智</span>
            </div>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">智印联创</span>
        </div>

        {/* 主标语 & 品牌叙事 */}
        <div className="relative z-10 max-w-md my-auto">
          <span
            className="inline-flex rounded-full px-3 py-1 text-2xs font-semibold uppercase tracking-wider mb-4"
            style={{
              background: 'rgba(42,108,219,0.25)',
              border: '1px solid rgba(42,108,219,0.35)',
              color: '#7BA6F0',
            }}
          >
            Industrial AI Ecosystem
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white xl:text-4xl">
            连接印刷全产业链
            <br />
            开启数字智造新时代
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            汇聚智能订单匹配、集中采购商城、AI 纸价大盘预测以及创业孵化服务，
            通过全流程数字化协同，帮助印刷行业上下游降低成本、提升效率、绿色低碳发展。
          </p>

          {/* 三大价值色条 */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            <ValuePill color="#2A6CDB" label="经济价值" />
            <ValuePill color="#2BAE6E" label="环境价值" />
            <ValuePill color="#F08035" label="社会价值" />
          </div>
        </div>

        {/* 底部版权 */}
        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} 智印联创 · 推动印刷产业高质量协同
        </p>
      </aside>

      {/* ===== 右侧表单区 ===== */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 bg-white/50 backdrop-blur-lg">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  )
}

function ValuePill({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-2xs font-semibold text-white/95 border border-white/10 backdrop-blur-sm transition-all duration-base hover:bg-white/15">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  )
}

