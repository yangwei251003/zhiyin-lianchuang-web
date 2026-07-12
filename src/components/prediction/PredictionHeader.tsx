import { Brain } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

export interface PredictionHeaderProps {
  paperType: string
}

export function PredictionHeader({ paperType }: PredictionHeaderProps) {
  return (
    <PageHeader
      title={`${paperType} 价格预测`}
      subtitle="Paper Price Prediction · AI Forecasting"
      desc={`利用先进的 AI 模型与全网印刷原材料数据，智能预测 ${paperType} 的价格走势，辅助企业精准控制采购仓储成本`}
      theme="dark"
      badge="AI 深度预测"
      icon={<Brain className="h-3.5 w-3.5" />}
      breadcrumbs={[
        { label: '首页', href: '/' },
        { label: 'AI 纸价预测', href: '/prediction/白卡纸' },
        { label: paperType },
      ]}
    />
  )
}
