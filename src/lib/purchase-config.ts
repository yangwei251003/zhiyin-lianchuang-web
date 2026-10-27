// 集采模块共享选项配置
// 供集采商城列表/详情/历史/我的集采复用，避免在各页面重复硬编码
import type { BadgeVariant } from '@/components/ui/Badge'
import type { StatusOption } from '@/lib/order-config'

// ===== 集采活动状态 =====
// active=进行中 / ended=已结束 / cancelled=已取消
export const PURCHASE_STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'ended', label: '已结束' },
  { value: 'cancelled', label: '已取消' },
]

export const PURCHASE_STATUS_LABEL: Record<string, string> = {
  active: '进行中',
  ended: '已结束',
  cancelled: '已取消',
}

// 品牌色映射：进行中=蓝 / 已结束=灰 / 已取消=红
export const PURCHASE_STATUS_VARIANT: Record<string, BadgeVariant> = {
  active: 'primary',
  ended: 'default',
  cancelled: 'danger',
}

// 状态左侧色块（卡片用）
export const PURCHASE_STATUS_BAR: Record<string, string> = {
  active: 'bg-primary',
  ended: 'bg-ink-tertiary',
  cancelled: 'bg-danger',
}

// ===== 集采订单状态 =====
// 历史表沿用 purchase_orders 名称，但当前产品语义为采购意向沟通，不含站内支付。
export const PURCHASE_ORDER_STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待沟通' },
  { value: 'paid', label: '已确认' },
  { value: 'shipped', label: '已安排' },
  { value: 'completed', label: '已完成' },
]

export const PURCHASE_ORDER_STATUS_LABEL: Record<string, string> = {
  pending: '待沟通',
  paid: '已确认',
  shipped: '已安排',
  completed: '已完成',
}

export const PURCHASE_ORDER_STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending: 'warning',
  paid: 'primary',
  shipped: 'warning',
  completed: 'success',
}

// ===== 工具函数 =====
// 格式化金额（千分位）
export function formatPrice(value: number): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// 计算集采进度百分比（0~100，保留 1 位小数）
export function calcProgress(
  current: number,
  target: number,
): number {
  if (target <= 0) return 0
  const pct = (current / target) * 100
  return Math.min(100, Math.max(0, Number(pct.toFixed(1))))
}
