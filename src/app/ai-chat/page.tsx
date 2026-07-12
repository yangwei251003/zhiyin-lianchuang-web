import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { AiChat } from '@/components/ai/AiChat'

export const metadata: Metadata = {
  title: '智印大脑 · AI 智能助手 · 智印联创',
  description:
    '智印大脑是印刷行业 AI 智能助手，可解答印刷工艺、纸张选购、价格趋势、集采商城、创业孵化等问题。',
}

// AI 对话页：作为产品演示与行业咨询入口，无需登录即可体验。
export default function AiChatPage() {
  return (
    <main className="pb-10">
      <Container size="md" className="pt-6">
        <AiChat />
      </Container>
    </main>
  )
}
