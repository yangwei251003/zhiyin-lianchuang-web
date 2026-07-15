import { createClient } from '@/lib/supabase/server'
import { buildRolePermissionContext } from './role-context'
import type { RolePermissionContext } from '@/types/platform'
import type { RolePermissionAction } from '@/types/platform'
import { canPerformRoleAction } from './roles'

export async function getServerRoleContext(userId: string, appRole: unknown): Promise<RolePermissionContext> {
  const supabase = await createClient()
  const [{ data: profile }, { data: company }, { data: roleRows }] = await Promise.all([
    supabase.from('profiles').select('nickname, phone, email').eq('id', userId).maybeSingle(),
    supabase.from('companies').select('status').eq('user_id', userId).maybeSingle(),
    supabase.from('user_roles').select('role, status').eq('user_id', userId),
  ])

  return buildRolePermissionContext({
    profile,
    companyStatus: company?.status ?? null,
    roleRows: roleRows ?? [],
    appRole,
  })
}

export async function authorizeBusinessAction(action: RolePermissionAction) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { allowed: false as const, status: 401, reason: '请先登录' }

  const context = await getServerRoleContext(user.id, user.app_metadata?.role)
  if (!canPerformRoleAction(action, context)) {
    return { allowed: false as const, status: 403, reason: '当前身份或认证状态不满足此操作要求' }
  }
  return { allowed: true as const, user, context, supabase }
}
