'use client'

import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '@/lib/utils'

export interface PriceChartProps {
  data: {
    date: string
    price: number
    is_predicted: boolean
    change_rate?: number
  }[]
  height?: number
  paperType?: string
  className?: string
}

interface ChartDatum {
  date: string
  rawPrice: number
  isPredicted: boolean
  changeRate?: number
  /** 历史段数值（预测段为 null） */
  history: number | null
  /** 预测段数值（历史段为 null，边界点连接历史末值） */
  forecast: number | null
}

// 颜色常量（对齐 tailwind.config.ts）
const PRIMARY = '#2A6CDB'
const WARNING = '#F0A040'
const GRID = '#E2E8F0'
const INK_TERTIARY = '#94A3B8'

// 自定义 Tooltip 内容
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey?: string | number
    value?: number
    color?: string
    payload?: ChartDatum
  }>
  label?: string | number
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const datum = payload[0]?.payload
  if (!datum) return null

  const change = datum.changeRate
  const isUp = typeof change === 'number' && change > 0
  const isDown = typeof change === 'number' && change < 0
  const changeColor = isUp
    ? 'text-success'
    : isDown
      ? 'text-danger'
      : 'text-ink-tertiary'
  const arrow = isUp ? '↑' : isDown ? '↓' : '—'

  return (
    <div className="rounded-md border border-line bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-ink-tertiary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-primary">
        ¥{datum.rawPrice.toLocaleString('zh-CN')}
        <span className="ml-1 text-2xs font-normal text-ink-tertiary">元/吨</span>
      </p>
      {typeof change === 'number' && (
        <p className={cn('mt-0.5 text-xs font-medium', changeColor)}>
          {arrow} {Math.abs(change).toFixed(2)}%
          <span className="ml-1 text-2xs text-ink-tertiary">
            {datum.isPredicted ? '预测' : '同比'}
          </span>
        </p>
      )}
    </div>
  )
}

// 纸价走势图：历史实线（蓝）+ 预测虚线（橙）+ 当前价格参考线
export function PriceChart({
  data,
  height = 320,
  paperType,
  className,
}: PriceChartProps) {
  const { chartData, currentPrice } = useMemo(() => {
    // 按日期升序排序，确保时间轴递增
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))

    // 找到最后一个历史点索引（用于让预测段连接到历史末点）
    let lastHistoryIdx = -1
    sorted.forEach((d, i) => {
      if (!d.is_predicted) lastHistoryIdx = i
    })

    const result: ChartDatum[] = sorted.map((d, i) => {
      const isForecast = d.is_predicted
      // 预测段在历史末点处插入连接点，使虚线与实线衔接
      const isBoundary = i === lastHistoryIdx
      return {
        date: d.date,
        rawPrice: d.price,
        isPredicted: isForecast,
        changeRate: d.change_rate,
        history: !isForecast ? d.price : null,
        forecast: isForecast || isBoundary ? d.price : null,
      }
    })

    const current =
      lastHistoryIdx >= 0 ? sorted[lastHistoryIdx].price : undefined

    return { chartData: result, currentPrice: current }
  }, [data])

  const xFormatter = (value: string) => {
    // YYYY-MM-DD → MM-DD
    const parts = String(value).split('-')
    if (parts.length >= 3) return `${parts[1]}-${parts[2]}`
    return value
  }

  const yFormatter = (value: number) => `${value}`

  return (
    <div className={cn('w-full', className)}>
      {paperType && (
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-ink-primary">
            {paperType}价格走势
          </h4>
          <div className="flex items-center gap-3 text-2xs text-ink-tertiary">
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-0.5 w-3 rounded-full"
                style={{ backgroundColor: PRIMARY }}
              />
              历史
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-0.5 w-3 rounded-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, ${WARNING} 0 4px, transparent 4px 8px)`,
                }}
              />
              预测
            </span>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={GRID}
          />
          <XAxis
            dataKey="date"
            tickFormatter={xFormatter}
            tick={{ fill: INK_TERTIARY, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            minTickGap={20}
          />
          <YAxis
            tickFormatter={yFormatter}
            tick={{ fill: INK_TERTIARY, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: INK_TERTIARY, strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          {typeof currentPrice === 'number' && (
            <ReferenceLine
              y={currentPrice}
              stroke={PRIMARY}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: `当前 ¥${currentPrice.toLocaleString('zh-CN')}`,
                position: 'insideTopRight',
                fontSize: 11,
                fill: PRIMARY,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="history"
            stroke={PRIMARY}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: PRIMARY }}
            connectNulls={false}
            isAnimationActive
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke={WARNING}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, fill: WARNING }}
            connectNulls={false}
            isAnimationActive
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
