-- ============================================================
-- ContractorMS Database Schema
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- ============================================================

-- 1. Workers table
create table if not exists workers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  phone text not null,
  work_type text not null check (work_type in ('Mason', 'Carpenter', 'Electrician', 'Plumber', 'Helper', 'Painter')),
  daily_wage numeric not null default 0,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  joined_at date not null default current_date,
  avatar_initials text not null default '',
  created_at timestamptz default now()
);

-- 2. Attendance table
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references workers(id) on delete cascade not null,
  date date not null,
  status text not null check (status in ('Present', 'Absent', 'Half-Day')),
  hours_worked numeric not null default 0,
  earned_amount numeric not null default 0,
  created_at timestamptz default now(),
  unique(worker_id, date)
);

-- 3. Advance payments table
create table if not exists advances (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references workers(id) on delete cascade not null,
  amount numeric not null,
  date date not null,
  note text default '',
  status text not null default 'Pending' check (status in ('Pending', 'Deducted')),
  created_at timestamptz default now()
);

-- 4. Settings table (one row per user)
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  company_name text default 'My Company',
  contractor_name text default '',
  contact_number text default '',
  currency text default 'INR',
  currency_symbol text default '₹',
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- Each user can only access their own data
-- ============================================================

alter table workers enable row level security;
alter table attendance enable row level security;
alter table advances enable row level security;
alter table settings enable row level security;

-- Workers: user can CRUD their own workers
create policy "Users manage own workers"
  on workers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Attendance: user can CRUD attendance for their own workers
create policy "Users manage own attendance"
  on attendance for all
  using (worker_id in (select id from workers where user_id = auth.uid()))
  with check (worker_id in (select id from workers where user_id = auth.uid()));

-- Advances: user can CRUD advances for their own workers
create policy "Users manage own advances"
  on advances for all
  using (worker_id in (select id from workers where user_id = auth.uid()))
  with check (worker_id in (select id from workers where user_id = auth.uid()));

-- Settings: user can CRUD their own settings row
create policy "Users manage own settings"
  on settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Indexes for performance
-- ============================================================
create index if not exists idx_workers_user_id on workers(user_id);
create index if not exists idx_attendance_worker_id on attendance(worker_id);
create index if not exists idx_attendance_date on attendance(date);
create index if not exists idx_advances_worker_id on advances(worker_id);
create index if not exists idx_settings_user_id on settings(user_id);
