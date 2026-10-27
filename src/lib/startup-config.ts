// 产教实践模块共享配置（保留 startup 路径兼容既有链接）
// 供投资计算器、列表筛选、卡片展示复用，避免在各页面重复硬编码
// 费用系数表参考 miniprogram/pages/startup/startup_calculator.js 的算法，
// 并按 Task 要求扩展为「设备类型 × 规模 × 城市」三维查表。

// ===== 设备类型 =====
// 胶印机/数码印刷机/丝网印刷机/UV印刷机/烫金机
// coefficient: 在规模基准设备费上的倍率
export interface DeviceTypeOption {
  value: string
  label: string
  coefficient: number // 设备费倍率
}

export const DEVICE_TYPES: DeviceTypeOption[] = [
  { value: 'offset', label: '胶印机', coefficient: 1.0 },
  { value: 'digital', label: '数码印刷机', coefficient: 0.9 },
  { value: 'screen', label: '丝网印刷机', coefficient: 0.7 },
  { value: 'uv', label: 'UV印刷机', coefficient: 1.1 },
  { value: 'hotstamp', label: '烫金机', coefficient: 0.6 },
]

// ===== 规模 =====
// 小型/中型/大型
// baseEquipment: 基准设备购置费（万元）
// area: 场地面积（平米）
// materialStock: 原材料备货首月（万元）
// otherCost: 其他费用（含营销/水电/杂费，万元）
// monthlyProfit: 月均利润（万元，用于回本周期计算）
export interface ScaleOption {
  value: string
  label: string
  baseEquipment: number // 万元
  area: number // 平米
  materialStock: number // 万元
  otherCost: number // 万元
  monthlyProfit: number // 万元
}

export const SCALES: ScaleOption[] = [
  {
    value: 'small',
    label: '小型',
    baseEquipment: 30,
    area: 100,
    materialStock: 3,
    otherCost: 2,
    monthlyProfit: 2,
  },
  {
    value: 'medium',
    label: '中型',
    baseEquipment: 80,
    area: 200,
    materialStock: 8,
    otherCost: 5,
    monthlyProfit: 5,
  },
  {
    value: 'large',
    label: '大型',
    baseEquipment: 200,
    area: 400,
    materialStock: 20,
    otherCost: 10,
    monthlyProfit: 12,
  },
]

// ===== 城市 =====
// 一线/二线/三线城市
// rentCoefficient: 场地租金倍率（相对基准月租 65 元/平米）
// avgSalary: 平均月薪（元）
export interface CityOption {
  value: string
  label: string
  rentCoefficient: number
  avgSalary: number // 元/月
}

export const CITIES: CityOption[] = [
  { value: 'tier1', label: '一线城市', rentCoefficient: 1.3, avgSalary: 8000 },
  { value: 'tier2', label: '二线城市', rentCoefficient: 1.0, avgSalary: 6000 },
  { value: 'tier3', label: '三线城市', rentCoefficient: 0.7, avgSalary: 4500 },
]

// 基准月租（元/平米）
export const MONTHLY_RENT_PER_SQM = 65

// ===== 计算结果项 =====
export interface CalcResult {
  equipmentCost: number // 设备购置费（万元）
  rentCost: number // 场地租金首年（万元）
  materialCost: number // 原材料备货（万元）
  salaryCost: number // 人员工资首年（万元）
  otherCost: number // 其他费用（万元）
  totalCost: number // 预估总投入（万元）
  paybackMonths: number // 回本周期（月）
}

// 计算入口：根据输入实时计算各项费用
export function calculateInvestment(input: {
  deviceType: string
  scale: string
  city: string
  employees: number
}): CalcResult {
  const device =
    DEVICE_TYPES.find((d) => d.value === input.deviceType) ?? DEVICE_TYPES[0]
  const scale =
    SCALES.find((s) => s.value === input.scale) ?? SCALES[0]
  const city = CITIES.find((c) => c.value === input.city) ?? CITIES[0]
  const employees = Math.max(0, Math.floor(input.employees || 0))

  // 1. 设备购置费 = 规模基准 × 设备倍率（保留 1 位小数）
  const equipmentCost = round1(scale.baseEquipment * device.coefficient)

  // 2. 场地租金（首年） = 面积 × 月租单价 × 城市倍率 × 12 个月（转万元）
  const rentCost = round1(
    (scale.area * MONTHLY_RENT_PER_SQM * city.rentCoefficient * 12) / 10000,
  )

  // 3. 原材料备货（首月，查表）
  const materialCost = round1(scale.materialStock)

  // 4. 人员工资（首年） = 员工人数 × 城市平均月薪 × 12 个月（转万元）
  const salaryCost = round1((employees * city.avgSalary * 12) / 10000)

  // 5. 其他费用（查表）
  const otherCost = round1(scale.otherCost)

  // 6. 预估总投入 = 上述 5 项之和
  const totalCost = round1(
    equipmentCost + rentCost + materialCost + salaryCost + otherCost,
  )

  // 7. 回本周期 = 预估总投入 / 月均利润（向上取整）
  const paybackMonths =
    scale.monthlyProfit > 0 ? Math.ceil(totalCost / scale.monthlyProfit) : 0

  return {
    equipmentCost,
    rentCost,
    materialCost,
    salaryCost,
    otherCost,
    totalCost,
    paybackMonths,
  }
}

// 保留 1 位小数
function round1(n: number): number {
  return Math.round(n * 10) / 10
}

// ===== 工具函数 =====
// 格式化金额（千分位）
export function formatMoney(value: number): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}
