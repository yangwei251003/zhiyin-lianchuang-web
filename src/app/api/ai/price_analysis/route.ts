import { type NextRequest, NextResponse } from 'next/server'
import { zhipuChatCompletion, type ZhipuMessage } from '@/lib/ai/zhipu'
import { getPriceAnalysisFallback } from '@/lib/ai/fallback'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

interface RecentPrice {
  date?: string
  price?: number
}

interface PriceAnalysisRequestBody {
  paperType?: string
  changeRate?: number
  trend?: 'up' | 'down' | 'flat'
  recentPrices?: RecentPrice[]
  // 旧版兼容
  currentPrice?: number
  historyData?: RecentPrice[]
}

interface StructuredAnalysis {
  trend: string
  reason: string
  suggestion: string
  risk: string
  confidence: number
}

// POST /api/ai/price_analysis
// 接收近期价格数据，调用智谱 AI 返回结构化分析（趋势/原因/建议/风险/置信度）
export async function POST(request: NextRequest) {
  let body: PriceAnalysisRequestBody = {}
  try {
    body = (await request.json()) as PriceAnalysisRequestBody
  } catch {
    body = {}
  }

  const paperType = body.paperType || '铜版纸'
  const changeRate = typeof body.changeRate === 'number' ? body.changeRate : 0
  const trend = body.trend || (changeRate > 0.5 ? 'up' : changeRate < -0.5 ? 'down' : 'flat')
  const recentPrices = Array.isArray(body.recentPrices)
    ? body.recentPrices
    : Array.isArray(body.historyData)
      ? body.historyData
      : []

  try {
    const priceList = recentPrices
      .slice(-14)
      .map((d) => `${d.date ?? ''}: ${d.price ?? 0}元/吨`)
      .join('\n')

    const trendText =
      trend === 'up' ? '上涨' : trend === 'down' ? '下跌' : '震荡'

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content: `你是印刷行业资深纸价分析师，拥有10年纸张市场研究经验。
你的任务是根据提供的价格数据，给出专业、简洁、实用的分析报告。
必须严格按照以下JSON格式返回，不要有任何其他内容：
{
  "trend": "当前趋势的一句话概括（30字内）",
  "reason": "价格变动的主要驱动因素分析（60字内）",
  "suggestion": "对印刷企业的具体采购建议（50字内）",
  "risk": "主要风险提示（40字内）",
  "confidence": 置信度数字(50-95之间)
}`,
      },
      {
        role: 'user',
        content: `${paperType}价格分析请求：
整体趋势：${trendText}
近期涨跌幅：${changeRate > 0 ? '+' : ''}${changeRate.toFixed(2)}%
近14天价格数据：
${priceList || '暂无数据'}

请基于以上数据给出结构化分析。`,
      },
    ]

    const result = await zhipuChatCompletion({
      messages,
      temperature: 0.25,
      maxTokens: 600,
    })

    const content = result.content?.trim()
    if (!content) throw new Error('Empty AI response')

    // 解析 AI 返回的 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid JSON format')

    const parsed = JSON.parse(jsonMatch[0]) as StructuredAnalysis

    // 校验字段完整性
    if (!parsed.trend || !parsed.reason || !parsed.suggestion || !parsed.risk) {
      throw new Error('Incomplete AI response')
    }

    parsed.confidence = Math.min(95, Math.max(50, Number(parsed.confidence) || 75))

    return NextResponse.json({
      success: true,
      analysis: parsed,
      fallback: false,
    })
  } catch {
    // 兜底：结构化静态文案
    const fb = getPriceAnalysisFallback(paperType, changeRate)
    const trendText =
      trend === 'up' ? '上涨' : trend === 'down' ? '下跌' : '震荡'
    const analysis: StructuredAnalysis = {
      trend: `${paperType}近期整体${trendText}，涨跌幅约 ${Math.abs(changeRate).toFixed(2)}%。`,
      reason: fb.analysis,
      suggestion: fb.suggestion,
      risk:
        trend === 'up'
          ? '关注原材料纸浆价格走势，警惕成本传导压力。'
          : trend === 'down'
            ? '需警惕价格止跌反弹，避免踏空需求缺口。'
            : '关注宏观政策与季节性需求变化对价格的影响。',
      confidence: 68,
    }
    return NextResponse.json({ success: true, analysis, fallback: true })
  }
}
