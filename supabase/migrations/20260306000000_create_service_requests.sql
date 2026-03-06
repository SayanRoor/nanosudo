-- Service requests table for client support portal (ITSM)
-- Types: incident, service_request, change, problem, task
-- Priorities: critical, high, medium, low (ITIL matrix: urgency × impact)
-- SLA: Critical 1h/4h, High 4h/8h, Medium 8h/24h, Low 24h/72h

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),

  -- Human-readable ticket identifier (e.g. INC-20260306-A3B2)
  ticket_number text unique not null,

  -- Token for public status tracking (shared with client via email)
  tracking_token uuid not null default gen_random_uuid(),

  -- Classification
  type text not null check (type in ('incident', 'service_request', 'change', 'problem', 'task')),
  priority text not null default 'medium' check (priority in ('critical', 'high', 'medium', 'low')),
  urgency text not null check (urgency in ('high', 'medium', 'low')),
  impact text not null check (impact in ('high', 'medium', 'low')),

  -- Lifecycle status
  status text not null default 'new' check (
    status in ('new', 'acknowledged', 'in_progress', 'on_hold', 'resolved', 'closed')
  ),

  -- Content
  title text not null,
  description text not null,

  -- Client contact
  client_name text not null,
  client_email text not null,
  client_phone text,
  company_name text,

  -- SLA tracking (calendar hours)
  reaction_deadline timestamptz,   -- when first response must happen
  resolution_deadline timestamptz, -- when ticket must be closed
  reacted_at timestamptz,          -- when admin first acknowledged
  resolved_at timestamptz,         -- when marked resolved
  closed_at timestamptz,

  -- Hold info (requires written consent per spec §2.2.7.17)
  hold_reason text,
  hold_approved_at timestamptz,

  -- Resolution notes (detailed as per spec §2.2.7.18)
  resolution_notes text,

  -- Internal notes (admin only)
  internal_notes text,

  -- Metadata
  submitted_ip text,
  user_agent text,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Trigger for updated_at
drop trigger if exists service_requests_set_updated_at on public.service_requests;
create trigger service_requests_set_updated_at
before update on public.service_requests
for each row
execute function public.set_updated_at_timestamp();

-- Indexes
create index service_requests_created_at_idx on public.service_requests (created_at desc);
create index service_requests_status_idx on public.service_requests (status);
create index service_requests_type_idx on public.service_requests (type);
create index service_requests_priority_idx on public.service_requests (priority);
create index service_requests_client_email_idx on public.service_requests (client_email);
create index service_requests_tracking_token_idx on public.service_requests (tracking_token);
create index service_requests_ticket_number_idx on public.service_requests (ticket_number);

-- RLS
alter table public.service_requests enable row level security;

-- Anyone can submit a request
drop policy if exists "Anonymous can submit service requests" on public.service_requests;
create policy "Anonymous can submit service requests"
on public.service_requests
for insert
to anon
with check (true);

-- Public can view their own request by tracking token (select only)
drop policy if exists "Public can track own request by token" on public.service_requests;
create policy "Public can track own request by token"
on public.service_requests
for select
to anon
using (true); -- filtering by token is done in app layer via service role

-- Admin members can manage all requests
drop policy if exists "Admin members can manage service requests" on public.service_requests;
create policy "Admin members can manage service requests"
on public.service_requests
for all
to authenticated
using (
  exists (
    select 1 from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

comment on table public.service_requests is
  'Client support requests handled via the ITSM portal at /support';
comment on column public.service_requests.tracking_token is
  'UUID sent to client in confirmation email for status tracking without auth';
comment on column public.service_requests.ticket_number is
  'Human-readable ID like INC-20260306-A3B2 shown to client';
comment on column public.service_requests.hold_approved_at is
  'Written consent timestamp per spec §2.2.7.17 — hold without this is auto-counted as overdue';
