export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary/30 border-t-primary" />
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    </div>
  )
}
