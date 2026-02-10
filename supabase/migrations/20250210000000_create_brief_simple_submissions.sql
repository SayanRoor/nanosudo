-- Migration: Create table for simplified 3-step brief form
-- Created: 2026-02-10

create table if not exists public.brief_simple_submissions (
  id uuid primary key,
  created_at timestamptz not null default timezone('utc', now()),

  -- Step 1: Project Type (WHAT)
  project_type text not null check (project_type in ('landing', 'corporate', 'ecommerce', 'service', 'mvp')),
  description text not null,
  has_examples boolean not null default false,
  examples_urls text,

  -- Step 2: Priorities (WHY)
  main_goal text not null check (main_goal in ('sales', 'leads', 'awareness', 'automation')),
  budget_clarity text not null check (budget_clarity in ('exact', 'approximate', 'no_idea')),
  timeline text not null check (timeline in ('urgent', 'normal', 'flexible')),
  has_design boolean not null default false,
  has_content boolean not null default false,
  has_domain boolean not null default false,

  -- Step 3: Contact (WHO)
  name text not null,
  email text not null,
  phone text,
  company text,
  preferred_contact text not null check (preferred_contact in ('whatsapp', 'telegram', 'email', 'phone'))
);

-- Indexes for common queries
create index if not exists brief_simple_submissions_created_at_idx on public.brief_simple_submissions (created_at desc);
create index if not exists brief_simple_submissions_email_idx on public.brief_simple_submissions (email);
create index if not exists brief_simple_submissions_project_type_idx on public.brief_simple_submissions (project_type);

-- RLS Policies
alter table public.brief_simple_submissions enable row level security;

-- Allow service role to insert/select/update
create policy "Service role can manage brief_simple_submissions"
  on public.brief_simple_submissions
  for all
  using (auth.role() = 'service_role');

-- Allow anonymous users to insert (form submission)
create policy "Anonymous users can insert brief_simple_submissions"
  on public.brief_simple_submissions
  for insert
  with check (true);

-- Comments
comment on table public.brief_simple_submissions is 'Submissions from simplified 3-step brief form';
comment on column public.brief_simple_submissions.project_type is 'Type of project: landing, corporate, ecommerce, service, mvp';
comment on column public.brief_simple_submissions.main_goal is 'Primary business goal: sales, leads, awareness, automation';
comment on column public.brief_simple_submissions.budget_clarity is 'Client budget clarity: exact, approximate, no_idea';
comment on column public.brief_simple_submissions.timeline is 'Project timeline: urgent, normal, flexible';
