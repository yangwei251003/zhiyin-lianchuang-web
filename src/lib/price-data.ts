/** 受支持的纸种。所有具体报价必须通过 market_prices 表获得。 */
export const PAPER_TYPES = [
  '铜版纸',
  '双胶纸',
  '白卡纸',
  '哑粉铜版纸',
  '轻涂纸',
  '新闻纸',
] as const

export type PaperType = (typeof PAPER_TYPES)[number]
