-- 报价者可修改报价内容，但不能自行写入采纳/拒绝状态
revoke update on public.bids from authenticated;
grant update (price, delivery_days, note) on public.bids to authenticated;
grant all on public.bids to service_role;

drop policy if exists "bids_update_own" on public.bids;
create policy "bids_update_own_pending" on public.bids for update to authenticated
  using ((select auth.uid()) = user_id and status = 'pending')
  with check ((select auth.uid()) = user_id and status = 'pending');
