-- 真实数据库 RLS 验证。整个脚本在事务中执行并最终回滚，不留下测试数据。
begin;

create or replace function pg_temp.try_exec(statement text)
returns boolean
language plpgsql
security invoker
as $$
begin
  execute statement;
  return true;
exception when others then
  return false;
end;
$$;
grant execute on function pg_temp.try_exec(text) to authenticated, anon;

insert into auth.users (id) values
  ('11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222'),
  ('33333333-3333-4333-8333-333333333333'),
  ('44444444-4444-4444-8444-444444444444');

insert into public.profiles (id, email, nickname, phone) values
  ('11111111-1111-4111-8111-111111111111', 'rls-requester@example.invalid', '需求方测试', '13800000001'),
  ('22222222-2222-4222-8222-222222222222', 'rls-printer@example.invalid', '印刷厂测试', '13800000002'),
  ('33333333-3333-4333-8333-333333333333', 'rls-supplier@example.invalid', '供应商测试', '13800000003'),
  ('44444444-4444-4444-8444-444444444444', 'rls-outsider@example.invalid', '未授权测试', null);

insert into public.user_roles (user_id, role, status) values
  ('11111111-1111-4111-8111-111111111111', 'requester', 'active'),
  ('22222222-2222-4222-8222-222222222222', 'printer', 'active'),
  ('33333333-3333-4333-8333-333333333333', 'material_supplier', 'active');

insert into public.companies (id, user_id, company_name, credit_code, license_image_url, contact_name, contact_phone, status) values
  ('22222222-aaaa-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', 'RLS 印刷测试企业', '91440101TEST000002', 'https://example.invalid/printer.jpg', '印刷测试', '13800000002', 'approved'),
  ('33333333-aaaa-4333-8333-333333333333', '33333333-3333-4333-8333-333333333333', 'RLS 供应测试企业', '91440101TEST000003', 'https://example.invalid/supplier.jpg', '供应测试', '13800000003', 'approved');

insert into public.purchases (id, title, product_name, unit_price, min_quantity, target_quantity, current_quantity, start_time, end_time, status, description)
values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'RLS 纸张集采测试', '157g 铜版纸', 1, 1, 10, 0, now() - interval '1 day', now() + interval '7 days', 'active', '事务内 RLS 测试');

insert into public.public_content_snapshots (id, module, display_label, title, summary, source_name, source_url, is_demo, content_hash, source_type, review_status)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'orders', '待审测试', '待审内容', '不可匿名读取', 'RLS test', 'project://rls/pending', true, 'rls-pending-hash', 'project_owned', 'pending'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'orders', '公开测试', '已批准内容', '可以匿名读取', 'RLS test', 'project://rls/approved', true, 'rls-approved-hash', 'project_owned', 'approved');

set local role authenticated;

select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
do $$
begin
  if not pg_temp.try_exec($sql$insert into public.orders (id,user_id,title,category,craft,budget_min,budget_max,region,description,status) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','RLS 公开需求','画册','胶印',1000,2000,'广东','完整公开需求说明','open')$sql$) then
    raise exception 'requester should publish a complete requirement';
  end if;
  if exists (select 1 from public.user_roles where user_id = '22222222-2222-4222-8222-222222222222') then
    raise exception 'requester must not read another user role';
  end if;
  if pg_temp.try_exec($sql$insert into public.bids (order_id,user_id,price,delivery_days,status) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111',1500,5,'pending')$sql$) then
    raise exception 'requester without printer role must not bid';
  end if;
end $$;

select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-8444-444444444444","role":"authenticated"}', true);
do $$
begin
  if pg_temp.try_exec($sql$insert into public.orders (user_id,title,category,craft,budget_min,budget_max,region,description,status) values ('44444444-4444-4444-8444-444444444444','未授权公开需求','画册','胶印',1000,2000,'广东','未授权用户公开需求','open')$sql$) then
    raise exception 'user without requester role and complete profile must not publish';
  end if;
  if not pg_temp.try_exec($sql$insert into public.orders (user_id,title,category,craft,budget_min,budget_max,region,description,status) values ('44444444-4444-4444-8444-444444444444','私人草稿','画册','胶印',1000,2000,'广东','登录用户可以保存草稿','draft')$sql$) then
    raise exception 'authenticated user should save a private draft';
  end if;
end $$;

select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
do $$
begin
  if not pg_temp.try_exec($sql$insert into public.bids (id,order_id,user_id,price,delivery_days,status) values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','22222222-2222-4222-8222-222222222222',1500,5,'pending')$sql$) then
    raise exception 'approved printer should bid';
  end if;
  if pg_temp.try_exec($sql$update public.bids set status='accepted' where id='dddddddd-dddd-4ddd-8ddd-dddddddddddd'$sql$) then
    raise exception 'printer must not accept its own bid';
  end if;
  if pg_temp.try_exec($sql$insert into public.purchase_supply_offers (purchase_id,supplier_user_id,unit_price,minimum_quantity,delivery_days,status) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222',6480,1,3,'pending')$sql$) then
    raise exception 'printer without supplier role must not submit supply offer';
  end if;
end $$;

select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true);
do $$
begin
  if not pg_temp.try_exec($sql$insert into public.purchase_supply_offers (purchase_id,supplier_user_id,unit_price,minimum_quantity,delivery_days,status) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','33333333-3333-4333-8333-333333333333',6480,1,3,'pending')$sql$) then
    raise exception 'approved material supplier should submit supply offer';
  end if;
end $$;

set local role anon;
select set_config('request.jwt.claims', '{}', true);
do $$
declare visible_count integer;
begin
  select count(*) into visible_count from public.public_content_snapshots where id in ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1','cccccccc-cccc-4ccc-8ccc-ccccccccccc2');
  if visible_count <> 1 then
    raise exception 'anonymous content visibility expected 1 approved row, got %', visible_count;
  end if;
  if exists (select 1 from public.orders where status = 'draft') then
    raise exception 'anonymous users must not read drafts';
  end if;
end $$;

reset role;
rollback;
