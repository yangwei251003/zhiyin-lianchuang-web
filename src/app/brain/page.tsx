import type { Metadata } from 'next'
import { BrainWorkbench } from '@/components/brain/BrainWorkbench'

const contextKinds = ['general', 'order', 'purchase', 'price', 'education'] as const
type BrainContext = (typeof contextKinds)[number]

export const metadata: Metadata = {
  title: '智印大脑 · 协同决策工作区',
  description: '从需求、生产、原料、纸价情报与产教实践中提取可核对信息，生成待用户确认的业务草稿。',
}

export default async function BrainPage({
  searchParams,
}: {
  searchParams: Promise<{ context?: string }>
}) {
  const context = (await searchParams).context
  const initialContext: BrainContext = contextKinds.includes(context as BrainContext)
    ? context as BrainContext
    : 'general'

  return <BrainWorkbench initialContext={initialContext} />
}
