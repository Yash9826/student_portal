-- Run this in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste this -> Run)
--
-- If you already ran an earlier version of this schema (with a "section"
-- column), the block below drops and recreates the students table cleanly.
-- Since this is a fresh redesign of the fields, that's the simplest path —
-- just be aware it clears any test rows you already added.

drop table if exists students;

-- 1. Students table
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roll_no text not null,
  student_class text not null,             -- one of 9 / 10 / 11 / 12
  gender text,
  dob date,
  guardian_name text,                      -- father / guardian name
  mother_name text,
  caste_category text,                     -- General / OBC / SC / ST / Other
  village text,
  scholar_number text,
  admission_date date,
  contact text,
  marks jsonb not null default '{}'::jsonb,
  registered_at timestamptz not null default now()
);

-- 2. Subjects table (so the subject list is shared across devices too)
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0
);

-- Seed the default subjects (safe to run more than once)
insert into subjects (name, sort_order)
values
  ('Mathematics', 1),
  ('Science', 2),
  ('English', 3),
  ('Social Studies', 4),
  ('Computer', 5)
on conflict (name) do nothing;

-- 3. Enable Row Level Security
alter table students enable row level security;
alter table subjects enable row level security;

-- 4. Open policies: anyone with your project's anon key can read/write.
--    This matches "no login screen" simplicity. If you want to restrict
--    this to only your teacher later, add Supabase Auth and tighten
--    these policies to check auth.uid() — happy to help with that.
drop policy if exists "Public read students" on students;
drop policy if exists "Public insert students" on students;
drop policy if exists "Public update students" on students;
drop policy if exists "Public delete students" on students;

create policy "Public read students" on students for select using (true);
create policy "Public insert students" on students for insert with check (true);
create policy "Public update students" on students for update using (true);
create policy "Public delete students" on students for delete using (true);

drop policy if exists "Public read subjects" on subjects;
drop policy if exists "Public insert subjects" on subjects;
drop policy if exists "Public delete subjects" on subjects;

create policy "Public read subjects" on subjects for select using (true);
create policy "Public insert subjects" on subjects for insert with check (true);
create policy "Public delete subjects" on subjects for delete using (true);
