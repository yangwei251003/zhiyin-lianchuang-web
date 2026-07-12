'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4v.01m0 3.984V18a2 2 0 001-2h4a2 2 0 001-2V9Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 9l10 6 10-6-10-6z" opacity={0.3} />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white">页面加载出错</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          服务端渲染时发生了意外错误。这可能是临时的网络问题或服务配置问题。
          <br />
          请尝试刷新页面，或稍后再试。
        </p>

        {error.digest && (
          <p className="text-xs text-gray-500 font-mono bg-gray-900 rounded px-3 py-2">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-7 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          刷新重试
        </button>

        <Link
          href="/"
          className="block text-xs text-gray-500 hover:text-gray-300 transition-colors mt-4"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
