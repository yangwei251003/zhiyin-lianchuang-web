-- 智印大脑私有工作区：对话、证据快照和用户确认前的草稿。
-- 评审演示保持在客户端状态与签名会话中，不写入这些真实业务辅助表。

create table if not exists public.brain_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context_kind text not null check (context_kind in ('general', 'order', 'purchase', 'price', 'education')),
  title text not null default '新的智印大脑会话',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brain_conversations_user_updated_idx
  on public.brain_conversations(user_id, updated_at desc);

create trigger brain_conversations_updated_at
  before update on public.brain_conversations
  for each row execute function public.update_updated_at_column();

create table if not exists public.brain_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.brain_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(trim(content)) between 1 and 6000),
  source_snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists brain_messages_conversation_created_idx
  on public.brain_messages(conversation_id, created_at asc);

create table if not exists public.brain_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.brain_conversations(id) on delete set null,
  context_kind text not null check (context_kind in ('order', 'purchase', 'price', 'education')),
  title text not null,
  fields jsonb not null default '{}'::jsonb,
  status text not null default 'needs_confirmation'
    check (status in ('needs_confirmation', 'confirmed', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brain_drafts_user_updated_idx
  on public.brain_drafts(user_id, updated_at desc);

create trigger brain_drafts_updated_at
  before update on public.brain_drafts
  for each row execute function public.update_updated_at_column();

create table if not exists public.brain_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  conversation_id uuid references public.brain_conversations(id) on delete set null,
  mode text not null check (mode in ('chat', 'review')),
  context_kind text not null,
  created_at timestamptz not null default now()
);

create index if not exists brain_usage_logs_created_idx
  on public.brain_usage_logs(created_at desc);

grant select, insert, update, delete on public.brain_conversations to authenticated;
grant select, insert on public.brain_messages to authenticated;
grant select, insert, update on public.brain_drafts to authenticated;
grant all on public.brain_conversations, public.brain_messages, public.brain_drafts, public.brain_usage_logs to service_role;

alter table public.brain_conversations enable row level security;
alter table public.brain_messages enable row level security;
alter table public.brain_drafts enable row level security;
alter table public.brain_usage_logs enable row level security;

create policy "brain_conversations_owner_select" on public.brain_conversations
  for select to authenticated using (user_id = (select auth.uid()));
create policy "brain_conversations_owner_insert" on public.brain_conversations
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "brain_conversations_owner_update" on public.brain_conversations
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "brain_conversations_owner_delete" on public.brain_conversations
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "brain_messages_conversation_owner_select" on public.brain_messages
  for select to authenticated using (
    exists (
      select 1 from public.brain_conversations conversation
      where conversation.id = brain_messages.conversation_id
        and conversation.user_id = (select auth.uid())
    )
  );
create policy "brain_messages_conversation_owner_insert" on public.brain_messages
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.brain_conversations conversation
      where conversation.id = brain_messages.conversation_id
        and conversation.user_id = (select auth.uid())
    )
  );

create policy "brain_drafts_owner_select" on public.brain_drafts
  for select to authenticated using (user_id = (select auth.uid()));
create policy "brain_drafts_owner_insert" on public.brain_drafts
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "brain_drafts_owner_update" on public.brain_drafts
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
