-- 修复项目既有默认授权：RLS 是行级防线，表级授权也应遵循最小权限。
-- 智印大脑的访客只能使用无持久化会话，不得经由 Data API 访问私有工作区表。

revoke all on table public.brain_conversations from anon, authenticated;
revoke all on table public.brain_messages from anon, authenticated;
revoke all on table public.brain_drafts from anon, authenticated;
revoke all on table public.brain_usage_logs from anon, authenticated;

grant select, insert, update, delete on table public.brain_conversations to authenticated;
grant select, insert on table public.brain_messages to authenticated;
grant select, insert, update on table public.brain_drafts to authenticated;

-- 仅服务端服务角色写入审计日志；不向 Data API 的用户角色授予任何权限。
grant all on table public.brain_usage_logs to service_role;
