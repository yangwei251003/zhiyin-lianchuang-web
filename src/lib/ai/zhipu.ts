// 智谱 GLM-4.7-Flash 服务端客户端封装
// 仅在服务端调用，API Key 不暴露给前端
// 设计要点：
// 1. 非流式请求带 15s 超时（AbortController），超时抛错由路由层兜底
// 2. 流式请求返回智谱原始 SSE body，由路由层透传给前端
// 3. 严格类型，无 any

const ZHIPU_API_URL =
  process.env.ZHIPU_API_URL || 'https://open.bigmodel.cn/api/paas/v4'
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || ''

// 非流式请求超时时间（毫秒）
const REQUEST_TIMEOUT_MS = 15_000
// 流式请求整体超时时间（毫秒）——流式对话允许更长等待
const STREAM_TIMEOUT_MS = 30_000

export type ZhipuRole = 'system' | 'user' | 'assistant'

export interface ZhipuMessage {
  role: ZhipuRole
  content: string
}

export interface ZhipuCompletionOptions {
  messages: ZhipuMessage[]
  temperature?: number // 0-1，默认 0.7
  maxTokens?: number // 默认 1024
  stream?: boolean // 默认 false
}

export interface ZhipuUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface ZhipuCompletionResult {
  content: string
  usage?: ZhipuUsage
}

interface ZhipuChoice {
  message?: { role?: ZhipuRole; content?: string }
}

interface ZhipuCompletionResponse {
  choices?: ZhipuChoice[]
  usage?: ZhipuUsage
}

function ensureApiKey(): void {
  if (!ZHIPU_API_KEY) {
    throw new Error('ZHIPU_API_KEY is not configured')
  }
}

/**
 * 调用智谱 GLM-4.7-Flash 完成对话（非流式）
 * 带 15 秒超时，超时或接口异常时抛错，由调用方兜底
 */
export async function zhipuChatCompletion(
  options: ZhipuCompletionOptions,
): Promise<ZhipuCompletionResult> {
  const { messages, temperature = 0.7, maxTokens = 1024 } = options

  ensureApiKey()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${ZHIPU_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4.7-flash',
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(
        `Zhipu API error ${response.status}: ${errorText.slice(0, 200)}`,
      )
    }

    const data = (await response.json()) as ZhipuCompletionResponse
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 调用智谱 GLM-4.7-Flash 流式对话
 * 返回智谱原始 SSE ReadableStream，由路由层透传给前端
 * 注意：流式请求仅做首字节超时检测，整体由前端读取控制
 */
export async function zhipuChatStream(
  options: ZhipuCompletionOptions,
): Promise<ReadableStream<Uint8Array>> {
  const { messages, temperature = 0.7, maxTokens = 1024 } = options

  ensureApiKey()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${ZHIPU_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4.7-flash',
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }

  if (!response.ok || !response.body) {
    clearTimeout(timeoutId)
    const errorText = await response.text().catch(() => '')
    throw new Error(
      `Zhipu API stream error ${response.status}: ${errorText.slice(0, 200)}`,
    )
  }

  // 流读取结束后清理超时
  const originalBody = response.body
  const wrappedStream = new ReadableStream<Uint8Array>({
    async start(controllerWrap) {
      try {
        const reader = originalBody.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controllerWrap.enqueue(value)
        }
        controllerWrap.close()
      } catch (err) {
        controllerWrap.error(err)
      } finally {
        clearTimeout(timeoutId)
      }
    },
    cancel() {
      clearTimeout(timeoutId)
      void originalBody.cancel()
    },
  })

  return wrappedStream
}
