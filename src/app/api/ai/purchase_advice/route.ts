import { type NextRequest, NextResponse } from 'next/server'
import { zhipuChatCompletion, type ZhipuMessage } from '@/lib/ai/zhipu'
import { getPurchaseAdviceFallback } from '@/lib/ai/fallback'

// 集采采购建议 API
// 适配前端 AIPurchaseAdvice 组件实际发送的蛇形字段
// 返回 { action: 'buy'|'wait'|'ended', title, reason, confidence, fallback }

interface PurchaseAdviceRequestBody {
  purchase_id?: string
  unit_price?: number
  min_quantity?: number
  target_quantity?: number
  current_quantity?: number
  end_time?: string
  status?: string
  // 兼容任务描述的驼峰字段
  productName?: string
  unitPrice?: number
  progress?: number
  daysLeft?: number
  currentQuantity?: number
  targetQuantity?: number
}

function calcProgress(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(100, Math.max(0, (current / target) * 100))
}

function calcDaysLeft(endTime: string): number {
  const endMs = new Date(endTime).getTime()
  if (Number.isNaN(endMs)) return 0
  const remainMs = endMs - Date.now()
  return Math.max(0, remainMs / 86_400_000)
}

export async function POST(request: NextRequest) {
  let body: PurchaseAdviceRequestBody = {}
  try {
    body = (await request.json()) as PurchaseAdviceRequestBody
  } catch {
    body = {}
  }

  // 统一字段：优先蛇形（实际组件），回退驼峰（任务描述）
  const unitPrice = body.unit_price ?? body.unitPrice ?? 0
  const targetQuantity = body.target_quantity ?? body.targetQuantity ?? 0
  const currentQuantity =
    body.current_quantity ?? body.currentQuantity ?? 0
  const status = body.status ?? 'active'

  const progress =
    typeof body.progress === 'number'
      ? body.progress
      : calcProgress(currentQuantity, targetQuantity)

  const daysLeft =
    typeof body.daysLeft === 'number'
      ? body.daysLeft
      : body.end_time
        ? calcDaysLeft(body.end_time)
        : 0

  try {
    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content:
          '你是印刷行业集采采购顾问。根据集采活动进度、剩余时间、目标量与当前量，给出明确的采购建议（buy=建议采购 / wait=建议观望）与理由。回复用 JSON 格式：{"action":"buy|wait","title":"一句话结论","reason":"详细理由","confidence":0到100的整数}。只返回 JSON，不要额外解释。',
      },
      {
        role: 'user',
        content: `集采活动信息：
单价：${unitPrice} 元
目标量：${targetQuantity}
当前参团量：${currentQuantity}
集采进度：${progress.toFixed(1)}%
剩余天数：${daysLeft.toFixed(1)} 天
活动状态：${status}

请给出采购建议（JSON 格式）。`,
      },
    ]

    const result = await zhipuChatCompletion({
      messages,
      temperature: 0.4,
      maxTokens: 400,
    })

    const content = result.content?.trim()
    // 尝试从 AI 回复中提取 JSON
    const jsonMatch = content
      ? content.match(/\{[\s\S]*\}/)
      : null
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as {
          action?: string
          title?: string
          reason?: string
          confidence?: number
        }
        const action =
          parsed.action === 'buy' || parsed.action === 'wait'
            ? parsed.action
            : parsed.action === 'ended'
              ? 'ended'
              : 'wait'
        return NextResponse.json({
          success: true,
          action,
          title: parsed.title || (action === 'buy' ? '建议采购' : '建议观望'),
          reason: parsed.reason || '基于当前活动数据综合判断。',
          confidence:
            typeof parsed.confidence === 'number'
              ? Math.min(100, Math.max(0, Math.round(parsed.confidence)))
              : 80,
          fallback: false,
        })
      } catch {
        // JSON 解析失败，走兜底
      }
    }
    throw new Error('Invalid AI response format')
  } catch {
    // 兜底：结构化建议
    const fallback = getPurchaseAdviceFallback({
      progress,
      daysLeft,
      status,
      unitPrice,
      targetQuantity,
      currentQuantity,
    })
    return NextResponse.json({
      success: true,
      action: fallback.action,
      title: fallback.title,
      reason: fallback.reason,
      confidence: fallback.confidence,
      fallback: true,
    })
  }
}
