-- Run in Supabase SQL editor (or migrate) once. Inserts go through Next.js with SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  unique (email)
);

create index if not exists newsletter_signups_created_at_idx
  on public.newsletter_signups (created_at desc);

alter table public.newsletter_signups enable row level security;
-- No SELECT/INSERT policies for anon/authenticated; service role bypasses RLS.
