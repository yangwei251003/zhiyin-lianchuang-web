import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { PurchaseDetail } from '@/components/purchase/PurchaseDetail'
import type { Database } from '@/types/database'

type PurchaseRow = Database['public']['Tables']['purchases']['Row']
type PurchaseOrderRow =
  Database['public']['Tables']['purchase_orders']['Row']

interface PurchaseDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return [{ id: '1' }]
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: PurchaseDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: purchase } = await supabase
    .from('purchases')
    .select('title')
    .eq('id', id)
    .maybeSingle()
  if (!purchase) return { title: '活动详情 · 智印联创' }
  return {
    title: `${purchase.title} · 集采详情 · 智印联创`,
    description: `查看 ${purchase.title} 的采购意向信息并提交沟通需求`,
  }
}

// 集采活动详情页（服务端组件）
export default async function PurchaseDetailPage({
  params,
}: PurchaseDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. 获取活动详情
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!purchase) notFound()
  const purchaseRow = purchase as PurchaseRow

  // 2. 检查当前用户是否已提交采购意向（不强制登录）
  const {
    data: { session },
  } = await supabase.auth.getSession()
  let myOrder: PurchaseOrderRow | null = null
  if (session) {
    const { data: orderData } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('purchase_id', id)
      .eq('user_id', session.user.id)
      .maybeSingle()
    myOrder = (orderData as PurchaseOrderRow | null) ?? null
  }

  return (
    <main className="pb-12">
      {/* ===== 面包屑 ===== */}
      <Container className="pt-6">
        <nav
          className="flex items-center gap-1.5 text-xs text-ink-tertiary"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <Link href="/purchase" className="hover:text-primary">
            集采商城
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">活动详情</span>
        </nav>
      </Container>

      <Container size="lg" className="mt-4">
        <PurchaseDetail
          purchase={purchaseRow}
          myOrder={myOrder}
        />
      </Container>
    </main>
  )
}
