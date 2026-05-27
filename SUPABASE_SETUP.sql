-- ============================================
-- SOUTHERN SPIRIT FC - SUPABASE SETUP
-- Run this entire file in the Supabase SQL Editor
-- ============================================

-- 1. FINES TABLE
create table public.fines (
  id uuid default gen_random_uuid() primary key,
  player text not null,
  week text not null,
  type text not null,
  amount numeric(8,2) not null default 0,
  note text default '',
  status text not null default 'Unpaid' check (status in ('Unpaid', 'Paid')),
  created_at timestamptz default now()
);

-- 2. SETTINGS TABLE (stores fine menu & roster as JSON)
create table public.settings (
  key text primary key,
  value text not null
);

-- 3. ADMINS TABLE (stores which user IDs have admin access)
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 4. ROW LEVEL SECURITY
alter table public.fines enable row level security;
alter table public.settings enable row level security;
alter table public.admins enable row level security;

-- Everyone can read fines and settings
create policy "Public read fines" on public.fines for select using (true);
create policy "Public read settings" on public.settings for select using (true);

-- Only logged-in admins can write fines
create policy "Admins insert fines" on public.fines for insert
  to authenticated
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

create policy "Admins update fines" on public.fines for update
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()));

create policy "Admins delete fines" on public.fines for delete
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()));

-- Only admins can update settings
create policy "Admins update settings" on public.settings for all
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()))
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

-- Admins can read the admins table (to check their own status)
create policy "Admins read admins" on public.admins for select
  to authenticated
  using (true);

-- 5. ENABLE REALTIME on fines
alter publication supabase_realtime add table public.fines;

-- ============================================
-- DONE. Now go to Authentication > Users in
-- Supabase dashboard to create your 3 admin
-- accounts, then run the INSERT below for each.
-- ============================================

-- After creating users in the Auth dashboard,
-- add them as admins by running (replace the UUID):
-- insert into public.admins (user_id) values ('paste-user-uuid-here');
