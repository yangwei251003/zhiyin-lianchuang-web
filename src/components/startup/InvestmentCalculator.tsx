'use client'

import { useMemo, useState } from 'react'
import {
  Banknote,
  Building,
  Calculator,
  Coins,
  Factory,
  Package,
  Users,
  Wallet,
} from 'lucide-react'
import { CountUp } from '@/components/common/CountUp'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import {
  CITIES,
  DEVICE_TYPES,
  SCALES,
  calculateInvestment,
  formatMoney,
  type CalcResult,
} from '@/lib/startup-config'
import { cn } from '@/lib/utils'

// 投资计算器（客户端组件）
// 输入设备类型 / 规模 / 城市 / 员工人数，用 useMemo 实时计算各项费用
export function InvestmentCalculator() {
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES[0].value)
  const [scale, setScale] = useState(SCALES[0].value)
  const [city, setCity] = useState(CITIES[0].value)
  const [employees, setEmployees] = useState<number>(3)

  const result: CalcResult = useMemo(
    () => calculateInvestment({ deviceType, scale, city, employees }),
    [deviceType, scale, city, employees],
  )

  const costCards: {
    label: string
    value: number
    icon: typeof Factory
    tint: string
  }[] = [
    {
      label: '设备购置费',
      value: result.equipmentCost,
      icon: Factory,
      tint: 'text-primary bg-primary-bg',
    },
    {
      label: '场地租金（首年）',
      value: result.rentCost,
      icon: Building,
      tint: 'text-environment bg-environment-bg',
    },
    {
      label: '原材料备货',
      value: result.materialCost,
      icon: Package,
      tint: 'text-warning bg-warning-bg',
    },
    {
      label: '人员工资（首年）',
      value: result.salaryCost,
      icon: Users,
      tint: 'text-purple-600 bg-purple-50',
    },
    {
      label: '其他费用',
      value: result.otherCost,
      icon: Coins,
      tint: 'text-society bg-society-bg',
    },
  ]

  const onEmployeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === '') {
      setEmployees(0)
      return
    }
    const num = Number(raw)
    if (!Number.isNaN(num) && num >= 0) {
      setEmployees(Math.floor(num))
    }
  }

  return (
    <div className="space-y-6">
      {/* ===== 输入区 ===== */}
      <Card padding="lg">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-bold text-ink-primary">创业参数</h2>
          <span className="ml-auto text-2xs text-ink-tertiary">
            修改参数自动重算
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="设备类型"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            options={DEVICE_TYPES.map((d) => ({ value: d.value, label: d.label }))}
          />
          <Select
            label="规模"
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            options={SCALES.map((s) => ({ value: s.value, label: s.label }))}
          />
          <Select
            label="城市"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            options={CITIES.map((c) => ({ value: c.value, label: c.label }))}
          />
          <div className="w-full">
            <label
              htmlFor="employees"
              className="mb-1.5 block text-sm font-medium text-ink-primary"
            >
              员工人数
            </label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-tertiary" />
              <input
                id="employees"
                type="number"
                min={0}
                step={1}
                value={employees}
                onChange={onEmployeesChange}
                className={cn(
                  'h-10 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-ink-primary',
                  'transition-all duration-fast ease-out-expo',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500',
                )}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* ===== 费用明细卡片网格 ===== */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-secondary">
          费用明细（单位：万元）
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {costCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.label} padding="md" className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-tertiary">
                    {card.label}
                  </span>
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-md',
                      card.tint,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-ink-primary">
                  <CountUp
                    end={card.value}
                    duration={800}
                    decimals={1}
                    suffix=" 万"
                  />
                </p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ===== 总投入 + 回本周期（突出显示） ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className="relative overflow-hidden rounded-xl p-6 shadow-md"
          style={{
            background:
              'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
          />
          <div className="relative">
            <p className="flex items-center gap-1 text-sm text-white/80">
              <Wallet className="h-4 w-4" />
              预估总投入
            </p>
            <p className="mt-2 text-4xl font-bold text-white sm:text-5xl">
              <CountUp
                end={result.totalCost}
                duration={1200}
                decimals={1}
                suffix=" 万"
              />
            </p>
            <p className="mt-1 text-2xs text-white/60">
              合计 {formatMoney(result.totalCost)} 万元
            </p>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-xl p-6 shadow-md"
          style={{
            background:
              'linear-gradient(135deg, #F08035 0%, #E26B2C 50%, #C2410C 100%)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
          />
          <div className="relative">
            <p className="flex items-center gap-1 text-sm text-white/80">
              <Banknote className="h-4 w-4" />
              预估回本周期
            </p>
            <p className="mt-2 text-4xl font-bold text-white sm:text-5xl">
              <CountUp
                end={result.paybackMonths}
                duration={1200}
                suffix=" 个月"
              />
            </p>
            <p className="mt-1 text-2xs text-white/60">
              基于规模月均利润测算，仅供参考
            </p>
          </div>
        </div>
      </div>

      {/* ===== 说明 ===== */}
      <Card padding="md" className="bg-canvas">
        <p className="text-2xs leading-relaxed text-ink-tertiary">
          估算结果基于行业经验系数（设备倍率、城市租金倍率、平均工资等）自动计算，与实际投入可能存在偏差，仅作为创业前期的成本参考。建议结合实际供应商报价与当地市场调研综合决策。
        </p>
      </Card>
    </div>
  )
}
