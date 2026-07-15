import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { ModalProvider } from '@/components/providers/ModalProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { MotionProvider } from '@/components/providers/MotionProvider'

export const metadata: Metadata = {
  title: {
    default: '智印联创 · 印刷产业协同服务平台',
    template: '%s · 智印联创',
  },
  description: '智印联创提供印刷供需协同、集中采购、来源标注的纸价情报与产教实践服务。',
  keywords: ['印刷平台', '智印联创', '纸价信息', '印刷订单', '集采商城', '印刷供应链', '数字印刷'],
  authors: [{ name: '智印联创' }],
  creator: '智印联创',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: '智印联创 · 印刷产业协同服务平台',
    description: '提供印刷供需协同、集中采购、纸价情报与产教实践服务',
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
        <MotionProvider>
          <AuthProvider>
            <ToastProvider>
              <ModalProvider>
                <Header />
                <div className="flex-1 pb-14 md:pb-0">{children}</div>
                <Footer />
                <BottomNav />
              </ModalProvider>
            </ToastProvider>
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
