import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createReviewToken } from '@/lib/review/review-session'

const REVIEW_COOKIE = 'review_session'
const requestSchema = z.object({ code: z.string().trim().min(1).max(128) })

function equalCodes(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export async function POST(request: NextRequest) {
  const accessCode = process.env.REVIEW_ACCESS_CODE
  const secret = process.env.REVIEW_SESSION_SECRET

  if (!accessCode || !secret) {
    return NextResponse.json({ error: '评审演示尚未配置。' }, { status: 503 })
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || !equalCodes(parsed.data.code, accessCode)) {
    return NextResponse.json({ error: '评审码无效，请重新输入。' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(REVIEW_COOKIE, createReviewToken({ secret }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 4 * 60 * 60,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(REVIEW_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
