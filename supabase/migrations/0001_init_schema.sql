-- ============================================================================
-- 智印联创 Web 端 - 数据库初始化迁移
-- 文件：0001_init_schema.sql
-- 说明：创建全部 13 张业务表、索引、外键、updated_at 触发器
-- 注意：本迁移不包含 RLS 策略（见 0002_rls_policies.sql）
-- ============================================================================

-- 启用必要的扩展
create extension if not exists "pgcrypto";   -- 提供 gen_random_uuid()
create extension if not exists "plpgsql";     -- 触发器函数语言

-- ----------------------------------------------------------------------------
-- 通用 updated_at 触发器函数
-- 为所有含 updated_at 字段的表在 UPDATE 时自动刷新时间戳
-- ----------------------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- ============================================================================
-- 1. profiles 用户档案（关联 auth.users）
-- ============================================================================
create table if not exists public.profiles (
    id          uuid primary key references auth.users(id) on delete cascade,
    email       text not null,
    nickname    text not null,
    avatar_url  text,
    member_level text not null default 'free' check (member_level in ('free', 'vip', 'enterprise')),
    phone       text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

comment on table public.profiles is '用户档案，关联 Supabase auth.users';

create trigger profiles_updated_at
    before update on public.profiles
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 2. companies 企业认证
-- ============================================================================
create table if not exists public.companies (
    id               uuid primary key default gen_random_uuid(),
    user_id          uuid not null references public.profiles(id) on delete cascade,
    company_name     text not null,
    credit_code      text not null check (char_length(credit_code) = 18),
    license_image_url text not null,
    contact_name     text not null,
    contact_phone    text not null check (contact_phone ~ '^1[3-9][0-9]{9}$'),
    status           text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    reject_reason    text,
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

comment on table public.companies is '企业认证申请';

create unique index if not exists companies_user_id_key on public.companies(user_id);

create trigger companies_updated_at
    before update on public.companies
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 3. orders 订单
-- ============================================================================
create table if not exists public.orders (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references public.profiles(id) on delete cascade,
    title       text not null,
    category    text not null,   -- 印刷品分类：画册/海报/包装盒/手提袋/名片/其他
    craft       text not null,   -- 工艺：胶印/数码/丝网/UV/烫金
    budget_min  numeric not null,
    budget_max  numeric not null,
    region      text not null,
    description text not null default '',
    status      text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

comment on table public.orders is '印刷订单主表';

create index if not exists orders_user_id_idx     on public.orders(user_id);
create index if not exists orders_status_idx       on public.orders(status);
create index if not exists orders_category_idx     on public.orders(category);
create index if not exists orders_created_at_idx   on public.orders(created_at desc);

create trigger orders_updated_at
    before update on public.orders
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. bids 报价
-- ============================================================================
create table if not exists public.bids (
    id            uuid primary key default gen_random_uuid(),
    order_id      uuid not null references public.orders(id) on delete cascade,
    user_id       uuid not null references public.profiles(id) on delete cascade,
    price         numeric not null,
    delivery_days integer not null,
    note          text,
    status        text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

comment on table public.bids is '订单报价';

create index if not exists bids_order_id_idx on public.bids(order_id);
create index if not exists bids_user_id_idx  on public.bids(user_id);

create trigger bids_updated_at
    before update on public.bids
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 5. capacities 产能
-- ============================================================================
create table if not exists public.capacities (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid not null references public.profiles(id) on delete cascade,
    device_type    text not null,
    capacity       text not null,
    region         text not null,
    price_min      numeric not null,
    price_max      numeric not null,
    available_date date not null,
    status         text not null default 'available' check (status in ('available', 'busy', 'offline')),
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

comment on table public.capacities is '供应商产能发布';

create trigger capacities_updated_at
    before update on public.capacities
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 6. purchases 集采活动
-- ============================================================================
create table if not exists public.purchases (
    id               uuid primary key default gen_random_uuid(),
    title            text not null,
    product_name     text not null,
    product_image    text,
    unit_price       numeric not null,
    min_quantity     integer not null,
    target_quantity  integer not null,
    current_quantity integer not null default 0,
    start_time       timestamptz not null,
    end_time         timestamptz not null,
    status           text not null default 'active' check (status in ('active', 'ended', 'cancelled')),
    description      text not null default '',
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

comment on table public.purchases is '集采活动';

create index if not exists purchases_status_idx on public.purchases(status);
create index if not exists purchases_end_time_idx on public.purchases(end_time);

create trigger purchases_updated_at
    before update on public.purchases
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 7. purchase_orders 集采订单
-- ============================================================================
create table if not exists public.purchase_orders (
    id           uuid primary key default gen_random_uuid(),
    purchase_id  uuid not null references public.purchases(id) on delete cascade,
    user_id      uuid not null references public.profiles(id) on delete cascade,
    quantity     integer not null,
    total_price  numeric not null,
    status       text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'completed')),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

comment on table public.purchase_orders is '集采订单';

create index if not exists purchase_orders_purchase_id_idx on public.purchase_orders(purchase_id);
create index if not exists purchase_orders_user_id_idx     on public.purchase_orders(user_id);

create trigger purchase_orders_updated_at
    before update on public.purchase_orders
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 8. messages 消息
-- ============================================================================
create table if not exists public.messages (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid not null references public.profiles(id) on delete cascade,
    type       text not null check (type in ('system', 'order', 'purchase')),
    title      text not null,
    content    text not null,
    is_read    boolean not null default false,
    link       text,
    created_at timestamptz not null default now()
);

comment on table public.messages is '站内消息（无 updated_at，故无触发器）';

create index if not exists messages_user_id_idx    on public.messages(user_id);
create index if not exists messages_is_read_idx    on public.messages(is_read);
create index if not exists messages_created_at_idx on public.messages(created_at desc);

-- ============================================================================
-- 9. articles 创业文章
-- ============================================================================
create table if not exists public.articles (
    id          uuid primary key default gen_random_uuid(),
    title       text not null,
    summary     text not null,
    content     text not null,
    cover_image text,
    author      text not null,
    tags        text[] not null default '{}',
    view_count  integer not null default 0,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

comment on table public.articles is '创业文章';

create trigger articles_updated_at
    before update on public.articles
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 10. cases 创业案例
-- ============================================================================
create table if not exists public.cases (
    id                uuid primary key default gen_random_uuid(),
    title             text not null,
    industry          text not null,
    summary           text not null,
    content           text not null,
    cover_image       text,
    investment_amount numeric not null,
    revenue           numeric not null,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now()
);

comment on table public.cases is '创业案例';

create index if not exists cases_industry_idx on public.cases(industry);

create trigger cases_updated_at
    before update on public.cases
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 11. mentors 创业导师
-- ============================================================================
create table if not exists public.mentors (
    id         uuid primary key default gen_random_uuid(),
    name       text not null,
    title      text not null,
    company    text not null,
    expertise  text[] not null default '{}',
    avatar     text,
    bio        text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.mentors is '创业导师';

create trigger mentors_updated_at
    before update on public.mentors
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 12. mentor_bookings 导师预约
-- ============================================================================
create table if not exists public.mentor_bookings (
    id           uuid primary key default gen_random_uuid(),
    mentor_id    uuid not null references public.mentors(id) on delete cascade,
    user_id      uuid not null references public.profiles(id) on delete cascade,
    topic        text not null,
    description  text not null default '',
    booking_date date not null,
    booking_time time not null,
    status       text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

comment on table public.mentor_bookings is '导师预约';

create index if not exists mentor_bookings_mentor_id_idx on public.mentor_bookings(mentor_id);
create index if not exists mentor_bookings_user_id_idx    on public.mentor_bookings(user_id);

create trigger mentor_bookings_updated_at
    before update on public.mentor_bookings
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 13. price_predictions AI 纸价预测
-- ============================================================================
create table if not exists public.price_predictions (
    id            uuid primary key default gen_random_uuid(),
    paper_type    text not null check (paper_type in ('铜版纸', '双胶纸', '白卡纸', '哑粉铜版纸', '轻涂纸', '新闻纸')),
    date          date not null,
    price         numeric not null,
    change_rate   numeric not null,
    ai_analysis   text not null default '',
    is_predicted  boolean not null default false,
    created_at    timestamptz not null default now()
);

comment on table public.price_predictions is 'AI 纸价预测（历史 + 预测），无 updated_at';

-- (paper_type, date) 唯一约束，避免同纸种同日重复数据
create unique index if not exists price_predictions_paper_type_date_idx
    on public.price_predictions(paper_type, date);

create index if not exists price_predictions_paper_type_idx
    on public.price_predictions(paper_type);
