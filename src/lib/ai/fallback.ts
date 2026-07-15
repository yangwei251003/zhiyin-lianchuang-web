// AI 接口兜底文案模块
// 当智谱 API 不可用（超时、限流、密钥缺失、网络异常）时，
// 提供高质量结构化兜底文案，确保前端体验不中断。
// 设计原则：兜底文案必须可读、专业、可执行，绝不返回"暂无数据"。

export type PriceTrend = 'up' | 'down' | 'flat'
export type PurchaseAdviceAction = 'buy' | 'wait' | 'ended'

export interface PriceAnalysisFallback {
  trend: PriceTrend
  analysis: string
  suggestion: string
}

export interface PurchaseAdviceFallback {
  action: PurchaseAdviceAction
  title: string
  reason: string
  confidence: number // 0~100
}

/**
 * 价格分析兜底文案
 * 根据 changeRate 判定趋势并生成结构化分析 + 采购建议
 */
export function getPriceAnalysisFallback(
  paperType: string,
  changeRate: number,
): PriceAnalysisFallback {
  const absChange = Math.abs(changeRate).toFixed(2)
  const trend: PriceTrend =
    changeRate > 0.5 ? 'up' : changeRate < -0.5 ? 'down' : 'flat'

  const analysis =
    trend === 'up'
      ? `近期${paperType}价格整体呈上涨态势，市场需求支撑明显，近一周期累计涨幅约 ${absChange}%，主要受原材料成本上升与下游补库需求推动，预计短期内仍将维持偏强走势。`
      : trend === 'down'
        ? `近期${paperType}价格承压下行，市场供给宽松，近一周期累计跌幅约 ${absChange}%，主要受供给增加与需求季节性走弱影响，预计短期内价格或继续探底。`
        : `近期${paperType}价格窄幅震荡，近一周期波动幅度仅约 ${absChange}%，买卖双方博弈均衡，多空因素交织，整体走势趋于平稳。`

  const suggestion =
    trend === 'up'
      ? '建议短期内按需采购，避免大量囤货；如有刚性需求可适度提前锁定部分用量，以对冲后续涨价风险。'
      : trend === 'down'
        ? '建议密切关注价格止跌信号，可择机分批补货锁定较低成本，但不宜一次性大量抄底。'
        : '建议根据实际生产需求灵活安排采购计划，无需抢购也无需延迟，保持合理库存即可。'

  return { trend, analysis, suggestion }
}

/**
 * 集采采购建议兜底
 * 根据集采进度、剩余天数、活动状态生成结构化建议
 * progress: 0~100；daysLeft: 剩余天数（可含小数）；status: 活动状态
 */
export function getPurchaseAdviceFallback(params: {
  progress: number
  daysLeft: number
  status?: string
  unitPrice?: number
  targetQuantity?: number
  currentQuantity?: number
}): PurchaseAdviceFallback {
  const { progress, daysLeft, status } = params

  // 活动已结束/取消
  if (status && status !== 'active') {
    return {
      action: 'ended',
      title: '活动已结束',
      reason:
        '该集采活动已不可参团，建议关注后续新品集采，或前往集采商城查看其他在售活动。',
      confidence: 100,
    }
  }

  // 进度高 → 强烈建议采购（即将成团）
  if (progress >= 80) {
    return {
      action: 'buy',
      title: '建议立即采购',
      reason: `集采进度已达 ${progress.toFixed(0)}%，即将达成目标量，成团确定性高，建议尽快参团锁定批发价格。`,
      confidence: 92,
    }
  }

  // 时间紧 + 进度低 → 观望（成团风险高）
  if (daysLeft < 1 && progress < 50) {
    return {
      action: 'wait',
      title: '建议观望',
      reason: `活动剩余时间不足 1 天，当前进度仅 ${progress.toFixed(0)}%，达成目标量存在风险，建议等待下一期活动。`,
      confidence: 68,
    }
  }

  // 进度低 → 观望
  if (progress < 30) {
    return {
      action: 'wait',
      title: '建议观望',
      reason: `当前集采进度较低（${progress.toFixed(0)}%），成团尚有不确定性，可观察后续参团趋势再决定。`,
      confidence: 60,
    }
  }

  // 默认：建议采购
  return {
    action: 'buy',
    title: '建议采购',
    reason: `集采进度 ${progress.toFixed(0)}%，价格优于市场零售，参团可享批量优惠，性价比良好，建议结合自身用量参团。`,
    confidence: 78,
  }
}

/**
 * 文章摘要兜底
 * 从正文截取前若干字符并按句号断句，生成结构化摘要
 */
export function getArticleSummaryFallback(
  title: string,
  content: string,
): string {
  // 去除 HTML 标签与多余空白
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) {
    return `本文《${title}》围绕印刷行业创业主题展开，提供实操经验与建议，建议结合自身情况参考阅读。`
  }

  const slice = text.slice(0, 160)
  const lastPeriod = slice.lastIndexOf('。')
  const core = lastPeriod > 40 ? slice.slice(0, lastPeriod + 1) : slice
  return `本文核心要点：${core} 建议阅读全文获取完整方法论与实操细节。`
}

/**
 * AI 对话兜底回复
 * 根据用户消息关键词返回结构化兜底，保持对话连续性
 */
export function getChatFallback(message: string): string {
  const text = (message || '').trim()

  if (!text) {
    return '你好，我是智印大脑。你可以咨询印刷工艺、纸张选购、采购核对项与产教实践；纸价请以已标注来源、规格和时间的公开记录为准。'
  }

  // 价格相关
  if (/价格|纸价|涨|跌|走势|趋势|铜版纸|双胶纸|白卡纸|瓦楞/.test(text)) {
    return [
      '关于纸价，目前我暂时无法连接到实时 AI 分析服务，以下是基于行业经验的一般建议：',
      '',
      '1. 关注主要纸种（铜版纸、双胶纸、白卡纸、瓦楞原纸）的周度变动；',
      '2. 涨价周期建议按需采购、适度提前锁定用量；',
      '3. 跌价周期可分批补货，但不宜一次性大量抄底；',
      '4. 你可以前往「纸价情报」页面查看各纸种已核验的同口径历史报价与采购核对项。',
      '',
      '稍后 AI 服务恢复后，我可以为你提供更精准的分析。',
    ].join('\n')
  }

  // 采购相关
  if (/采购|集采|团购|进货|囤货|参团/.test(text)) {
    return [
      '关于集采采购，一般建议如下：',
      '',
      '1. 优先选择进度较高（≥80%）的活动，成团确定性更强；',
      '2. 关注活动剩余时间，临近结束且进度低的活动需谨慎；',
      '3. 结合自身实际用量参团，避免过度囤货占用资金；',
      '4. 集采批发价通常优于零售，但仍需对比历史价格。',
      '',
      '你可以前往「集采商城」查看在售活动，AI 服务恢复后我可给出更具体的建议。',
    ].join('\n')
  }

  // 创业相关
  if (/创业|开厂|起步|投资|成本|利润|印刷厂/.test(text)) {
    return [
      '关于印刷创业，一般思路如下：',
      '',
      '1. 明确细分赛道（商务印刷、包装印刷、特种印刷等）；',
      '2. 测算设备投入、场地租金、人工与原材料成本；',
      '3. 初期可优先承接稳定订单，控制产能扩张节奏；',
      '4. 善用集采商城降低纸张采购成本。',
      '',
      '你可以前往「产教实践」栏目查看学习资料、导师辅导与实践测算工具。',
    ].join('\n')
  }

  // 通用兜底
  return [
    '我是智印大脑，印刷行业 AI 智能助手。',
    '',
    '当前 AI 服务暂时不可用，我仍可以为你提供以下方向的通用建议：',
    '- 纸张价格趋势与采购建议',
    '- 印刷工艺与材料选购',
    '- 集采商城活动参团策略',
    '- 印刷产教实践与筹备测算',
    '',
    '你可以尝试稍后重试，或前往对应栏目查看详细内容。',
  ].join('\n')
}
