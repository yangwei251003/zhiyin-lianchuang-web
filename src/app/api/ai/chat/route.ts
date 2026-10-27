import { type NextRequest } from 'next/server'
import { zhipuChatStream, type ZhipuMessage } from '@/lib/ai/zhipu'
import { getChatFallback } from '@/lib/ai/fallback'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// AI 对话 API（流式 SSE）
// 接收 { messages: [{role, content}] }
// 成功：返回 SSE 流（透传智谱原始 SSE）
// 失败：返回 JSON { success, content, fallback }

interface ChatRequestBody {
  messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
}

const SYSTEM_PROMPT =
  '你是“智印大脑”，提供印刷工艺、纸张选购、采购核对项与产教实践辅助问答。回复用中文，简洁专业。不得编造市场价格、未来数值预测、合作案例或经营成绩；涉及纸价时必须提示用户以页面中已核验的来源、规格、区域、时间和供应商正式报价为准。'

export async function POST(request: NextRequest) {
  let body: ChatRequestBody = {}
  try {
    body = (await request.json()) as ChatRequestBody
  } catch {
    body = {}
  }

  const incomingMessages = Array.isArray(body.messages) ? body.messages : []
  // 过滤无效消息并限制历史长度（节约 token）
  const validMessages: ZhipuMessage[] = incomingMessages
    .filter((m) => m && typeof m.content === 'string' && m.content.trim())
    .slice(-10)
    .map((m) => ({
      role: m.role,
      content: m.content,
    }))

  if (validMessages.length === 0) {
    return Response.json(
      {
        success: false,
        content: '请输入你的问题。',
        fallback: true,
      },
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    const stream = await zhipuChatStream({
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...validMessages],
      temperature: 0.7,
      maxTokens: 1024,
    })

    // 透传智谱原始 SSE 流
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch {
    // 兜底：返回非流式 JSON
    const lastMessage = validMessages[validMessages.length - 1]?.content || ''
    const fallback = getChatFallback(lastMessage)
    return Response.json(
      {
        success: true,
        content: fallback,
        fallback: true,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )
  }
}
