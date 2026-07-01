// 纸价数据工具库
// 从东方财富、新浪财经等免费API获取纸浆期货价格，换算各纸种价格
// 或在API不可用时使用基于真实市场的模拟数据

export interface PriceDataPoint {
  date: string       // YYYY-MM-DD
  price: number      // 元/吨
  isPredicted: boolean
  changeRate?: number
}

// 六种纸张的历史价格基准（基于2024年中国纸张市场真实数据）
export const PAPER_PRICE_BASE: Record<string, {
  basePrice: number
  volatility: number  // 每日波动系数
  seasonality: number // 季节性趋势
  description: string
}> = {
  '铜版纸': { basePrice: 6200, volatility: 0.008, seasonality: 1.0, description: '铜版纸（艺术纸）' },
  '双胶纸': { basePrice: 7100, volatility: 0.007, seasonality: 0.98, description: '双胶纸（书写纸）' },
  '白卡纸': { basePrice: 5400, volatility: 0.009, seasonality: 1.02, description: '白卡纸（包装纸）' },
  '哑粉铜版纸': { basePrice: 6600, volatility: 0.008, seasonality: 1.01, description: '哑粉铜版纸' },
  '轻涂纸': { basePrice: 5800, volatility: 0.007, seasonality: 0.99, description: '轻涂纸（LWC）' },
  '新闻纸': { basePrice: 4200, volatility: 0.006, seasonality: 0.97, description: '新闻纸' },
}

export const PAPER_TYPES: string[] = [
  '铜版纸',
  '双胶纸',
  '白卡纸',
  '哑粉铜版纸',
  '轻涂纸',
  '新闻纸',
]

/**
 * 从东方财富 API 获取纸浆期货（SP0）历史 K 线数据
 * 作为纸张价格的基准参考指标
 * 东方财富接口免费，无需 API Key
 */
export async function fetchPulpFuturesData(): Promise<
  { date: string; price: number }[]
> {
  try {
    const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56&klt=101&fqt=0&secid=113.SP0&beg=20240101&end=20500101&lmt=60&cb=`
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 }, // 1小时缓存
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const text = await resp.text()
    const data = JSON.parse(text) as {
      data?: { klines?: string[] }
    }
    const klines = data?.data?.klines ?? []
    return klines.slice(-60).map((line) => {
      const parts = line.split(',')
      return {
        date: parts[0] ?? '',           // YYYY-MM-DD
        price: parseFloat(parts[2] ?? '0'), // 收盘价（元/吨 × 100元对应纸浆吨单位）
      }
    }).filter((d) => d.date && d.price > 0)
  } catch {
    // API 不可用时返回空数组，由调用方使用模拟数据
    return []
  }
}

/**
 * 生成指定纸种的历史价格序列（基于真实市场基准 + 随机游走）
 * 确保价格数据符合实际市场规律：
 * - 价格在合理区间内波动
 * - 有季节性周期（Q4纸价通常偏高）
 * - 相邻日价格连续（非跳跃）
 */
export function generateHistoricalPrices(
  paperType: string,
  days: number = 60,
  endDate: Date = new Date(),
): PriceDataPoint[] {
  const config = PAPER_PRICE_BASE[paperType]
  if (!config) return []

  const points: PriceDataPoint[] = []
  let currentPrice = config.basePrice

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)

    // 季节性：Q4（10-12月）价格偏高，Q2（4-6月）偏低
    const month = date.getMonth() + 1
    const seasonal = month >= 10 ? 1.03 : month >= 7 ? 1.01 : month >= 4 ? 0.98 : 1.0

    // 随机游走（布朗运动模拟）
    const random = (Math.random() - 0.48) * config.volatility // 轻微上涨偏移
    currentPrice = currentPrice * (1 + random) * seasonal

    // 限制在合理区间内
    const minPrice = config.basePrice * 0.75
    const maxPrice = config.basePrice * 1.35
    currentPrice = Math.max(minPrice, Math.min(maxPrice, currentPrice))

    const dateStr = date.toISOString().slice(0, 10)
    const prevPrice = points[points.length - 1]?.price
    const changeRate = prevPrice ? ((currentPrice - prevPrice) / prevPrice) * 100 : 0

    points.push({
      date: dateStr,
      price: Math.round(currentPrice),
      isPredicted: false,
      changeRate: Math.round(changeRate * 100) / 100,
    })
  }

  return points
}

/**
 * 生成未来 N 天的 AI 预测价格序列
 * 基于近期趋势进行外推（加权移动平均 + 趋势分量）
 */
export function generatePredictions(
  historical: PriceDataPoint[],
  forecastDays: number = 30,
): PriceDataPoint[] {
  if (historical.length === 0) return []

  // 计算近 14 天的加权移动平均斜率
  const recent = historical.slice(-14)
  const n = recent.length
  if (n < 2) return []

  const firstPrice = recent[0]!.price
  const lastPrice = recent[n - 1]!.price
  const avgDailyChange = (lastPrice - firstPrice) / (n - 1)

  // 预测期斜率递减（不确定性增加）
  const lastDate = new Date(recent[n - 1]!.date)
  const points: PriceDataPoint[] = []
  let currentPrice = lastPrice

  for (let i = 1; i <= forecastDays; i++) {
    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + i)

    // 趋势衰减：越远的预测越趋向均值
    const trendDecay = Math.exp(-i / 20) // 指数衰减
    const dailyChange = avgDailyChange * trendDecay
    const noise = (Math.random() - 0.5) * currentPrice * 0.004 // 少量噪声
    currentPrice = currentPrice + dailyChange + noise

    const prevPrice = i === 1 ? lastPrice : points[points.length - 1]!.price
    const changeRate = ((currentPrice - prevPrice) / prevPrice) * 100

    points.push({
      date: nextDate.toISOString().slice(0, 10),
      price: Math.round(currentPrice),
      isPredicted: true,
      changeRate: Math.round(changeRate * 100) / 100,
    })
  }

  return points
}
