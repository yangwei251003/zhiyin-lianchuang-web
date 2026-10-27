-- 单账号多业务身份与集采供货方案

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('requester', 'printer', 'material_supplier')),
  status text not null default 'active' check (status in ('requested', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

create index if not exists user_roles_user_id_idx on public.user_roles(user_id);
create index if not exists user_roles_role_status_idx on public.user_roles(role, status);

create trigger user_roles_updated_at
  before update on public.user_roles
  for each row execute function public.update_updated_at_column();

create table if not exists public.purchase_supply_offers (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  supplier_user_id uuid not null references public.profiles(id) on delete cascade,
  unit_price numeric not null check (unit_price > 0),
  minimum_quantity integer not null check (minimum_quantity > 0),
  delivery_days integer not null check (delivery_days > 0),
  note text not null default '',
  status text not null default 'pending' check (status in ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (purchase_id, supplier_user_id)
);

create index if not exists purchase_supply_offers_purchase_id_idx
  on public.purchase_supply_offers(purchase_id);
create index if not exists purchase_supply_offers_supplier_user_id_idx
  on public.purchase_supply_offers(supplier_user_id);
create index if not exists purchase_supply_offers_status_idx
  on public.purchase_supply_offers(status);

create trigger purchase_supply_offers_updated_at
  before update on public.purchase_supply_offers
  for each row execute function public.update_updated_at_column();

grant select, insert, update on public.user_roles to authenticated;
grant select, insert, update on public.purchase_supply_offers to authenticated;
grant all on public.user_roles to service_role;
grant all on public.purchase_supply_offers to service_role;

alter table public.user_roles enable row level security;
alter table public.purchase_supply_offers enable row level security;

drop policy if exists "user_roles_select_own_or_admin" on public.user_roles;
create policy "user_roles_select_own_or_admin"
  on public.user_roles for select
  to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "user_roles_insert_own" on public.user_roles;
create policy "user_roles_insert_own"
  on public.user_roles for insert
  to authenticated
  with check ((select auth.uid()) = user_id and status = 'active');

drop policy if exists "user_roles_update_admin" on public.user_roles;
create policy "user_roles_update_admin"
  on public.user_roles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "supply_offers_select_own_or_admin" on public.purchase_supply_offers;
create policy "supply_offers_select_own_or_admin"
  on public.purchase_supply_offers for select
  to authenticated
  using ((select auth.uid()) = supplier_user_id or public.is_admin());

drop policy if exists "supply_offers_insert_verified_supplier" on public.purchase_supply_offers;
create policy "supply_offers_insert_verified_supplier"
  on public.purchase_supply_offers for insert
  to authenticated
  with check (
    (select auth.uid()) = supplier_user_id
    and exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
        and user_roles.role = 'material_supplier'
        and user_roles.status = 'active'
    )
    and exists (
      select 1 from public.companies
      where companies.user_id = (select auth.uid())
        and companies.status = 'approved'
    )
  );

drop policy if exists "supply_offers_update_own_or_admin" on public.purchase_supply_offers;
drop policy if exists "supply_offers_update_own_pending" on public.purchase_supply_offers;
create policy "supply_offers_update_own_pending"
  on public.purchase_supply_offers for update
  to authenticated
  using ((select auth.uid()) = supplier_user_id and status in ('pending', 'withdrawn'))
  with check ((select auth.uid()) = supplier_user_id and status in ('pending', 'withdrawn'));

drop policy if exists "supply_offers_update_admin" on public.purchase_supply_offers;
create policy "supply_offers_update_admin"
  on public.purchase_supply_offers for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
