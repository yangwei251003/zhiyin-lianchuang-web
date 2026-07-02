import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { ModalProvider } from '@/components/providers/ModalProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: {
    default: '智印联创 · 印刷产业 AI 协同平台',
    template: '%s · 智印联创',
  },
  description: '智印联创 — 印刷行业领先的 AI 智能撮合与纸价预测平台。汇聚订单撮合、集中采购、创业孵化、AI纸价预测四大核心能力，连接印刷产业上下游，驱动数字化转型与智能制造升级。',
  keywords: ['印刷平台', 'AI印刷', '智印联创', '纸价预测', '印刷订单', '集采商城', '印刷供应链', '数字印刷', '智能制造'],
  authors: [{ name: '智印联创' }],
  creator: '智印联创',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: '智印联创 · 印刷产业 AI 协同平台',
    description: '印刷行业领先的AI智能撮合与纸价预测平台，连接印刷产业上下游',
    siteName: '智印联创',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <ToastProvider>
            <ModalProvider>
              <Header />
              <main className="flex-1 pb-14 md:pb-0">{children}</main>
              <Footer />
              <BottomNav />
            </ModalProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
