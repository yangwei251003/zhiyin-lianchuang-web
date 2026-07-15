'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

// ===== 类型定义 =====
type ChatRole = 'user' | 'assistant'

interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  // 是否正在流式接收（用于显示 typing 指示器）
  streaming?: boolean
  // 是否为兜底回复
  fallback?: boolean
}

interface IncomingMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// SSE 流中的一帧（智谱格式）
interface ZhipuStreamChunk {
  choices?: Array<{
    delta?: { role?: string; content?: string }
    finish_reason?: string | null
  }>
}

// ===== 快捷问题 =====
const QUICK_QUESTIONS = [
  '铜版纸最近价格走势如何？',
  '小型印刷厂如何起步？',
  '集采参团有什么技巧？',
  '白卡纸和双胶纸怎么选？',
  '印刷创业初期如何控制成本？',
  '当前纸价适合囤货吗？',
]

// 生成唯一消息 id
function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ===== 主组件 =====
export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // 用 ref 保存当前流式消息 id，避免闭包陈旧
  const streamingIdRef = useRef<string | null>(null)
  // 中断控制器
  const abortRef = useRef<AbortController | null>(null)

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 组件卸载时中断请求
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  // textarea 自适应高度
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [input])

  // 解析智谱 SSE 增量并追加到当前 AI 消息
  const appendDelta = useCallback((delta: string) => {
    const id = streamingIdRef.current
    if (!id || !delta) return
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, content: m.content + delta } : m,
      ),
    )
  }, [])

  // 发送消息核心逻辑
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) return

      setError(null)
      setInput('')

      // 1. 组装历史消息（含本次用户输入）
      const userMessage: ChatMessage = {
        id: genId(),
        role: 'user',
        content: trimmed,
      }
      const assistantMessage: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: '',
        streaming: true,
      }
      streamingIdRef.current = assistantMessage.id

      // 历史消息发给 API（不含空 assistant 占位）
      const historyForApi: IncomingMessage[] = [
        ...messages
          .filter((m) => m.content.trim().length > 0)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: trimmed },
      ]

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setIsStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyForApi }),
          signal: controller.signal,
        })

        const contentType = response.headers.get('Content-Type') || ''

        if (!response.ok) {
          throw new Error(`接口异常 (${response.status})`)
        }

        // 2. 流式 SSE 响应
        if (
          contentType.includes('text/event-stream') &&
          response.body
        ) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            // 按行分割，保留最后不完整的行
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const rawLine of lines) {
              const line = rawLine.trim()
              if (!line || line.startsWith(':')) continue // 跳过空行与注释
              if (!line.startsWith('data:')) continue
              const data = line.slice(5).trim()
              if (data === '[DONE]') continue
              try {
                const chunk = JSON.parse(data) as ZhipuStreamChunk
                const delta = chunk.choices?.[0]?.delta?.content
                if (delta) appendDelta(delta)
              } catch {
                // 忽略单帧解析错误
              }
            }
          }

          // 流结束，标记 streaming=false；若内容为空则兜底提示
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantMessage.id) return m
              const isEmpty = !m.content.trim()
              return {
                ...m,
                streaming: false,
                content: isEmpty
                  ? '抱歉，我暂时没有收到有效回复，请稍后重试。'
                  : m.content,
                fallback: isEmpty,
              }
            }),
          )
        } else {
          // 3. 兜底：JSON 响应
          const data = (await response.json().catch(() => null)) as {
            content?: string
            success?: boolean
          } | null
          const content = data?.content?.trim() || ''
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    streaming: false,
                    content:
                      content ||
                      '抱歉，AI 服务暂时不可用，请稍后重试。',
                    fallback: !content ? true : undefined,
                  }
                : m,
            ),
          )
        }
      } catch (err) {
        // 客户端中断不提示错误
        if (err instanceof DOMException && err.name === 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    streaming: false,
                    content:
                      m.content.trim() ||
                      '（已停止生成）',
                  }
                : m,
            ),
          )
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    streaming: false,
                    content:
                      '抱歉，AI 服务暂时不可用，请稍后重试。你可以先前往其他栏目查看内容。',
                    fallback: true,
                  }
                : m,
            ),
          )
          setError('AI 服务连接失败，已显示兜底回复')
        }
      } finally {
        setIsStreaming(false)
        streamingIdRef.current = null
        abortRef.current = null
        // 重新聚焦输入框
        requestAnimationFrame(() => textareaRef.current?.focus())
      }
    },
    [appendDelta, isStreaming, messages],
  )

  // 点击快捷问题
  const handleQuickQuestion = useCallback(
    (q: string) => {
      void sendMessage(q)
    },
    [sendMessage],
  )

  // 输入框回车发送
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void sendMessage(input)
      }
    },
    [input, sendMessage],
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    [],
  )

  // 停止生成
  const handleStop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[560px] flex-col overflow-hidden rounded-xl border border-line bg-white shadow-md">
      {/* ===== 顶部标题栏（蓝紫渐变） ===== */}
      <header
        className="relative overflow-hidden px-5 py-4"
        style={{
          background:
            'linear-gradient(135deg, #2A6CDB 0%, #5B5CD9 55%, #8B5CF6 100%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Bot className="h-5 w-5 text-white" />
          </span>
          <div className="flex-1">
            <h1 className="text-base font-bold text-white sm:text-lg">
              智印大脑
            </h1>
            <p className="text-xs text-white/70">
              印刷行业 AI 智能助手
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-2xs font-medium text-white backdrop-blur-sm">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success-light" />
            在线
          </span>
        </div>
      </header>

      {/* ===== 消息列表区 ===== */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
      >
        <div className="mx-auto w-full max-w-3xl space-y-4">
          {/* 空状态：欢迎语 + 快捷问题 */}
          {!hasMessages && (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-blue"
                style={{
                  background:
                    'linear-gradient(135deg, #2A6CDB 0%, #5B5CD9 55%, #8B5CF6 100%)',
                }}
              >
                <Sparkles className="h-7 w-7 text-white" />
              </span>
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-ink-primary">
                  你好，我是智印大脑
                </h2>
                <p className="max-w-md text-sm text-ink-secondary">
                  印刷行业辅助问答，可解释工艺、材料、采购核对项与产教实践；不生成未经核验的价格或经营成绩。
                </p>
              </div>
              <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickQuestion(q)}
                    disabled={isStreaming}
                    className="group flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-left text-sm text-ink-secondary transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-bg-subtle hover:text-ink-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
                    <span className="flex-1">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 消息气泡 */}
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
                className={cn(
                  'flex w-full gap-3',
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                {/* 头像 */}
                <span
                  className={cn(
                    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm',
                    m.role === 'user'
                      ? 'bg-primary text-white'
                      : 'text-white',
                  )}
                  style={
                    m.role === 'assistant'
                      ? {
                          background:
                            'linear-gradient(135deg, #2A6CDB 0%, #5B5CD9 55%, #8B5CF6 100%)',
                        }
                      : undefined
                  }
                >
                  {m.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </span>

                {/* 气泡内容 */}
                <div
                  className={cn(
                    'flex max-w-[85%] flex-col gap-1',
                    m.role === 'user' ? 'items-end' : 'items-start',
                  )}
                >
                  <div
                    className={cn(
                      'whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-primary text-white'
                        : 'rounded-tl-sm border border-line bg-white text-ink-primary',
                    )}
                  >
                    {m.content ? (
                      m.content
                    ) : m.streaming ? (
                      <TypingIndicator />
                    ) : null}
                  </div>
                  {m.fallback && (
                    <span className="px-1 text-2xs text-ink-tertiary">
                      兜底回复 · AI 服务暂不可用
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== 错误提示 ===== */}
      {error && (
        <div className="border-t border-line bg-danger-bg px-4 py-2 text-center text-xs text-danger sm:px-6">
          {error}
        </div>
      )}

      {/* ===== 输入区 ===== */}
      <div className="border-t border-line bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
          <div className="flex flex-1 items-end rounded-xl border border-line bg-canvas px-3 py-2 transition-all duration-fast ease-out-expo focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="输入你的问题，Enter 发送，Shift+Enter 换行"
              className="max-h-[140px] flex-1 resize-none bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
              disabled={isStreaming}
            />
          </div>
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink-secondary transition-colors hover:bg-canvas"
            >
              停止
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void sendMessage(input)}
              disabled={!input.trim()}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-white shadow-blue transition-all duration-fast ease-out-expo hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">发送</span>
            </button>
          )}
        </div>
        <p className="mx-auto mt-2 max-w-3xl px-1 text-center text-2xs text-ink-tertiary">
          AI 回复由 GLM-4.7-Flash 生成，仅供参考，请结合实际判断
        </p>
      </div>
    </div>
  )
}

// Typing 指示器（三点跳动）
function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="正在输入">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-ink-tertiary"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  )
}
