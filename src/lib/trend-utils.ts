export type Trend = 'up' | 'down' | 'flat'

/**
 * 根据涨跌幅判定趋势
 */
export function deriveTrend(changeRate: number): Trend {
  if (changeRate > 0.5) return 'up'
  if (changeRate < -0.5) return 'down'
  return 'flat'
}

/**
 * 趋势对应的 CSS 类名（配合 Tailwind）
 */
export function trendBadgeClass(changeRate: number): string {
  if (changeRate > 0) return 'bg-danger-bg text-danger'
  if (changeRate < 0) return 'bg-success-bg text-success'
  return 'bg-canvas text-ink-tertiary'
}

/**
 * 趋势对应的箭头符号
 */
export function trendArrow(changeRate: number): string {
  if (changeRate > 0) return '↑'
  if (changeRate < 0) return '↓'
  return '—'
}

/**
 * 趋势文本对应的 CSS 颜色类名
 */
export function trendTextClass(changeRate: number): string {
  if (changeRate > 0) return 'text-danger'
  if (changeRate < 0) return 'text-success'
  return 'text-ink-tertiary'
}
