'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Hash, User, Phone, Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { AuthStatusCard } from '@/components/mine/AuthStatusCard'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type Company = Database['public']['Tables']['companies']['Row']

// 统一社会信用代码校验：18 位，排除 I/O/S/V/Z（参考 GB 32100-2015）
const CREDIT_CODE_REGEX = /^[0-9ABCDEFGHJKLMNPQRTUWXY]{18}$/
// 11 位手机号：1 开头，第二位 3-9
const PHONE_REGEX = /^1[3-9]\d{9}$/

// 企业认证表单校验 schema
const companySchema = z.object({
  company_name: z
    .string()
    .min(2, '企业名称至少 2 个字')
    .max(50, '企业名称最多 50 个字'),
  credit_code: z
    .string()
    .min(1, '请输入统一社会信用代码')
    .regex(CREDIT_CODE_REGEX, '信用代码应为 18 位（不含 I/O/S/V/Z）'),
  license_image_url: z
    .string()
    .min(1, '请上传营业执照照片'),
  contact_name: z
    .string()
    .min(2, '联系人姓名至少 2 个字')
    .max(20, '联系人姓名最多 20 个字'),
  contact_phone: z
    .string()
    .min(1, '请输入联系电话')
    .regex(PHONE_REGEX, '请输入正确的 11 位手机号'),
})

type CompanyFormValues = z.infer<typeof companySchema>

export interface CompanyAuthFormProps {
  company: Company | null
}

// 企业实名认证表单（客户端组件）
// 根据当前认证状态展示：未认证 → 表单 / 审核中→状态卡 / 已认证→状态卡 / 已驳回→状态卡+表单
export function CompanyAuthForm({ company }: CompanyAuthFormProps) {
  const user = useAuthStore((s) => s.user)
  const refreshProfile = useAuthStore((s) => s.refreshProfile)
  const addToast = useUIStore((s) => s.addToast)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [uploading, setUploading] = useState(false)
  const [licensePreview, setLicensePreview] = useState<string | null>(
    company?.license_image_url ?? null,
  )
  const [submitted, setSubmitted] = useState(false)

  // 判断当前认证状态
  const status = company?.status as
    | 'pending'
    | 'approved'
    | 'rejected'
    | undefined
  // 表单可见：未认证或驳回时显示表单；pending/approved 隐藏表单
  const shouldShowForm = !company || status === 'rejected'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_name: company?.company_name ?? '',
      credit_code: company?.credit_code ?? '',
      license_image_url: company?.license_image_url ?? '',
      contact_name: company?.contact_name ?? '',
      contact_phone: company?.contact_phone ?? '',
    },
  })

  const licenseUrl = watch('license_image_url')

  // 营业执照上传
  const handleLicenseChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', message: '请选择图片文件' })
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const filePath = `company-licenses/${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('company-licenses')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('company-licenses').getPublicUrl(filePath)

      setLicensePreview(publicUrl)
      setValue('license_image_url', publicUrl, { shouldDirty: true })
      addToast({ type: 'success', message: '营业执照上传成功' })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '上传失败，请重试'
      addToast({ type: 'error', message })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeLicense = () => {
    setLicensePreview(null)
    setValue('license_image_url', '', { shouldDirty: true })
  }

  // 重新提交：滚动到表单
  const handleResubmit = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onSubmit = async (values: CompanyFormValues) => {
    if (!user) return
    try {
      const supabase = createClient()
      const payload = {
        user_id: user.id,
        company_name: values.company_name.trim(),
        credit_code: values.credit_code.trim().toUpperCase(),
        license_image_url: values.license_image_url,
        contact_name: values.contact_name.trim(),
        contact_phone: values.contact_phone.trim(),
        status: 'pending',
        reject_reason: null,
      }

      if (!company) {
        // 首次认证：插入
        const { error } = await supabase.from('companies').insert(payload)
        if (error) throw error
      } else {
        // 驳回后重新提交：更新
        const { error } = await supabase
          .from('companies')
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', company.id)
        if (error) throw error
      }

      // 刷新 auth-store 中的 company
      await refreshProfile()
      setSubmitted(true)
      addToast({ type: 'success', message: '认证申请已提交，请等待审核' })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '提交失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  // 已提交成功：显示审核中状态卡
  if (submitted) {
    return (
      <AuthStatusCard
        status="pending"
        company={
          {
            ...(company ?? {}),
            company_name: watch('company_name'),
            credit_code: watch('credit_code'),
            contact_name: watch('contact_name'),
            contact_phone: watch('contact_phone'),
            license_image_url: watch('license_image_url'),
            status: 'pending',
            reject_reason: null,
          } as Company
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      {/* 认证状态卡（pending / approved / rejected） */}
      {status === 'pending' && (
        <AuthStatusCard status="pending" company={company} />
      )}
      {status === 'approved' && (
        <AuthStatusCard status="approved" company={company} />
      )}
      {status === 'rejected' && (
        <AuthStatusCard
          status="rejected"
          company={company}
          onResubmit={handleResubmit}
        />
      )}

      {/* 未认证或已驳回时显示表单 */}
      {shouldShowForm && (
        <div ref={formRef}>
          <Card padding="lg" className="animate-fade-in-up">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-ink-primary">
                {status === 'rejected' ? '重新提交认证' : '企业实名认证'}
              </h2>
              <p className="mt-1 text-sm text-ink-secondary">
                {status === 'rejected'
                  ? '请根据驳回原因修改信息后重新提交'
                  : '完成企业认证后可发布订单、参与报价与集采'}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* 企业名称 */}
              <Input
                label="企业名称"
                placeholder="请输入企业全称（2-50 字）"
                maxLength={50}
                leftIcon={<Building2 className="h-4 w-4" />}
                error={errors.company_name?.message}
                {...register('company_name')}
              />

              {/* 统一社会信用代码 */}
              <Input
                label="统一社会信用代码"
                placeholder="请输入 18 位信用代码"
                maxLength={18}
                leftIcon={<Hash className="h-4 w-4" />}
                hint="18 位，不含 I/O/S/V/Z 字符"
                error={errors.credit_code?.message}
                {...register('credit_code')}
              />

              {/* 营业执照上传 */}
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-ink-primary">
                  营业执照
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLicenseChange}
                  className="hidden"
                />
                {licensePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={licensePreview}
                      alt="营业执照预览"
                      className="h-44 w-full max-w-sm rounded-lg border border-line object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeLicense}
                      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                      aria-label="移除图片"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={cn(
                      'flex h-44 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors duration-fast ease-out-expo',
                      errors.license_image_url
                        ? 'border-danger/40 bg-danger-bg'
                        : 'border-line bg-canvas hover:border-primary/40 hover:bg-primary-bg-subtle',
                    )}
                  >
                    {uploading ? (
                      <>
                        <Spinner size="md" />
                        <span className="text-sm text-ink-secondary">
                          上传中...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-bg">
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-ink-secondary">
                          点击上传营业执照
                        </span>
                        <span className="text-xs text-ink-tertiary">
                          支持 JPG / PNG，需清晰可辨
                        </span>
                      </>
                    )}
                  </button>
                )}
                {errors.license_image_url && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.license_image_url.message}
                  </p>
                )}
              </div>

              {/* 联系人姓名 */}
              <Input
                label="联系人姓名"
                placeholder="请输入联系人姓名（2-20 字）"
                maxLength={20}
                leftIcon={<User className="h-4 w-4" />}
                error={errors.contact_name?.message}
                {...register('contact_name')}
              />

              {/* 联系电话 */}
              <Input
                label="联系电话"
                placeholder="请输入 11 位手机号"
                maxLength={11}
                leftIcon={<Phone className="h-4 w-4" />}
                error={errors.contact_phone?.message}
                {...register('contact_phone')}
              />

              {/* 底部按钮 */}
              <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting || uploading}
                  leftIcon={<Upload className="h-4 w-4" />}
                >
                  {isSubmitting ? '提交中...' : '提交认证申请'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
