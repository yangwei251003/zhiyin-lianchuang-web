import { createHmac, timingSafeEqual } from 'node:crypto'

interface ReviewTokenPayload {
  version: 1
  expiresAt: string
}

interface CreateReviewTokenOptions {
  secret: string
  now?: Date
  ttlSeconds?: number
}

interface VerifyReviewTokenOptions {
  secret: string
  now?: Date
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createReviewToken({
  secret,
  now = new Date(),
  ttlSeconds = 4 * 60 * 60,
}: CreateReviewTokenOptions): string {
  if (!secret) throw new Error('Review session secret is required')

  const payload: ReviewTokenPayload = {
    version: 1,
    expiresAt: new Date(now.getTime() + ttlSeconds * 1000).toISOString(),
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encodedPayload}.${signPayload(encodedPayload, secret)}`
}

export function verifyReviewToken(
  token: string,
  { secret, now = new Date() }: VerifyReviewTokenOptions
): ReviewTokenPayload | null {
  if (!secret) return null

  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [encodedPayload, suppliedSignature] = parts
  const expectedSignature = signPayload(encodedPayload, secret)
  const supplied = Buffer.from(suppliedSignature)
  const expected = Buffer.from(expectedSignature)

  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as Partial<ReviewTokenPayload>

    if (payload.version !== 1 || typeof payload.expiresAt !== 'string') return null
    if (Date.parse(payload.expiresAt) <= now.getTime()) return null

    return payload as ReviewTokenPayload
  } catch {
    return null
  }
}
