'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Gavel, LogIn, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OrderBidModal } from './OrderBidModal'

export interface OrderDetailActionsProps {
  orderId: string
  /** 订单状态，cancelled/completed 状态不可投标 */
  orderStatus: string
  /** 是否已登录（服务端预判，避免水合前闪烁） */
  isLoggedIn: boolean
  /** 是否为订单发布者 */
  isOwner: boolean
}

// 订单详情页行动按钮 + 投标弹窗（客户端组件）
// 集成 OrderBidModal，提交成功后 router.refresh() 刷新报价列表
export function OrderDetailActions({
  orderId,
  orderStatus,
  isLoggedIn,
  isOwner,
}: OrderDetailActionsProps) {
  const router = useRouter()
  const [bidOpen, setBidOpen] = useState(false)

  // 已取消 / 已完成的订单不可投标
  const canBid =
    orderStatus !== 'cancelled' && orderStatus !== 'completed'

  const handleBidSuccess = () => {
    // 重新拉取服务端数据，刷新报价列表
    router.refresh()
  }

  // 发布者视角：修改 / 取消（可选实现，仅展示入口）
  if (isOwner) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          leftIcon={<Settings2 className="h-4 w-4" />}
          onClick={() => router.push(`/orders/${orderId}/edit`)}
          disabled={orderStatus !== 'draft'}
          title={orderStatus === 'draft' ? '继续编辑草稿' : '公开需求暂不支持直接修改'}
        >
          {orderStatus === 'draft' ? '继续编辑草稿' : '修改需求'}
        </Button>
        <span className="text-xs text-ink-tertiary">
          这是您发布的订单
        </span>
      </div>
    )
  }

  // 未登录用户：引导登录
  if (!isLoggedIn) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/login?from=${encodeURIComponent(`/orders/${orderId}`)}`}>
          <Button leftIcon={<LogIn className="h-4 w-4" />}>
            登录后可投标
          </Button>
        </Link>
        <span className="text-xs text-ink-tertiary">
          登录并完成企业认证后即可参与报价
        </span>
      </div>
    )
  }

  // 已登录非发布者：立即投标
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        size="lg"
        leftIcon={<Gavel className="h-4 w-4" />}
        onClick={() => setBidOpen(true)}
        disabled={!canBid}
      >
        {canBid ? '立即投标' : '该订单不可投标'}
      </Button>
      {canBid && (
        <span className="text-xs text-ink-tertiary">
          提交报价后，需求方将收到您的报价信息
        </span>
      )}

      <OrderBidModal
        orderId={orderId}
        open={bidOpen}
        onClose={() => setBidOpen(false)}
        onSuccess={handleBidSuccess}
      />
    </div>
  )
}
