-- ============================================================================
-- UUID 迁移脚本：把 seed.sql 的固定 UUID 替换为实际 Supabase Auth 用户 UUID
-- 用法：在 Supabase Dashboard → SQL Editor 粘贴运行
-- 映射关系：
--   00000000-0000-0000-0000-000000000001 → f70e4973-5d31-4ede-849e-7f362bc26e8a (test1@zhiyin.com)
--   00000000-0000-0000-0000-000000000002 → 7d614031-1cdf-4a81-a6aa-e9eb5b5105af (test2@zhiyin.com)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 插入/更新 profiles（用实际 UUID）
--    如果 Dashboard 创建用户时已自动生成 profiles，ON CONFLICT 会更新
--    如果没有，则插入新记录
-- ----------------------------------------------------------------------------
insert into public.profiles (id, email, nickname, avatar_url, member_level, phone)
values
    ('f70e4973-5d31-4ede-849e-7f362bc26e8a', 'test1@zhiyin.com', '张三', null, 'vip', '13800138001'),
    ('7d614031-1cdf-4a81-a6aa-e9eb5b5105af', 'test2@zhiyin.com', '李四', null, 'free', '13900139002')
on conflict (id) do update set
    email       = excluded.email,
    nickname    = excluded.nickname,
    avatar_url  = excluded.avatar_url,
    member_level = excluded.member_level,
    phone       = excluded.phone;

-- ----------------------------------------------------------------------------
-- 2. 更新所有业务表的 user_id（从固定 UUID 迁移到实际 UUID）
--    如果业务表没有固定 UUID 的数据（seed.sql 没成功），UPDATE 0 行，安全
-- ----------------------------------------------------------------------------
update public.companies        set user_id = 'f70e4973-5d31-4ede-849e-7f362bc26e8a' where user_id = '00000000-0000-0000-0000-000000000001';
update public.companies        set user_id = '7d614031-1cdf-4a81-a6aa-e9eb5b5105af' where user_id = '00000000-0000-0000-0000-000000000002';

update public.orders           set user_id = 'f70e4973-5d31-4ede-849e-7f362bc26e8a' where user_id = '00000000-0000-0000-0000-000000000001';
update public.orders           set user_id = '7d614031-1cdf-4a81-a6aa-e9eb5b5105af' where user_id = '00000000-0000-0000-0000-000000000002';

update public.bids             set user_id = 'f70e4973-5d31-4ede-849e-7f362bc26e8a' where user_id = '00000000-0000-0000-0000-000000000001';
update public.bids             set user_id = '7d614031-1cdf-4a81-a6aa-e9eb5b5105af' where user_id = '00000000-0000-0000-0000-000000000002';

update public.capacities       set user_id = 'f70e4973-5d31-4ede-849e-7f362bc26e8a' where user_id = '00000000-0000-0000-0000-000000000001';
update public.capacities       set user_id = '7d614031-1cdf-4a81-a6aa-e9eb5b5105af' where user_id = '00000000-0000-0000-0000-000000000002';

update public.purchase_orders  set user_id = 'f70e4973-5d31-4ede-849e-7f362bc26e8a' where user_id = '00000000-0000-0000-0000-000000000001';
update public.purchase_orders  set user_id = '7d614031-1cdf-4a81-a6aa-e9eb5b5105af' where user_id = '00000000-0000-0000-0000-000000000002';

update public.messages         set user_id = 'f70e4973-5d31-4ede-849e-7f362bc26e8a' where user_id = '00000000-0000-0000-0000-000000000001';
update public.messages         set user_id = '7d614031-1cdf-4a81-a6aa-e9eb5b5105af' where user_id = '00000000-0000-0000-0000-000000000002';

update public.mentor_bookings  set user_id = 'f70e4973-5d31-4ede-849e-7f362bc26e8a' where user_id = '00000000-0000-0000-0000-000000000001';
update public.mentor_bookings  set user_id = '7d614031-1cdf-4a81-a6aa-e9eb5b5105af' where user_id = '00000000-0000-0000-0000-000000000002';

-- ----------------------------------------------------------------------------
-- 3. 删除固定 UUID 的旧 profiles（如果存在）
--    此时业务表已迁移到实际 UUID，不会级联删除业务数据
-- ----------------------------------------------------------------------------
delete from public.profiles
where id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

-- ----------------------------------------------------------------------------
-- 4. 删除固定 UUID 的 auth.users（如果 seed.sql 之前插入了）
--    这会同时清理 auth.identities（ON DELETE CASCADE）
-- ----------------------------------------------------------------------------
delete from auth.users
where id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

-- ----------------------------------------------------------------------------
-- 5. 验证：查看 profiles 当前数据
-- ----------------------------------------------------------------------------
select id, email, nickname, member_level from public.profiles order by created_at;
