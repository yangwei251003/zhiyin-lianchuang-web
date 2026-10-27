create table if not exists public.public_content_snapshots (
  id uuid primary key default gen_random_uuid(),
  module text not null check (module in ('orders', 'purchase', 'startup', 'training')),
  display_label text not null,
  title text not null,
  summary text not null,
  cover_image text,
  source_name text not null,
  source_url text not null,
  published_at timestamptz,
  captured_at timestamptz not null default now(),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.public_content_snapshots enable row level security;
create policy "public_content_snapshots_select" on public.public_content_snapshots for select using (true);
