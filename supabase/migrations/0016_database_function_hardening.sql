-- 共享更新时间触发器不依赖调用者的 search_path。
alter function public.update_updated_at_column() set search_path = pg_catalog, public;

-- 该函数仅由数据库 DDL 事件触发器调用，客户端不应能通过 RPC 直接执行。
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
