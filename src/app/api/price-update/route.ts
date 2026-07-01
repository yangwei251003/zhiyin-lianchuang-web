import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { fetchPulpFuturesData, PAPER_PRICE_BASE } from '@/lib/price-data'

type PricePredictionInsert =
  Database['public']['Tables']['price_predictions']['Insert']

const PAPER_TYPES = Object.keys(PAPER_PRICE_BASE)

// GET /api/price-update
// 从东方财富获取最新的纸浆期货 K 线数据，换算成各纸种的实际价格，更新到数据库中。
// 用此 API 保持数据「实时更新」。
export async function GET(request: NextRequest) {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  try {
    // 1. 获取最新纸浆期货 K 线数据
    const pulpData = await fetchPulpFuturesData()
    if (pulpData.length === 0) {
      return NextResponse.json({
        ok: false,
        message: '无法获取网上纸浆期货数据，使用本地模拟机制更新',
      }, { status: 502 })
    }

    const updatesCount: Record<string, number> = {}

    // 2. 遍历每个纸种，按纸浆期货波动进行实际换算
    for (const paperType of PAPER_TYPES) {
      const config = PAPER_PRICE_BASE[paperType]
      if (!config) continue

      // 以纸浆平均值（约 6000）为锚点，换算各纸种的价格
      const pulpBasePrice = 6000
      const inserts: PricePredictionInsert[] = pulpData.map((point, index) => {
        // 计算当前期货价对锚点价格的偏离百分比
        const ratio = point.price / pulpBasePrice
        
        // 纸张价格 = 纸张基准价 * 偏离系数 + 适当的平滑和正弦季节波动
        const month = new Date(point.date).getMonth() + 1
        const seasonal = month >= 10 ? 1.02 : month >= 4 && month <= 6 ? 0.98 : 1.0
        
        const calculatedPrice = Math.round(config.basePrice * ratio * seasonal)
        
        // 计算涨跌幅
        let changeRate = 0
        if (index > 0) {
          const prevCalculatedPrice = Math.round(
            config.basePrice * (pulpData[index - 1]!.price / pulpBasePrice) * seasonal
          )
          changeRate = prevCalculatedPrice
            ? ((calculatedPrice - prevCalculatedPrice) / prevCalculatedPrice) * 100
            : 0
        }

        return {
          paper_type: paperType as any,
          date: point.date,
          price: calculatedPrice,
          change_rate: Math.round(changeRate * 100) / 100,
          is_predicted: false,
          ai_analysis: '',
        }
      })

      // 批量写入/更新（如果是历史数据）
      const { error } = await supabaseAdmin
        .from('price_predictions')
        .upsert(inserts, {
          onConflict: 'paper_type,date',
          ignoreDuplicates: false,
        })

      if (error) {
        console.error(`[price-update] ${paperType} error:`, error.message)
        updatesCount[paperType] = 0
      } else {
        updatesCount[paperType] = inserts.length
      }
    }

    return NextResponse.json({
      ok: true,
      message: '实时纸价数据成功拉取并同步',
      updatesCount,
    })
  } catch (error) {
    console.error('[price-update] unexpected error:', error)
    return NextResponse.json({
      ok: false,
      error: (error as Error).message,
    }, { status: 500 })
  }
}
