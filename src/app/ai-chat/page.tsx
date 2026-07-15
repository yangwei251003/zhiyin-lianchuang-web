import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { AiChat } from '@/components/ai/AiChat'

export const metadata: Metadata = {
  title: '智印大脑 · AI 智能助手 · 智印联创',
  description:
    '智印大脑提供印刷工艺、材料、采购核对项与产教实践辅助问答，不输出未经核验的价格或经营成绩。',
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
