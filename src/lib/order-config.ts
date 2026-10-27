// 订单模块共享选项配置
// 供订单/产能列表筛选与发布表单复用，避免在各页面重复硬编码

export const ORDER_CATEGORIES = [
  '画册',
  '海报',
  '包装盒',
  '手提袋',
  '名片',
  '其他',
] as const

export const ORDER_CRAFTS = [
  '胶印',
  '数码',
  '丝网',
  'UV',
  '烫金',
] as const

// 常用印刷产业聚集省份/地区
export const REGIONS = [
  '北京',
  '上海',
  '广东',
  '浙江',
  '江苏',
  '福建',
  '山东',
  '河北',
  '四川',
  '湖北',
  '其他',
] as const

export const CAPACITY_DEVICES = [
  '胶印机',
  '数码印刷机',
  '丝网印刷机',
  'UV印刷机',
  '烫金机',
] as const

export interface StatusOption {
  value: string
  label: string
}

// 订单状态筛选选项（all 表示不筛选）
export const ORDER_STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: '全部' },
  { value: 'open', label: '招标中' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

export const MY_ORDER_STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  ...ORDER_STATUS_OPTIONS.slice(1),
]

export const CAPACITY_STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: '全部' },
  { value: 'available', label: '可接单' },
  { value: 'busy', label: '忙碌中' },
  { value: 'offline', label: '已下线' },
]

export const BID_STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'accepted', label: '已采纳' },
  { value: 'rejected', label: '已拒绝' },
]

// 状态文案映射
export const ORDER_STATUS_LABEL: Record<string, string> = {
  draft: '草稿',
  open: '招标中',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
}

export const CAPACITY_STATUS_LABEL: Record<string, string> = {
  available: '可接单',
  busy: '忙碌中',
  offline: '已下线',
}

export const BID_STATUS_LABEL: Record<string, string> = {
  pending: '待处理',
  accepted: '已采纳',
  rejected: '已拒绝',
}
