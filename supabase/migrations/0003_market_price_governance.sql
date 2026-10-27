-- 已授权市场价格：与模型预测分离，确保公开页面不把模拟值当作市场事实。
create table if not exists public.market_prices (
    id                uuid primary key default gen_random_uuid(),
    paper_type        text not null check (paper_type in ('铜版纸', '双胶纸', '白卡纸', '哑粉铜版纸', '轻涂纸', '新闻纸')),
    region            text not null,
    market            text not null default '',
    specification     text not null,
    price             numeric not null check (price > 0),
    unit              text not null default '元/吨',
    observed_at       timestamptz not null,
    source            text not null,
    source_reference  text,
    source_url        text,
    verification_status text not null default 'pending'
        check (verification_status in ('pending', 'verified', 'rejected')),
    verified_at       timestamptz,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now()
);

create unique index if not exists market_prices_source_observed_idx
    on public.market_prices (source, paper_type, region, market, specification, observed_at);

create index if not exists market_prices_public_latest_idx
    on public.market_prices (paper_type, verification_status, observed_at desc);

create trigger market_prices_updated_at
    before update on public.market_prices
    for each row execute function public.update_updated_at_column();

alter table public.market_prices enable row level security;

create policy "market_prices_select_verified" on public.market_prices
    for select using (verification_status = 'verified');

-- No client write policies are created. Ordinary anonymous/authenticated clients
-- therefore cannot alter prices; the protected server import route uses the
-- service-role key, which bypasses RLS for verified operational imports.
