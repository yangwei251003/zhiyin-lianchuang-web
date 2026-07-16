'use client'

import { BrainWorkbench } from '@/components/brain/BrainWorkbench'

// 保留组件导出兼容旧引用；视觉与行为统一由新的智印大脑工作区承载。
export function AiChat() {
  return <BrainWorkbench />
}
