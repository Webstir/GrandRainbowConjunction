-- Run in Supabase SQL editor (or migrate) once. The app reads/writes via service role from API routes.

create table if not exists public.rainbow_gallery (
  id uuid primary key default gen_random_uuid(),
  strokes jsonb not null,
  canvas_w double precision not null,
  canvas_h double precision not null,
  display_name text,
  created_at timestamptz not null default now()
);

create index if not exists rainbow_gallery_created_at_idx
  on public.rainbow_gallery (created_at desc);

alter table public.rainbow_gallery enable row level security;

create policy "rainbow_gallery_select_public"
  on public.rainbow_gallery for select
  to anon, authenticated
  using (true);

-- Inserts go through Next.js with SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
