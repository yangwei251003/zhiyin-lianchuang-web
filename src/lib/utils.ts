import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 合并 Tailwind className，处理冲突（cn('p-2', 'p-4') -> 'p-4'）
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
