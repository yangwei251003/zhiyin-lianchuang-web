import 'server-only'

import { cookies } from 'next/headers'
import { verifyReviewToken } from './review-session'

export async function hasReviewSession(): Promise<boolean> {
  const secret = process.env.REVIEW_SESSION_SECRET
  const token = (await cookies()).get('review_session')?.value
  return Boolean(secret && token && verifyReviewToken(token, { secret }))
}
