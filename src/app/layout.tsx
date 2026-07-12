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
    default: '智印联创 · 印刷产业协同服务平台',
    template: '%s · 智印联创',
  },
  description: '智印联创提供印刷需求撮合、采购意向沟通、来源标注的纸价信息与创业孵化服务。',
  keywords: ['印刷平台', '智印联创', '纸价信息', '印刷订单', '集采商城', '印刷供应链', '数字印刷'],
  authors: [{ name: '智印联创' }],
  creator: '智印联创',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: '智印联创 · 印刷产业协同服务平台',
    description: '提供印刷需求撮合、采购意向沟通、纸价信息与创业孵化服务',
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
