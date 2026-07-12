// 消息发送工具函数
// 供服务端和客户端组件调用，统一消息创建入口
// 所有触发消息的业务动作（发布订单、提交报价、加入集采等）都通过此模块

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type MessageInsert = Database['public']['Tables']['messages']['Insert']
type MessageType = Database['public']['Tables']['messages']['Row']['type']

export interface SendMessageParams {
  userId: string
  type: MessageType
  title: string
  content: string
  link?: string
}

/**
 * 向单个用户发送一条系统消息
 */
export async function sendMessage(
  supabase: SupabaseClient<Database>,
  params: SendMessageParams,
): Promise<void> {
  const insert: MessageInsert = {
    user_id: params.userId,
    type: params.type,
    title: params.title,
    content: params.content,
    link: params.link ?? null,
    is_read: false,
  }
  const { error } = await supabase.from('messages').insert(insert)
  if (error) {
    // 消息发送失败不应该阻断主流程，仅打印错误
    console.error('[sendMessage] failed:', error.message)
  }
}

/**
 * 批量向多个用户发送消息
 */
export async function sendMessages(
  supabase: SupabaseClient<Database>,
  params: SendMessageParams[],
): Promise<void> {
  if (params.length === 0) return
  const inserts: MessageInsert[] = params.map((p) => ({
    user_id: p.userId,
    type: p.type,
    title: p.title,
    content: p.content,
    link: p.link ?? null,
    is_read: false,
  }))
  const { error } = await supabase.from('messages').insert(inserts)
  if (error) {
    console.error('[sendMessages] failed:', error.message)
  }
}

// ─── 预设消息模板 ──────────────────────────────────────────────────────────────

/**
 * 欢迎消息：用户注册成功后发送
 */
export function welcomeMessage(userId: string): SendMessageParams {
  return {
    userId,
    type: 'system',
    title: '欢迎加入智印联创',
    content:
      '欢迎注册智印联创。您可以浏览公开需求、提交报价沟通、登记采购意向，并查看已标注来源的纸价信息。请按需完善企业资料。',
    link: '/mine/auth',
  }
}

/**
 * 订单发布成功通知（发给订单发布者自己）
 */
export function orderPublishedMessage(
  userId: string,
  orderId: string,
  orderTitle: string,
): SendMessageParams {
  return {
    userId,
    type: 'order',
    title: '订单发布成功',
    content: `您的订单《${orderTitle}》已成功发布至订单大厅，等待供应商报价。您可以随时查看报价进度。`,
    link: `/orders/${orderId}`,
  }
}

/**
 * 收到新报价通知（发给订单发布者）
 */
export function newBidReceivedMessage(
  orderOwnerId: string,
  orderId: string,
  orderTitle: string,
  bidPrice: number,
  deliveryDays: number,
): SendMessageParams {
  return {
    userId: orderOwnerId,
    type: 'order',
    title: '您的订单收到新报价',
    content: `您的订单《${orderTitle}》收到一条新报价：¥${bidPrice.toLocaleString('zh-CN')} 元，预计 ${deliveryDays} 天交货。点击查看详情并选择最优方案。`,
    link: `/orders/${orderId}`,
  }
}

/**
 * 报价提交成功通知（发给报价者自己）
 */
export function bidSubmittedMessage(
  bidderId: string,
  orderId: string,
  orderTitle: string,
  bidPrice: number,
): SendMessageParams {
  return {
    userId: bidderId,
    type: 'order',
    title: '报价提交成功',
    content: `您已成功对订单《${orderTitle}》提交报价 ¥${bidPrice.toLocaleString('zh-CN')} 元。请等待需求方审核，您可在"我的报价"中查看进度。`,
    link: `/orders/${orderId}`,
  }
}

/**
 * 报价被接受通知（发给报价者）
 */
export function bidAcceptedMessage(
  bidderId: string,
  orderId: string,
  orderTitle: string,
): SendMessageParams {
  return {
    userId: bidderId,
    type: 'order',
    title: '恭喜！您的报价已被接受',
    content: `需求方已接受您对订单《${orderTitle}》的报价。请尽快联系对方确认生产细节，按时交货。`,
    link: `/orders/${orderId}`,
  }
}

/**
 * 采购意向提交成功通知（发给提交者自己）
 */
export function purchaseJoinedMessage(
  userId: string,
  purchaseId: string,
  purchaseTitle: string,
  quantity: number,
): SendMessageParams {
  return {
    userId,
    type: 'purchase',
    title: '采购意向已提交',
    content: `您已提交《${purchaseTitle}》的采购意向，预计数量 ${quantity}。平台后续将协助建立沟通；价格、供货与交期以双方确认的信息为准。`,
    link: `/purchase/${purchaseId}`,
  }
}

/**
 * 集采达到目标通知（批量发给所有参与者）
 */
export function purchaseTargetReachedMessages(
  userIds: string[],
  purchaseId: string,
  purchaseTitle: string,
): SendMessageParams[] {
  return userIds.map((userId) => ({
    userId,
    type: 'purchase' as MessageType,
    title: '集采目标已达成！',
    content: `集采《${purchaseTitle}》已达到目标认购量，即将进入采购环节！请保持关注，我们将尽快安排统一采购。`,
    link: `/purchase/${purchaseId}`,
  }))
}
