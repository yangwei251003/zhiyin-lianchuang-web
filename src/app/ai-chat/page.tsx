import { redirect } from 'next/navigation'

// 保留旧链接，统一进入新的决策工作区。
export default function AiChatPage() {
  redirect('/brain')
}
