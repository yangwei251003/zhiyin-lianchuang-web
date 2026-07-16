'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Bot,
  ChevronRight,
  Factory,
  FileText,
  History,
  LoaderCircle,
  PackageCheck,
  Pause,
  Play,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  createBrainDraft,
  type PersistedBrainContextKind,
} from '@/lib/brain/workspace'
import type { BrainContextInput, BrainEvidence } from '@/lib/brain/scenario'

type WorkspaceContext = Exclude<BrainContextInput['kind'], 'review'>
type RoleFocus = 'requester' | 'printer' | 'material_supplier'

interface BrainMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  fallback?: boolean
}

interface SavedConversation {
  id: string
  title: string
  context_kind: WorkspaceContext
}

interface SavedDraft {
  id?: string
  contextKind: PersistedBrainContextKind
  title: string
  fields: Record<string, string>
  status: 'needs_confirmation'
}

const CONTEXTS: Record<WorkspaceContext, {
  label: string
  title: string
  description: string
  evidence: BrainEvidence[]
  draftFields?: Record<string, string>
  prompts: string[]
}> = {
  general: {
    label: '协同总览',
    title: '从一条业务线开始梳理',
    description: '选择真实业务场景后，智印大脑只整理已经明确的信息，并把下一步交回给你确认。',
    evidence: [
      { label: '平台定位', value: '连接需求、生产与原料协同', verified: true },
      { label: '操作边界', value: '所有业务写入均须用户确认', verified: true },
    ],
    prompts: ['我应该先补齐哪些印刷需求信息？', '如何在三种角色之间衔接一条业务？'],
  },
  order: {
    label: '供需协同',
    title: '需求信息核对',
    description: '将需求单中的规格、工艺、地区和交期整理为可确认字段，再进入真实发布表单。',
    evidence: [
      { label: '当前场景', value: '公开印刷需求与产能协同', verified: true },
      { label: '发布边界', value: '发布前需完成资料与身份核验', verified: true },
    ],
    draftFields: { category: '印刷品类待确认', craft: '工艺待确认', region: '交付地区待确认' },
    prompts: ['把当前需求整理成一张待确认草稿', '发布印刷需求前还需要核对什么？'],
  },
  purchase: {
    label: '集中采购',
    title: '采购与供货核对',
    description: '用来源、规格、起订条件和交付要求组织采购沟通，不把意向当成交易承诺。',
    evidence: [
      { label: '当前场景', value: '采购意向与供货协同', verified: true },
      { label: '交易边界', value: '价格、供货与交付以双方确认条款为准', verified: true },
    ],
    draftFields: { material: '材料规格待确认', quantity: '采购数量待确认' },
    prompts: ['帮我列出集采前的核对项', '原料供应方案应补齐哪些信息？'],
  },
  price: {
    label: '纸价情报',
    title: '纸价情报与采购辅助',
    description: '只解释已核验公开记录的来源、规格、地区和时间边界，不输出未来价格。',
    evidence: [
      { label: '数据原则', value: '仅使用页面中已核验的公开记录', verified: true },
      { label: '分析边界', value: '不输出实时行情或未来价格预测', verified: true },
    ],
    draftFields: { paperType: '纸种待确认', specification: '规格待确认', region: '地区待确认' },
    prompts: ['我该如何核对一条纸价记录是否可用于采购？', '帮我整理纸张采购的询价清单'],
  },
  education: {
    label: '产教实践',
    title: '真实业务实践拆解',
    description: '把学习任务放回需求、生产和供应链的真实约束中，形成可完成的实践清单。',
    evidence: [
      { label: '实践方向', value: '需求、生产、采购与合规协同', verified: true },
      { label: '学习边界', value: '以课程材料与真实流程核对为准', verified: true },
    ],
    draftFields: { task: '实践任务待确认', deliverable: '交付物待确认' },
    prompts: ['把一个印刷实践任务拆成可执行步骤', '产教实践中应先理解哪些业务角色？'],
  },
}

const ROLE_FOCUS: Record<RoleFocus, { label: string; prompt: string; Icon: typeof FileText }> = {
  requester: { label: '需求方', prompt: '请以需求方视角列出需要确认的规格、交期和沟通信息。', Icon: FileText },
  printer: { label: '印刷厂', prompt: '请以印刷厂视角列出工艺、产能和交付前需要核对的信息。', Icon: Factory },
  material_supplier: { label: '原料供应商', prompt: '请以原料供应商视角列出供货方案需要补齐的信息。', Icon: PackageCheck },
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function BrainWorkbench({ initialContext = 'general' }: { initialContext?: WorkspaceContext }) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()
  const [contextKind, setContextKind] = useState<WorkspaceContext>(initialContext)
  const [roleFocus, setRoleFocus] = useState<RoleFocus>('requester')
  const [messages, setMessages] = useState<BrainMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [draft, setDraft] = useState<SavedDraft | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [history, setHistory] = useState<SavedConversation[]>([])
  const [historyAvailable, setHistoryAvailable] = useState(false)

  const context = CONTEXTS[contextKind]
  const contextInput = useMemo<BrainContextInput>(() => ({
    kind: contextKind,
    title: context.title,
    evidence: context.evidence,
    draftFields: context.draftFields,
  }), [context, contextKind])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion) {
      video?.pause()
      return
    }
    void video.play().catch(() => undefined)
  }, [reducedMotion])

  useEffect(() => {
    let active = true
    void fetch('/api/brain/conversations')
      .then(async (response) => ({ ok: response.ok, status: response.status, data: await response.json() }))
      .then(({ ok, status, data }) => {
        if (!active) return
        if (ok) {
          setHistory(data.conversations ?? [])
          setHistoryAvailable(true)
        } else if (status === 401) {
          setHistoryAvailable(false)
        }
      })
      .catch(() => undefined)
    return () => { active = false }
  }, [])

  function selectContext(next: WorkspaceContext) {
    setContextKind(next)
    setMessages([])
    setDraft(null)
    setConversationId(null)
  }

  async function openConversation(id: string) {
    const response = await fetch(`/api/brain/conversations/${id}`)
    const result = await response.json().catch(() => null) as {
      conversation?: { id: string; context_kind: WorkspaceContext }
      messages?: Array<{ id: string; role: 'user' | 'assistant'; content: string }>
      drafts?: Array<{ id: string; title: string; context_kind: PersistedBrainContextKind; fields: Record<string, string>; status: 'needs_confirmation' | 'confirmed' | 'dismissed' }>
    } | null
    if (!response.ok || !result?.conversation) return
    setConversationId(result.conversation.id)
    setContextKind(result.conversation.context_kind)
    setMessages((result.messages ?? []).map((message) => ({ ...message })))
    const nextDraft = result.drafts?.find((item) => item.status === 'needs_confirmation')
    setDraft(nextDraft ? {
      id: nextDraft.id,
      contextKind: nextDraft.context_kind,
      title: nextDraft.title,
      fields: nextDraft.fields,
      status: 'needs_confirmation',
    } : null)
  }

  async function sendMessage(text: string) {
    const message = text.trim()
    if (!message || sending) return
    const userMessage: BrainMessage = { id: createId('user'), role: 'user', content: message }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setSending(true)

    try {
      const response = await fetch('/api/brain/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context: contextInput, conversationId: conversationId ?? undefined }),
      })
      const result = await response.json() as {
        content?: string
        fallback?: boolean
        conversationId?: string | null
        draft?: { id: string; title: string; status: 'needs_confirmation'; fields: Record<string, string> } | null
        error?: string
      }
      if (!response.ok || !result.content) throw new Error(result.error || '智印大脑暂时不可用。')
      const assistantContent = result.content

      setMessages((current) => [...current, {
        id: createId('assistant'),
        role: 'assistant',
        content: assistantContent,
        fallback: result.fallback,
      }])
      if (result.conversationId) {
        setConversationId(result.conversationId)
        setHistoryAvailable(true)
        void fetch('/api/brain/conversations')
          .then((historyResponse) => historyResponse.ok ? historyResponse.json() : null)
          .then((data) => { if (data?.conversations) setHistory(data.conversations) })
          .catch(() => undefined)
      }
      if (result.draft) {
        setDraft({ contextKind: contextKind as PersistedBrainContextKind, ...result.draft })
      } else {
        const transient = createBrainDraft(contextInput)
        if (transient) setDraft({ ...transient })
      }
    } catch (error) {
      setMessages((current) => [...current, {
        id: createId('assistant'),
        role: 'assistant',
        content: error instanceof Error ? error.message : '智印大脑暂时不可用。',
        fallback: true,
      }])
    } finally {
      setSending(false)
    }
  }

  async function confirmDraft() {
    if (!draft) return
    if (!draft.id) {
      router.push('/login')
      return
    }
    const response = await fetch(`/api/brain/drafts/${draft.id}/confirm`, { method: 'POST' })
    const result = await response.json().catch(() => null) as { target?: string } | null
    if (response.ok && result?.target) router.push(result.target)
  }

  return (
    <main className="min-h-screen bg-[#F6F7F8] pb-14 text-[#172033]">
      <section className="border-b border-[#D9DEE6] bg-[#102A43] text-white">
        <div className="relative mx-auto min-h-[430px] max-w-7xl overflow-hidden lg:min-h-[460px]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            muted loop playsInline poster="/images/external/press-studio.jpg"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
            aria-label="印刷生产现场"
          >
            <source src="/videos/manroland.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#102A43]/75" aria-hidden />
          <div className="relative flex min-h-[430px] flex-col justify-between px-4 py-10 sm:px-6 lg:min-h-[460px] lg:px-8 lg:py-12">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[.18em] text-[#F5B45B]">智印联创 / 决策层</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl">智印大脑</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[#DCE6F0]">
                  用可追溯的信息，把需求、生产和原料放进同一条协同路径；生成草稿前先说明证据边界，提交前始终由你确认。
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const video = videoRef.current
                  if (!video) return
                  if (video.paused) void video.play().catch(() => undefined)
                  else video.pause()
                }}
                className="inline-flex size-11 shrink-0 items-center justify-center border border-white/45 bg-[#102A43]/75 text-white transition hover:bg-white hover:text-[#173B63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5B45B]"
                aria-label={playing ? '暂停生产现场视频' : '播放生产现场视频'}
              >
                {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
              </button>
            </div>
            <div className="grid border border-white/25 bg-[#102A43]/85 sm:grid-cols-3" aria-label="产业角色决策带">
              {(Object.keys(ROLE_FOCUS) as RoleFocus[]).map((role) => {
                const item = ROLE_FOCUS[role]
                const Icon = item.Icon
                const active = role === roleFocus
                return (
                  <button
                    key={role} type="button" onClick={() => { setRoleFocus(role); setInput(item.prompt) }}
                    className={`group flex min-h-24 items-center gap-3 border-b border-white/20 px-4 py-4 text-left transition sm:border-b-0 sm:border-r sm:last:border-r-0 ${active ? 'bg-[#D97706] text-white' : 'text-[#DCE6F0] hover:bg-white/10'}`}
                  >
                    <Icon className="size-5 shrink-0" strokeWidth={1.7} aria-hidden />
                    <span><span className="block text-sm font-bold">{item.label}</span><span className="mt-1 block text-xs opacity-80">点击切换核对视角</span></span>
                    <ChevronRight className="ml-auto size-4 opacity-60 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D9DEE6] bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8" role="tablist" aria-label="智印大脑场景">
          {(Object.keys(CONTEXTS) as WorkspaceContext[]).map((kind) => (
            <button key={kind} type="button" role="tab" aria-selected={kind === contextKind} onClick={() => selectContext(kind)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition ${kind === contextKind ? 'border-[#D97706] text-[#173B63]' : 'border-transparent text-[#526174] hover:text-[#173B63]'}`}>
              {CONTEXTS[kind].label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-0 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1.22fr)_minmax(300px,.78fr)] lg:px-8 lg:py-10">
        <aside className="border border-[#D9DEE6] bg-white p-5 lg:border-r-0">
          <div className="flex items-center gap-2 text-sm font-bold text-[#173B63]"><History className="size-4" aria-hidden /> 我的会话</div>
          {historyAvailable ? (
            <div className="mt-5 space-y-2">
              {history.length ? history.slice(0, 5).map((item) => (
                <button key={item.id} type="button" onClick={() => void openConversation(item.id)} className="w-full border-l-2 border-[#D9DEE6] px-3 py-2 text-left text-xs leading-5 text-[#526174] transition hover:border-[#D97706] hover:bg-[#F6F7F8] hover:text-[#173B63]">
                  {item.title}
                </button>
              )) : <p className="mt-5 text-xs leading-5 text-[#6B7280]">登录后的对话会出现在这里。</p>}
            </div>
          ) : <p className="mt-5 text-xs leading-5 text-[#6B7280]">当前为临时会话。登录后可保存历史和待确认草稿。</p>}
        </aside>

        <section className="border border-[#D9DEE6] bg-white lg:border-r-0" aria-labelledby="brain-dialogue-title">
          <header className="border-b border-[#D9DEE6] p-5 sm:p-6">
            <p className="text-xs font-semibold text-[#B45309]">{context.label} / {ROLE_FOCUS[roleFocus].label}视角</p>
            <h2 id="brain-dialogue-title" className="mt-2 text-2xl font-bold tracking-tight">{context.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526174]">{context.description}</p>
          </header>
          <div className="min-h-[300px] space-y-5 p-5 sm:p-6">
            {!messages.length && (
              <div className="border-l-2 border-[#D97706] bg-[#FAFBFC] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#173B63]"><Bot className="size-4" aria-hidden /> 从当前场景开始</div>
                <p className="mt-2 text-sm leading-6 text-[#526174]">选择一个核对问题，智印大脑会给出证据边界、核对项和待确认的下一步。</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {context.prompts.map((prompt) => <button key={prompt} type="button" onClick={() => void sendMessage(prompt)} className="border border-[#D9DEE6] bg-white px-3 py-2 text-left text-xs font-semibold text-[#173B63] transition hover:border-[#173B63] hover:bg-[#EEF3F8]">{prompt}</button>)}
                </div>
              </div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.article key={message.id} initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`max-w-[92%] border p-4 text-sm leading-6 ${message.role === 'user' ? 'ml-auto border-[#173B63] bg-[#173B63] text-white' : 'border-[#D9DEE6] bg-[#FAFBFC] text-[#344258]'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.fallback && <p className="mt-2 text-xs opacity-75">服务兜底回复 · 请以页面原始来源与真实表单为准</p>}
                </motion.article>
              ))}
            </AnimatePresence>
            {sending && <div className="flex items-center gap-2 text-sm text-[#526174]"><LoaderCircle className="size-4 animate-spin text-[#D97706]" aria-hidden /> 正在整理可核对信息…</div>}
          </div>
          <form onSubmit={(event: FormEvent) => { event.preventDefault(); void sendMessage(input) }} className="border-t border-[#D9DEE6] p-4 sm:p-5">
            <label className="sr-only" htmlFor="brain-input">向智印大脑提出问题</label>
            <div className="flex items-end gap-3 border border-[#173B63] bg-white p-2 focus-within:ring-2 focus-within:ring-[#D97706]/25">
              <textarea id="brain-input" value={input} onChange={(event) => setInput(event.target.value)} rows={2} maxLength={2000} placeholder="描述当前需要核对的问题；不会自动发布业务记录。" className="min-h-12 flex-1 resize-none bg-transparent px-2 py-1 text-sm leading-6 text-[#172033] outline-none placeholder:text-[#7C8797]" />
              <button type="submit" disabled={!input.trim() || sending} className="inline-flex size-10 shrink-0 items-center justify-center bg-[#D97706] text-white transition hover:bg-[#B45309] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173B63]" aria-label="发送问题">
                <Send className="size-4" aria-hidden />
              </button>
            </div>
          </form>
        </section>

        <aside className="border border-[#D9DEE6] bg-[#FAFBFC] p-5 sm:p-6" aria-labelledby="brain-evidence-title">
          <div className="flex items-center gap-2 text-sm font-bold text-[#173B63]"><ShieldCheck className="size-4" aria-hidden /> <h2 id="brain-evidence-title">证据与边界</h2></div>
          <dl className="mt-5 divide-y divide-[#D9DEE6] border-y border-[#D9DEE6]">
            {context.evidence.map((item) => <div key={item.label} className="py-3"><dt className="text-xs font-semibold text-[#B45309]">{item.label}</dt><dd className="mt-1 text-sm leading-6 text-[#344258]">{item.value}</dd></div>)}
          </dl>
          <div className="mt-7 border-l-2 border-[#173B63] bg-white p-4">
            <p className="text-xs font-semibold text-[#B45309]">待确认草稿</p>
            {draft ? <>
              <h3 className="mt-2 text-base font-bold text-[#172033]">{draft.title}</h3>
              <dl className="mt-4 space-y-2 text-xs leading-5 text-[#526174]">
                {Object.entries(draft.fields).length ? Object.entries(draft.fields).map(([key, value]) => <div key={key} className="flex gap-2"><dt className="shrink-0 font-semibold text-[#173B63]">{key}</dt><dd>{value}</dd></div>) : <p>本场景暂不生成业务字段。</p>}
              </dl>
              <button type="button" onClick={() => void confirmDraft()} className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 bg-[#173B63] px-3 text-sm font-semibold text-white transition hover:bg-[#102A43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]">
                {draft.id ? '确认后前往真实表单' : '登录后保存并前往表单'} <ArrowUpRight className="size-4" aria-hidden />
              </button>
            </> : <p className="mt-3 text-sm leading-6 text-[#526174]">提出问题后，这里会显示只待你确认的草稿字段。</p>}
          </div>
          <p className="mt-6 text-xs leading-5 text-[#6B7280]">智印大脑不会自动发布需求、报价、供货方案或采购意向。</p>
        </aside>
      </section>
    </main>
  )
}
