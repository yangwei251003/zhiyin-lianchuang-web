import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Building2, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { MentorBookingForm } from '@/components/startup/MentorBookingForm'
import type { Database } from '@/types/database'

type MentorRow = Database['public']['Tables']['mentors']['Row']

interface MentorDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return [{ id: '1' }]
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: MentorDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: mentor } = await supabase
    .from('mentors')
    .select('name, title')
    .eq('id', id)
    .maybeSingle()
  if (!mentor) return { title: '导师详情 · 智印联创' }
  const row = mentor as Pick<MentorRow, 'name' | 'title'>
  return {
    title: `${row.name} · ${row.title} · 创业导师 · 智印联创`,
    description: `预约导师 ${row.name} 进行 1 对 1 创业咨询`,
  }
}

// 创业导师详情页（服务端组件）
export default async function MentorDetailPage({
  params,
}: MentorDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. 获取导师详情
  const { data: mentor } = await supabase
    .from('mentors')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!mentor) notFound()
  const mentorRow = mentor as MentorRow

  const expertise = Array.isArray(mentorRow.expertise) ? mentorRow.expertise : []

  return (
    <main className="pb-12">
      {/* ===== 面包屑 ===== */}
      <Container className="pt-6">
        <nav
          className="flex items-center gap-1.5 text-xs text-ink-tertiary"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <Link href="/startup" className="hover:text-primary">
            创业孵化
          </Link>
          <span>/</span>
          <Link href="/startup/mentors" className="hover:text-primary">
            创业导师
          </Link>
          <span>/</span>
          <span className="text-ink-secondary">导师详情</span>
        </nav>
      </Container>

      {/* ===== 主体：导师信息 + 预约表单 ===== */}
      <Container size="lg" className="mt-4">
        <Link
          href="/startup/mentors"
          className="inline-flex items-center gap-1 text-sm text-ink-secondary transition-colors hover:text-environment"
        >
          <ArrowLeft className="h-4 w-4" />
          返回导师列表
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* 左：导师信息卡 */}
          <div className="lg:col-span-3">
            <Card padding="lg">
              <div className="flex flex-col gap-5">
                {/* 头部：大头像 + 姓名 + 职称 + 公司 */}
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-line bg-canvas sm:h-24 sm:w-24">
                    {mentorRow.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mentorRow.avatar}
                        alt={mentorRow.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center"
                        style={{
                          background:
                            'linear-gradient(135deg, #EBF9F3 0%, #F5FBF8 100%)',
                        }}
                      >
                        <UserRound
                          className="h-10 w-10 text-environment/60"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold leading-tight text-ink-primary sm:text-3xl">
                      {mentorRow.name}
                    </h1>
                    <p className="mt-1 text-sm text-ink-secondary sm:text-base">
                      {mentorRow.title}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-tertiary">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="truncate">{mentorRow.company}</span>
                    </p>
                  </div>
                </div>

                {/* 专长标签 */}
                {expertise.length > 0 && (
                  <div>
                    <h2 className="mb-2 text-sm font-semibold text-ink-primary">
                      擅长领域
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {expertise.map((tag) => (
                        <Badge key={tag} variant="success" size="md">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 简介 */}
                <div>
                  <h2 className="mb-2 text-sm font-semibold text-ink-primary">
                    导师简介
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink-secondary">
                    {mentorRow.bio}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* 右：预约表单（AuthGuard 包裹，需登录） */}
          <div className="lg:col-span-2">
            <AuthGuard>
              <MentorBookingForm mentor={mentorRow} />
            </AuthGuard>
          </div>
        </div>
      </Container>
    </main>
  )
}
