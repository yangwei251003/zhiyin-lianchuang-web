-- 免费公开来源的首条可追溯报价快照。
-- 注意：该记录只代表指定地区、规格和交易商在发布时间的公开报价，
-- 页面会在七天后自动停止将其标记为“最新报价”。
insert into public.market_prices (
    paper_type,
    region,
    market,
    specification,
    price,
    unit,
    observed_at,
    source,
    source_reference,
    source_url,
    verification_status,
    verified_at
)
values (
    '白卡纸',
    '江苏省',
    '无锡市',
    '230-400g，国产',
    4410,
    '元/吨',
    '2026-07-10T00:00:00+08:00',
    '生意社报价中心',
    '白卡纸公开市场报价（无锡金匮汇包装材料有限公司）',
    'https://www.100ppi.com/mprice/plist-1-3189-1.html',
    'verified',
    now()
)
on conflict (source, paper_type, region, market, specification, observed_at)
do update set
    price = excluded.price,
    unit = excluded.unit,
    source_reference = excluded.source_reference,
    source_url = excluded.source_url,
    verification_status = excluded.verification_status,
    verified_at = excluded.verified_at,
    updated_at = now();
