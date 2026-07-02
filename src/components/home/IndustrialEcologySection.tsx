'use client'

import { motion } from 'framer-motion'

// 产业链节点
interface ChainNode {
  id: string
  label: string
  sub: string
  icon: string
  color: string
}

const CHAIN_NODES: ChainNode[] = [
  { id: 'raw',      label: '原材料',    sub: '纸浆·纤维·化学品',     icon: '🌾', color: '#2BAE6E' },
  { id: 'paper',    label: '纸张生产',  sub: '铜版纸·白卡·双胶纸',   icon: '📋', color: '#00B4D8' },
  { id: 'prepress', label: '印前制版',  sub: 'CTP制版·色彩管理',     icon: '🖥', color: '#4A85E6' },
  { id: 'print',    label: '印刷工厂',  sub: '平版·凸版·数码印刷',   icon: '🖨', color: '#2A6CDB' },
  { id: 'post',     label: '印后加工',  sub: '装订·覆膜·模切·上光',  icon: '⚙️', color: '#7C3AED' },
  { id: 'package',  label: '包装设计',  sub: '包装·标签·品牌印品',   icon: '📦', color: '#F08035' },
  { id: 'logistics',label: '物流配送',  sub: '仓储·运输·末端派送',   icon: '🚚', color: '#F5C518' },
  { id: 'brand',    label: '品牌客户',  sub: '出版·广告·快消·零售',  icon: '🏢', color: '#E55541' },
]

export function IndustrialEcologySection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* 背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #f5f9fe 0%, #e8f1fb 50%, #f0f6fd 100%)',
        }}
      />
      <div className="grid-bg-light absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <div className="h-px w-10 bg-primary/30" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Industrial Ecology
            </span>
            <div className="h-px w-10 bg-primary/30" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            连接印刷产业全链路
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-secondary">
            从原材料到品牌客户，智印联创覆盖印刷行业完整生态，构建协同共赢的产业互联网
          </p>
        </div>

        {/* 产业链横向流程 */}
        <div className="relative">
          {/* 连接线 */}
          <div
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden lg:block"
            style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(42,108,219,0.15) 10%, rgba(42,108,219,0.15) 90%, transparent)' }}
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {CHAIN_NODES.map((node, idx) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.19,1,0.22,1] }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* 步骤编号 */}
                <div
                  className="mb-3 text-xs font-bold"
                  style={{ color: `${node.color}80` }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* 图标圆形 */}
                <div
                  className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md transition-all duration-base group-hover:-translate-y-1 group-hover:shadow-lg"
                  style={{ border: `2px solid ${node.color}25` }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-base group-hover:opacity-100"
                    style={{ background: `${node.color}10` }}
                  />
                  <span className="text-2xl leading-none">{node.icon}</span>
                  {/* 发光点 */}
                  <div
                    className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white"
                    style={{ background: node.color }}
                  />
                </div>

                {/* 节点信息 */}
                <div className="text-xs font-bold text-ink-primary">{node.label}</div>
                <div className="mt-1 text-2xs leading-relaxed text-ink-tertiary hidden sm:block">{node.sub}</div>

                {/* 箭头（非最后一个） */}
                {idx < CHAIN_NODES.length - 1 && (
                  <div
                    className="absolute -right-2 top-[42px] hidden h-4 w-4 items-center justify-center lg:flex"
                    style={{ color: `${node.color}60` }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 底部平台定位说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 overflow-hidden rounded-2xl border border-primary/15 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #E8F1FB, #D6E5F8)' }}
            >
              <span className="text-xl">🔗</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-primary sm:text-lg">
                智印联创 · 产业链数字神经中枢
              </h3>
              <p className="mt-1 text-sm text-ink-secondary">
                平台以 AI 为核心，将分散的印刷行业参与者通过数字化网络连接，实现订单撮合、集采议价、纸价预测、创业扶持的一站式协同，
                成为推动印刷行业高质量发展的数字化基础设施。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
