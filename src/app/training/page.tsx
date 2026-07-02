import type { Metadata } from 'next'
import {
  GraduationCap,
  Play,
  FileText,
  Clock,
  BookOpen,
  Award,
  Video,
  Monitor,
  Flame,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'

export const metadata: Metadata = {
  title: '技术培训 · 智印学堂 · 智印联创',
  description: '提供系统化印刷设备操作、色彩管理、印前排版技术培训与企业级技术规范指导。',
}

// 演示视频数据，使用本地复制的 Heidelberg 与 Manroland MP4 文件
const TRAINING_VIDEOS = [
  {
    title: '海德堡多色胶印机动画演示及操作规范',
    duration: '04:10',
    views: '1,280 次播放',
    videoUrl: '/videos/heidelberg.mp4',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: '海德堡 Speedmaster 印刷机结构分析、给纸与收纸机构动态演示、安全操作红线。',
    level: '入门级',
  },
  {
    title: '罗兰超对开印刷机操作演示与技术指南',
    duration: '02:45',
    views: '850 次播放',
    videoUrl: '/videos/manroland.mp4',
    poster: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    description: '罗兰（Manroland）超大对开规格印刷机多色组气动与油墨传输调校演示。',
    level: '专业级',
  },
]

// 预设培训信息和技术标准，供页面美观展示
const TECHNICAL_INFO = [
  {
    category: '印刷操作',
    title: '胶印车间温湿度控制与网点扩大率矫正规程',
    date: '2026-07-15',
    author: '李雅琴 (技术专家)',
  },
  {
    category: '印前技术',
    title: 'PDF/X-4 印前检查标准及出血线/专色层规范',
    date: '2026-07-10',
    author: '印艺文创工坊',
  },
  {
    category: '色彩管理',
    title: 'G7 色彩校准原理与海德堡 CPC 控墨台匹配规程',
    date: '2026-07-01',
    author: '张建国 (资深顾问)',
  },
]

// 技术培训独立版面：顶端 Hero + 动态本地视频联播 + 技术标准与通告卡片
export default function TrainingPage() {
  return (
    <main className="pb-16">
      <PageHeader
        title="智印学堂 · 技术培训中心"
        subtitle="Training Center · Skills Empowerment"
        desc="掌握一流印刷技术，规范企业安全生产，提供设备操作演示与行业权威规范，赋能从业者全面成长"
        theme="purple"
        badge="技术规范与安全"
        icon={<GraduationCap className="h-3.5 w-3.5" />}
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '技术培训' }]}
      />

      {/* ===== 内容区 ===== */}
      <Container className="mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* 左侧及中间：视频演示大区 (2格宽) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-ink-primary">设备操作演示视频</h2>
              </div>
              <span className="text-xs text-ink-tertiary">本地高清渲染播放</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TRAINING_VIDEOS.map((v, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-all duration-base hover:-translate-y-1 hover:shadow-md"
                >
                  {/* 视频容器 */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <video
                      src={v.videoUrl}
                      controls
                      poster={v.poster}
                      className="h-full w-full object-cover"
                    />
                    {/* 时间徽标 */}
                    <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-2xs font-semibold text-white">
                      {v.duration}
                    </span>
                  </div>
                  {/* 视频元数据 */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-2xs font-medium text-indigo-700">
                        {v.level}
                      </span>
                      <span className="text-2xs text-ink-tertiary">{v.views}</span>
                    </div>
                    <h3 className="line-clamp-1 text-sm font-bold text-ink-primary transition-colors group-hover:text-indigo-600">
                      {v.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 宣传卡片 */}
            <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-indigo-900">企业级定制化技术内训服务</h4>
                <p className="mt-1 text-xs text-indigo-700">
                  支持根据贵厂现有胶印机/数码印刷机型号，定制录制标准操作指南（SOP）视频，规范印前印后各工序操作规范。
                </p>
              </div>
            </div>
          </div>

          {/* 右侧：企业技术信息与培训资讯 (1格宽) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-ink-primary">企业技术文档与规范</h2>
              </div>
            </div>

            <div className="space-y-3">
              {TECHNICAL_INFO.map((info, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-line bg-white p-4 transition-colors hover:border-indigo-300"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-2xs font-semibold text-indigo-600">
                      {info.category}
                    </span>
                    <span className="text-2xs text-ink-tertiary">{info.date}</span>
                  </div>
                  <h4 className="mt-2 text-xs font-bold leading-normal text-ink-primary hover:text-indigo-600 cursor-pointer line-clamp-2">
                    {info.title}
                  </h4>
                  <p className="mt-1 text-2xs text-ink-tertiary">作者：{info.author}</p>
                </div>
              ))}
            </div>

            {/* 培训通告 */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4.5 w-4.5 text-indigo-600" />
                <h3 className="text-sm font-bold text-ink-primary">线下技术研讨班 (筹备中)</h3>
              </div>
              <ul className="space-y-3 text-xs text-ink-secondary">
                <li className="flex gap-2">
                  <span className="font-semibold text-indigo-600">01.</span>
                  <span><strong>海德堡数码控墨及拼版实战班</strong>（预计8月中旬·东莞厚街）</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-indigo-600">02.</span>
                  <span><strong>印刷厂精益生产与废料率管控课</strong>（预计9月上旬·广州黄埔）</span>
                </li>
              </ul>
              <p className="mt-4 border-t border-line pt-3 text-2xs text-ink-tertiary text-center">
                * 详细课表和报名链接将于近期公布，敬请关注
              </p>
            </div>

          </div>

        </div>
      </Container>
    </main>
  )
}
