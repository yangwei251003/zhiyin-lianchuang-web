'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Camera, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

// 个人资料编辑表单校验 schema
const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, '昵称至少 2 个字')
    .max(20, '昵称最多 20 个字'),
  phone: z
    .string()
    .refine((v) => v === '' || /^1[3-9]\d{9}$/.test(v), {
      message: '请输入正确的 11 位手机号',
    })
    .optional(),
  avatar_url: z.string().nullable().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export interface ProfileEditFormProps {
  profile: Profile
}

// 个人资料编辑表单（客户端组件）
// 头像上传到 avatars bucket，提交更新 profiles 表并刷新 auth-store
export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const refreshProfile = useAuthStore((s) => s.refreshProfile)
  const addToast = useUIStore((s) => s.addToast)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar_url ?? null,
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: profile.nickname,
      phone: profile.phone ?? '',
      avatar_url: profile.avatar_url ?? null,
    },
  })

  // 头像上传：选择文件 → 上传到 Supabase Storage → 回填 publicUrl
  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // 仅允许图片类型
    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', message: '请选择图片文件' })
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const filePath = `avatars/${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      setAvatarPreview(publicUrl)
      setValue('avatar_url', publicUrl, { shouldDirty: true })
      addToast({ type: 'success', message: '头像上传成功' })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '头像上传失败，请重试'
      addToast({ type: 'error', message })
    } finally {
      setUploading(false)
      // 重置 input 以便重复选择同一文件
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          nickname: values.nickname.trim(),
          phone: values.phone || null,
          avatar_url: values.avatar_url ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      // 刷新 auth-store 中的 profile
      await refreshProfile()
      addToast({ type: 'success', message: '资料更新成功' })
      router.push('/mine')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '更新失败，请稍后重试'
      addToast({ type: 'error', message })
    }
  }

  const initial = profile.nickname.charAt(0).toUpperCase() || 'U'

  return (
    <Card padding="lg" className="animate-fade-in-up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 头像上传 */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="group relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-line transition-all duration-base ease-out-expo hover:ring-primary"
              aria-label="上传头像"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="头像预览"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-bg text-3xl font-bold text-primary">
                  {initial}
                </div>
              )}
              {/* 遮罩 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-fast ease-out-expo group-hover:opacity-100">
                {uploading ? (
                  <Spinner size="sm" className="text-white" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-ink-primary">头像</p>
            <p className="mt-1 text-xs text-ink-tertiary">
              支持 JPG / PNG，建议尺寸 256×256
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2 inline-flex h-8 items-center justify-center rounded-sm border border-line bg-white px-3 text-xs font-medium text-ink-secondary transition-colors duration-fast ease-out-expo hover:border-primary/30 hover:text-primary disabled:opacity-50"
            >
              {uploading ? '上传中...' : '更换头像'}
            </button>
          </div>
        </div>

        {/* 昵称 */}
        <Input
          label="昵称"
          placeholder="请输入昵称（2-20 字）"
          maxLength={20}
          leftIcon={<User className="h-4 w-4" />}
          error={errors.nickname?.message}
          {...register('nickname')}
        />

        {/* 手机号 */}
        <Input
          label="手机号"
          placeholder="请输入 11 位手机号（选填）"
          maxLength={11}
          hint="用于订单联系与消息通知，选填"
          error={errors.phone?.message}
          {...register('phone')}
        />

        {/* 邮箱（只读） */}
        <Input
          label="邮箱"
          value={profile.email}
          disabled
          hint="邮箱暂不支持修改"
        />

        {/* 底部按钮 */}
        <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? '保存中...' : '保存资料'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
