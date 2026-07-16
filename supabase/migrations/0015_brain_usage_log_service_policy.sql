-- 使用日志只允许服务端服务角色访问；显式策略保留 RLS 语义并消除无策略审计噪声。

create policy "brain_usage_logs_service_only" on public.brain_usage_logs
  for all to service_role
  using (true)
  with check (true);
