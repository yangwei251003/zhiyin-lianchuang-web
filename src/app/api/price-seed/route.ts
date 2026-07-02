import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import {
  PAPER_PRICE_BASE,
  generateHistoricalPrices,
  generatePredictions,
} from '@/lib/price-data'
import { zhipuChatCompletion } from '@/lib/ai/zhipu'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

type PricePredictionInsert =
  Database['public']['Tables']['price_predictions']['Insert']

const PAPER_TYPES = Object.keys(PAPER_PRICE_BASE)

// GET /api/price-seed
// 一次性生成所有纸种的历史价格 + AI预测数据，写入 price_predictions 表
// 使用 service_role key 绕过 RLS
export async function GET(request: NextRequest) {
  // 简单鉴权：只允许 CRON_SECRET 或者本地调用
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET || 'dev-seed-secret'
  if (authHeader !== `Bearer ${secret}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const results: Record<string, { historical: number; predicted: number }> = {}
  const now = new Date()

  for (const paperType of PAPER_TYPES) {
    try {
      // 生成近 90 天历史数据 + 30 天预测
      const historical = generateHistoricalPrices(paperType, 90, now)
      const predictions = generatePredictions(historical, 30)

      // 使用 AI 优化预测（可选，若 API Key 存在）
      let aiPredictions = predictions
      if (process.env.ZHIPU_API_KEY) {
        try {
          const aiResult = await generateAIPredictions(paperType, historical, predictions)
          if (aiResult.length > 0) aiPredictions = aiResult
        } catch {
          // AI 优化失败不影响基础预测
        }
      }

      const allData = [...historical, ...aiPredictions]
      const inserts: PricePredictionInsert[] = allData.map((d) => ({
        paper_type: paperType as any,
        date: d.date,
        price: d.price,
        is_predicted: d.isPredicted,
        change_rate: d.changeRate ?? 0,
        ai_analysis: '',
      }))

      // upsert 避免重复（以 paper_type + date 为唯一键）
      const { error } = await supabaseAdmin
        .from('price_predictions')
        .upsert(inserts, {
          onConflict: 'paper_type,date',
          ignoreDuplicates: false,
        })

      if (error) {
        console.error(`[price-seed] ${paperType} error:`, error.message)
        results[paperType] = { historical: 0, predicted: 0 }
      } else {
        results[paperType] = {
          historical: historical.length,
          predicted: aiPredictions.length,
        }
      }
    } catch (err) {
      console.error(`[price-seed] ${paperType} unexpected error:`, err)
      results[paperType] = { historical: 0, predicted: 0 }
    }
  }

  return NextResponse.json({
    ok: true,
    message: '价格数据初始化完成',
    results,
    timestamp: now.toISOString(),
  })
}

/**
 * 调用智谱 AI 优化预测价格序列
 * 输入近期历史数据，输出更准确的30天预测
 */
async function generateAIPredictions(
  paperType: string,
  historical: { date: string; price: number }[],
  basePredictions: { date: string; price: number; isPredicted: boolean; changeRate?: number }[],
): Promise<typeof basePredictions> {
  const recent = historical.slice(-14)
  const priceList = recent.map((d) => `${d.date}: ${d.price}元/吨`).join('\n')

  const prompt = `你是印刷行业纸张价格分析专家。

以下是${paperType}近14天的市场价格数据（单位：元/吨）：
${priceList}

请预测未来30天的价格走势（从${basePredictions[0]?.date}开始），以JSON格式返回：
[{"date":"YYYY-MM-DD","price":数字,"changeRate":数字},...] （共30条）

要求：
1. 价格基于历史趋势合理推断，不要大幅跳跃
2. changeRate是当天相对前一天的涨跌幅（%）
3. 仅返回JSON数组，不要其他内容`

  const result = await zhipuChatCompletion({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    maxTokens: 2000,
  })

  // 尝试解析 AI 返回的 JSON
  const content = result.content.trim()
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  const parsed = JSON.parse(jsonMatch[0]) as Array<{
    date: string
    price: number
    changeRate: number
  }>

  return parsed.map((d) => ({
    date: d.date,
    price: Math.round(Number(d.price) || 0),
    isPredicted: true,
    changeRate: Math.round((Number(d.changeRate) || 0) * 100) / 100,
  }))
}
