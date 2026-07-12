export class ApiRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

export async function requestJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init)
  const payload = await response.json().catch(() => null) as { error?: string } | null

  if (!response.ok) {
    throw new ApiRequestError(payload?.error ?? '请求未能完成，请稍后重试。', response.status)
  }

  return payload as T
}
