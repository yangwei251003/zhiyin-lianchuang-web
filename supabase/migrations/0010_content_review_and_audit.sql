-- 内容可信运营：来源白名单、采集待审、许可台账与管理员审计

alter table public.public_content_snapshots
  add column if not exists content_hash text,
  add column if not exists source_type text not null default 'project_owned' check (source_type in ('project_owned', 'official', 'licensed_media')),
  add column if not exists license_name text,
  add column if not exists license_url text,
  add column if not exists review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected', 'archived')),
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists expires_at timestamptz,
  add column if not exists raw_excerpt text;

update public.public_content_snapshots
set content_hash = md5(source_url || '|' || title || '|' || summary)
where content_hash is null;
alter table public.public_content_snapshots alter column content_hash set not null;
create unique index if not exists public_content_snapshots_content_hash_uidx
  on public.public_content_snapshots(content_hash);
create index if not exists public_content_snapshots_public_idx
  on public.public_content_snapshots(review_status, expires_at, captured_at desc);

create table if not exists public.source_registry (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_name text not null,
  base_url text not null,
  source_type text not null check (source_type in ('project_owned', 'official', 'licensed_media')),
  license_name text,
  license_url text,
  is_allowed boolean not null default false,
  review_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger source_registry_updated_at before update on public.source_registry
  for each row execute function public.update_updated_at_column();

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_logs_created_at_idx on public.admin_audit_logs(created_at desc);
create index if not exists admin_audit_logs_entity_idx on public.admin_audit_logs(entity_type, entity_id);

insert into public.source_registry (source_key, source_name, base_url, source_type, license_name, license_url, is_allowed, review_notes)
values
  ('project_research', '智印联创项目调研', 'project://research', 'project_owned', '项目自有内容', null, true, '仅导入商业计划书和团队问卷中可公开核验的摘要'),
  ('ccgp', '中国政府采购网', 'https://www.ccgp.gov.cn/', 'official', '政府网站公开信息', 'https://www.ccgp.gov.cn/', true, '只采集公开采购公告标题、链接和摘要，发布前人工审核'),
  ('pexels', 'Pexels', 'https://www.pexels.com/', 'licensed_media', 'Pexels License', 'https://www.pexels.com/license/', true, '素材需记录原始页面，不得暗示人物或品牌背书')
on conflict (source_key) do update set
  source_name = excluded.source_name,
  base_url = excluded.base_url,
  source_type = excluded.source_type,
  license_name = excluded.license_name,
  license_url = excluded.license_url,
  review_notes = excluded.review_notes;

grant select on public.public_content_snapshots to anon, authenticated;
grant insert, update on public.public_content_snapshots to authenticated;
grant select on public.source_registry to anon, authenticated;
grant insert, update on public.source_registry to authenticated;
grant select, insert on public.admin_audit_logs to authenticated;
grant all on public.public_content_snapshots, public.source_registry, public.admin_audit_logs to service_role;

alter table public.source_registry enable row level security;
alter table public.admin_audit_logs enable row level security;

drop policy if exists "public_content_snapshots_select" on public.public_content_snapshots;
drop policy if exists "content_snapshots_select_approved" on public.public_content_snapshots;
create policy "content_snapshots_select_approved" on public.public_content_snapshots
  for select using (
    (review_status = 'approved' and (expires_at is null or expires_at > now()))
    or public.is_admin()
  );
drop policy if exists "content_snapshots_admin_insert" on public.public_content_snapshots;
create policy "content_snapshots_admin_insert" on public.public_content_snapshots for insert to authenticated
  with check (public.is_admin());
drop policy if exists "content_snapshots_admin_update" on public.public_content_snapshots;
create policy "content_snapshots_admin_update" on public.public_content_snapshots for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "source_registry_public_select" on public.source_registry;
create policy "source_registry_public_select" on public.source_registry for select using (is_allowed or public.is_admin());
drop policy if exists "source_registry_admin_write" on public.source_registry;
create policy "source_registry_admin_write" on public.source_registry for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_audit_logs_admin_select" on public.admin_audit_logs;
create policy "admin_audit_logs_admin_select" on public.admin_audit_logs for select to authenticated using (public.is_admin());
drop policy if exists "admin_audit_logs_admin_insert" on public.admin_audit_logs;
create policy "admin_audit_logs_admin_insert" on public.admin_audit_logs for insert to authenticated with check (public.is_admin());
