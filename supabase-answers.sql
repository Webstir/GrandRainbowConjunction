-- Run in Supabase SQL editor (see PROJECT PLAN)
create table if not exists answers (
  id uuid default gen_random_uuid() primary key,
  chapter_id text not null,
  answer text not null,
  created_at timestamptz default now()
);

create index if not exists answers_chapter_id_created_at_idx
  on answers (chapter_id, created_at desc);
