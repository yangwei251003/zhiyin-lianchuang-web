-- 用户反馈：仅保存登录用户主动提交的内容，默认不对其他用户公开。
create table if not exists public.feedback_entries (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references public.profiles(id) on delete cascade,
    category    text not null check (category in ('建议', '问题反馈', '合作联系', '其他')),
    module      text not null default '',
    rating      integer check (rating between 1 and 5),
    content     text not null check (char_length(content) between 1 and 2000),
    contact     text not null default '' check (char_length(contact) <= 120),
    status      text not null default 'submitted' check (status in ('submitted', 'reviewed', 'closed')),
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create index if not exists feedback_entries_user_created_idx
    on public.feedback_entries (user_id, created_at desc);

create trigger feedback_entries_updated_at
    before update on public.feedback_entries
    for each row execute function public.update_updated_at_column();

alter table public.feedback_entries enable row level security;

create policy "feedback_entries_insert_own" on public.feedback_entries
    for insert to authenticated with check (auth.uid() = user_id);

create policy "feedback_entries_select_own" on public.feedback_entries
    for select to authenticated using (auth.uid() = user_id);
