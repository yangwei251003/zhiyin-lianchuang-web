import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { CapacityPublishForm } from '@/components/order/CapacityPublishForm'

export const metadata: Metadata = {
  title: '发布产能 · 智印联创',
  description: '发布印刷设备闲置产能，精准匹配订单需求。',
}

// 产能发布页（服务端组件）
// 路由守卫：middleware 已拦截未登录/未认证用户，AuthGuard requireVerified 提供客户端二次校验
export default function CapacityPublishPage() {
  return (
    <main className="pb-12">
      <Container size="md" className="pt-6">
        <Link
          href="/orders/capacities"
          className="inline-flex items-center gap-1 text-sm text-ink-secondary transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          返回产能大厅
        </Link>
        <div className="mt-3 mb-6">
          <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
            发布产能
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            发布闲置印刷设备产能，让订单主动找上门
          </p>
        </div>

        <AuthGuard requireVerified>
          <CapacityPublishForm />
        </AuthGuard>
      </Container>
    </main>
  )
}
