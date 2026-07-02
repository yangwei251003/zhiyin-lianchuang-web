'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* 深色工业背景 */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1A3A8C 50%, #0E2040 100%)' }}
      />

      {/* 工业网格 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 光晕装饰 */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(42,108,219,0.3) 0%, transparent 70%)', filter: 'blur(4px)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.2) 0%, transparent 70%)', filter: 'blur(4px)' }}
      />

      {/* CMYK 底部装饰条 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #00B4D8, #D62246, #F5C518, #2A6CDB)' }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.19,1,0.22,1] }}
        >
          {/* 标签 */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: 'rgba(42,108,219,0.2)',
              border: '1px solid rgba(42,108,219,0.3)',
              color: '#7BA6F0',
            }}
          >
            <Sparkles className="h-4 w-4" />
            加入智印联创生态
          </div>

          {/* 主标题 */}
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            让每一笔印刷交易
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #4A85E6 0%, #00B4D8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              更高效 · 更透明 · 更省钱
            </span>
          </h2>

          {/* 副标题 */}
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
            加入 2000+ 印刷企业共同选择的协同平台，
            立即开启您的数字化升级之旅
          </p>

          {/* CTA 按钮组 */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-primary shadow-lg transition-all duration-base hover:-translate-y-1 hover:shadow-xl sm:w-auto"
            >
              免费注册入驻
              <ArrowRight className="h-5 w-5 transition-transform duration-fast group-hover:translate-x-1" />
            </Link>
            <Link
              href="/orders"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/8 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-base hover:-translate-y-0.5 hover:bg-white/12 hover:border-white/40 sm:w-auto"
            >
              浏览订单大厅
            </Link>
          </div>

          {/* 信任文案 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/45">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-environment" />
              免费注册
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
              极速认证
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cmyk-cyan" />
              安全保障
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
