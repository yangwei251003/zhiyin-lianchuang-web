-- ============================================================================
-- 智印联创 Web 端 - RLS（行级安全）策略
-- 文件：0002_rls_policies.sql
-- 说明：为全部 13 张业务表启用 RLS 并配置策略
-- 依赖：0001_init_schema.sql 已创建表结构
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 管理员判定函数
-- 通过 JWT 的 app_metadata.role 字段判断是否为管理员
-- 在 Supabase Dashboard → Authentication → Users 中为用户设置 app_metadata:
--   { "role": "admin" }
-- 即可赋予管理员权限。service_role 会自动绕过 RLS，无需额外处理。
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select coalesce(
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
        false
    );
$$;

-- ============================================================================
-- 1. profiles 用户档案
-- 用户只能 select/update 自己的记录
-- ============================================================================
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
    for update using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================================
-- 2. companies 企业认证
-- 用户只能 select/update 自己的记录；admin 可 select 所有
-- ============================================================================
alter table public.companies enable row level security;

drop policy if exists "companies_select" on public.companies;
create policy "companies_select" on public.companies
    for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "companies_insert_own" on public.companies;
create policy "companies_insert_own" on public.companies
    for insert with check (auth.uid() = user_id);

drop policy if exists "companies_update_own" on public.companies;
create policy "companies_update_own" on public.companies
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 3. orders 订单
-- 所有人（含匿名）可 select；仅 owner 可 insert/update/delete
-- ============================================================================
alter table public.orders enable row level security;

drop policy if exists "orders_select_all" on public.orders;
create policy "orders_select_all" on public.orders
    for select using (true);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
    for insert with check (auth.uid() = user_id);

drop policy if exists "orders_update_own" on public.orders;
create policy "orders_update_own" on public.orders
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "orders_delete_own" on public.orders;
create policy "orders_delete_own" on public.orders
    for delete using (auth.uid() = user_id);

-- ============================================================================
-- 4. bids 报价
-- 所有人可 select；仅 owner 可 insert/update/delete
-- ============================================================================
alter table public.bids enable row level security;

drop policy if exists "bids_select_all" on public.bids;
create policy "bids_select_all" on public.bids
    for select using (true);

drop policy if exists "bids_insert_own" on public.bids;
create policy "bids_insert_own" on public.bids
    for insert with check (auth.uid() = user_id);

drop policy if exists "bids_update_own" on public.bids;
create policy "bids_update_own" on public.bids
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "bids_delete_own" on public.bids;
create policy "bids_delete_own" on public.bids
    for delete using (auth.uid() = user_id);

-- ============================================================================
-- 5. capacities 产能
-- 所有人可 select；仅 owner 可 insert/update/delete
-- ============================================================================
alter table public.capacities enable row level security;

drop policy if exists "capacities_select_all" on public.capacities;
create policy "capacities_select_all" on public.capacities
    for select using (true);

drop policy if exists "capacities_insert_own" on public.capacities;
create policy "capacities_insert_own" on public.capacities
    for insert with check (auth.uid() = user_id);

drop policy if exists "capacities_update_own" on public.capacities;
create policy "capacities_update_own" on public.capacities
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "capacities_delete_own" on public.capacities;
create policy "capacities_delete_own" on public.capacities
    for delete using (auth.uid() = user_id);

-- ============================================================================
-- 6. purchases 集采活动
-- 表无 user_id 字段：所有人可 select；仅 admin 可 insert/update/delete
-- ============================================================================
alter table public.purchases enable row level security;

drop policy if exists "purchases_select_all" on public.purchases;
create policy "purchases_select_all" on public.purchases
    for select using (true);

drop policy if exists "purchases_insert_admin" on public.purchases;
create policy "purchases_insert_admin" on public.purchases
    for insert with check (public.is_admin());

drop policy if exists "purchases_update_admin" on public.purchases;
create policy "purchases_update_admin" on public.purchases
    for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "purchases_delete_admin" on public.purchases;
create policy "purchases_delete_admin" on public.purchases
    for delete using (public.is_admin());

-- ============================================================================
-- 7. purchase_orders 集采订单
-- 用户只能 select/insert 自己的订单
-- ============================================================================
alter table public.purchase_orders enable row level security;

drop policy if exists "purchase_orders_select_own" on public.purchase_orders;
create policy "purchase_orders_select_own" on public.purchase_orders
    for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "purchase_orders_insert_own" on public.purchase_orders;
create policy "purchase_orders_insert_own" on public.purchase_orders
    for insert with check (auth.uid() = user_id);

-- ============================================================================
-- 8. messages 消息
-- 用户只能 select/update 自己的消息
-- ============================================================================
alter table public.messages enable row level security;

drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
    for select using (auth.uid() = user_id);

drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own" on public.messages
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 9. articles 创业文章
-- 所有人可 select；仅 admin 可 insert/update/delete
-- ============================================================================
alter table public.articles enable row level security;

drop policy if exists "articles_select_all" on public.articles;
create policy "articles_select_all" on public.articles
    for select using (true);

drop policy if exists "articles_insert_admin" on public.articles;
create policy "articles_insert_admin" on public.articles
    for insert with check (public.is_admin());

drop policy if exists "articles_update_admin" on public.articles;
create policy "articles_update_admin" on public.articles
    for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "articles_delete_admin" on public.articles;
create policy "articles_delete_admin" on public.articles
    for delete using (public.is_admin());

-- ============================================================================
-- 10. cases 创业案例
-- 所有人可 select；仅 admin 可 insert/update/delete
-- ============================================================================
alter table public.cases enable row level security;

drop policy if exists "cases_select_all" on public.cases;
create policy "cases_select_all" on public.cases
    for select using (true);

drop policy if exists "cases_insert_admin" on public.cases;
create policy "cases_insert_admin" on public.cases
    for insert with check (public.is_admin());

drop policy if exists "cases_update_admin" on public.cases;
create policy "cases_update_admin" on public.cases
    for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cases_delete_admin" on public.cases;
create policy "cases_delete_admin" on public.cases
    for delete using (public.is_admin());

-- ============================================================================
-- 11. mentors 创业导师
-- 所有人可 select；仅 admin 可 insert/update/delete
-- ============================================================================
alter table public.mentors enable row level security;

drop policy if exists "mentors_select_all" on public.mentors;
create policy "mentors_select_all" on public.mentors
    for select using (true);

drop policy if exists "mentors_insert_admin" on public.mentors;
create policy "mentors_insert_admin" on public.mentors
    for insert with check (public.is_admin());

drop policy if exists "mentors_update_admin" on public.mentors;
create policy "mentors_update_admin" on public.mentors
    for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "mentors_delete_admin" on public.mentors;
create policy "mentors_delete_admin" on public.mentors
    for delete using (public.is_admin());

-- ============================================================================
-- 12. mentor_bookings 导师预约
-- 用户只能 select/insert 自己的预约（admin 可查看全部）
-- ============================================================================
alter table public.mentor_bookings enable row level security;

drop policy if exists "mentor_bookings_select_own" on public.mentor_bookings;
create policy "mentor_bookings_select_own" on public.mentor_bookings
    for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "mentor_bookings_insert_own" on public.mentor_bookings;
create policy "mentor_bookings_insert_own" on public.mentor_bookings
    for insert with check (auth.uid() = user_id);

drop policy if exists "mentor_bookings_update_own" on public.mentor_bookings;
create policy "mentor_bookings_update_own" on public.mentor_bookings
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 13. price_predictions AI 纸价预测
-- 所有人可 select；仅 admin 可 insert/update/delete
-- ============================================================================
alter table public.price_predictions enable row level security;

drop policy if exists "price_predictions_select_all" on public.price_predictions;
create policy "price_predictions_select_all" on public.price_predictions
    for select using (true);

drop policy if exists "price_predictions_insert_admin" on public.price_predictions;
create policy "price_predictions_insert_admin" on public.price_predictions
    for insert with check (public.is_admin());

drop policy if exists "price_predictions_update_admin" on public.price_predictions;
create policy "price_predictions_update_admin" on public.price_predictions
    for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "price_predictions_delete_admin" on public.price_predictions;
create policy "price_predictions_delete_admin" on public.price_predictions
    for delete using (public.is_admin());
