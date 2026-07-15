import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ReviewWorkspace } from '@/components/review/ReviewWorkspace'
import { hasReviewSession } from '@/lib/review/server'

export const metadata: Metadata = {
  title: '评审协同工作台',
  description: '智印联创校园宣传物料协同演示工作台。',
}

export default async function ReviewWorkspacePage() {
  if (!(await hasReviewSession())) redirect('/review')
  return <ReviewWorkspace />
}
