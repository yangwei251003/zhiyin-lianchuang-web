-- 真实业务写入守卫：需求草稿、需求方公开发布、印刷厂报价与产能

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('draft', 'open', 'in_progress', 'completed', 'cancelled'));

grant select, insert, update, delete on public.orders to authenticated;
grant select on public.orders to anon;
grant select, insert, update, delete on public.bids to authenticated;
grant select on public.bids to anon;
grant select, insert, update, delete on public.capacities to authenticated;
grant select on public.capacities to anon;

drop policy if exists "orders_select_all" on public.orders;
drop policy if exists "orders_select_public_or_own" on public.orders;
create policy "orders_select_public_or_own"
  on public.orders for select
  using (status <> 'draft' or (select auth.uid()) = user_id or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_insert_draft_or_verified_requester" on public.orders;
create policy "orders_insert_draft_or_verified_requester"
  on public.orders for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      status = 'draft'
      or (
        exists (
          select 1 from public.user_roles
          where user_roles.user_id = (select auth.uid())
            and role = 'requester' and user_roles.status = 'active'
        )
        and exists (
          select 1 from public.profiles
          where profiles.id = (select auth.uid())
            and nullif(trim(nickname), '') is not null
            and nullif(trim(phone), '') is not null
            and nullif(trim(email), '') is not null
        )
      )
    )
  );

drop policy if exists "orders_update_own" on public.orders;
drop policy if exists "orders_update_draft_or_verified_requester" on public.orders;
create policy "orders_update_draft_or_verified_requester"
  on public.orders for update to authenticated
  using ((select auth.uid()) = user_id or public.is_admin())
  with check (
    public.is_admin()
    or (
      (select auth.uid()) = user_id
      and (
        status = 'draft'
        or (
          exists (
            select 1 from public.user_roles
            where user_roles.user_id = (select auth.uid())
              and role = 'requester' and user_roles.status = 'active'
          )
          and exists (
            select 1 from public.profiles
            where profiles.id = (select auth.uid())
              and nullif(trim(nickname), '') is not null
              and nullif(trim(phone), '') is not null
              and nullif(trim(email), '') is not null
          )
        )
      )
    )
  );

drop policy if exists "bids_insert_own" on public.bids;
drop policy if exists "bids_insert_verified_printer" on public.bids;
create policy "bids_insert_verified_printer"
  on public.bids for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
        and role = 'printer' and user_roles.status = 'active'
    )
    and exists (
      select 1 from public.companies
      where companies.user_id = (select auth.uid()) and companies.status = 'approved'
    )
  );

drop policy if exists "capacities_insert_own" on public.capacities;
drop policy if exists "capacities_insert_verified_printer" on public.capacities;
create policy "capacities_insert_verified_printer"
  on public.capacities for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
        and role = 'printer' and user_roles.status = 'active'
    )
    and exists (
      select 1 from public.companies
      where companies.user_id = (select auth.uid()) and companies.status = 'approved'
    )
  );
