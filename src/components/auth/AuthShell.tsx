import type { ReactNode } from 'react'
import { Printer } from 'lucide-react'

interface AuthShellProps {
  /** 右侧表单内容（含标题/副标题/表单） */
  children: ReactNode
}

// 登录 / 注册 / 找回密码 共享的品牌装饰外壳
// 桌面端：左侧品牌色渐变装饰区 + 右侧表单；移动端：仅表单
export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-stretch">
      {/* ===== 左侧品牌装饰区（桌面） ===== */}
      <aside
        className="relative hidden w-1/2 overflow-hidden md:flex"
        style={{
          background:
            'linear-gradient(135deg, #1A4A9C 0%, #2A6CDB 45%, #4A85E6 100%)',
        }}
      >
        {/* 装饰光斑 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(123,166,240,0.25) 0%, transparent 70%)',
          }}
        />
        {/* 细网格纹理 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          {/* 品牌 Logo */}
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Printer className="h-6 w-6 text-white" />
            </span>
            <span className="text-xl font-bold text-white">智印联创</span>
          </div>

          {/* 主标语 */}
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
              印刷行业
              <br />
              AI 智能撮合平台
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              汇聚纸价预测、订单对接、集采拼单、创业孵化，
              让印刷生意更高效、更经济、更可持续。
            </p>

            {/* 三大价值色条 */}
            <div className="mt-8 flex gap-3">
              <ValuePill color="#2A6CDB" label="经济价值" />
              <ValuePill color="#2BAE6E" label="环境价值" />
              <ValuePill color="#F08035" label="社会价值" />
            </div>
          </div>

          {/* 底部版权 */}
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} 智印联创 · 让印刷产业互联互通
          </p>
        </div>
      </aside>

      {/* ===== 右侧表单区 ===== */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  )
}

function ValuePill({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  )
}
