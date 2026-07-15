-- 企业主体审核字段只能由服务端管理员流程修改
grant select, insert on public.companies to authenticated;
revoke update on public.companies from authenticated;
grant update (company_name, credit_code, license_image_url, contact_name, contact_phone)
  on public.companies to authenticated;
grant all on public.companies to service_role;

drop policy if exists "companies_select" on public.companies;
create policy "companies_select" on public.companies for select to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "companies_update_own" on public.companies;
create policy "companies_update_own_profile_fields" on public.companies for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
