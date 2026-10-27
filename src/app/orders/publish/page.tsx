import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { OrderPublishForm } from '@/components/order/OrderPublishForm'

export const metadata: Metadata = {
  title: '发布印刷需求 · 智印联创',
  description: '保存需求草稿，资料完整后公开发布并获取认证印刷厂报价。',
}

// 订单发布页（服务端组件）
// 路由守卫：middleware 已拦截未登录/未认证用户，AuthGuard requireVerified 提供客户端二次校验与加载态
export default function OrderPublishPage() {
  return (
    <main className="pb-12">
      <Container size="md" className="pt-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-sm text-ink-secondary transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          返回订单大厅
        </Link>
        <div className="mt-3 mb-6">
          <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            发布印刷需求
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            可先保存仅自己可见的草稿；公开发布需启用需求方身份并完善个人资料
          </p>
        </div>

        <AuthGuard>
          <OrderPublishForm />
        </AuthGuard>
      </Container>
    </main>
  )
}
