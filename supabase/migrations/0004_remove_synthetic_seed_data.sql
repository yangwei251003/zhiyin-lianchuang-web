-- 清除早期演示数据。项目已确认这些订单、集采、案例、导师和价格数据
-- 不属于可公开的经营事实，不能继续出现在生产环境或测试预览中。
delete from public.mentor_bookings
    where id::text like '55555555-5555-0000-0000-%';

delete from public.messages
    where id::text like '11111111-1111-0000-0000-%';

delete from public.bids
    where id::text like 'cccccccc-0000-0000-0000-%';

delete from public.purchase_orders
    where id::text like 'ffffffff-0000-0000-0000-%';

delete from public.orders
    where id::text like 'bbbbbbbb-0000-0000-0000-%';

delete from public.capacities
    where id::text like 'dddddddd-0000-0000-0000-%';

delete from public.purchases
    where id::text like 'eeeeeeee-0000-0000-0000-%';

delete from public.articles
    where id::text like '22222222-2222-0000-0000-%';

delete from public.cases
    where id::text like '33333333-3333-0000-0000-%';

delete from public.mentors
    where id::text like '44444444-4444-0000-0000-%';

delete from public.price_predictions;

delete from public.companies
    where id::text in (
      'aaaaaaaa-0000-0000-0000-000000000001',
      'aaaaaaaa-0000-0000-0000-000000000002'
    );

delete from public.profiles
    where email in ('test1@zhiyin.com', 'test2@zhiyin.com');
