-- Repair migration for deployments where the inquiry table was never applied
-- or PostgREST still has a stale schema cache. Safe to run after 001–004.

create table if not exists public.cms_inquiries (
  id uuid primary key default gen_random_uuid(),
  package_id text,
  package_name text,
  contact_name text,
  contact_phone text,
  message text,
  source_path text not null default '/',
  referrer text,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_inquiries_created_at_idx on public.cms_inquiries (created_at desc);
create index if not exists cms_inquiries_status_idx on public.cms_inquiries (status);
create index if not exists cms_inquiries_package_id_idx on public.cms_inquiries (package_id);

alter table public.cms_inquiries enable row level security;

drop policy if exists "public can create inquiries" on public.cms_inquiries;
create policy "public can create inquiries"
  on public.cms_inquiries for insert
  to anon, authenticated
  with check (
    (status is null or status = 'new')
    and char_length(coalesce(package_id, '')) <= 120
    and char_length(coalesce(package_name, '')) <= 240
    and char_length(coalesce(contact_name, '')) <= 120
    and char_length(coalesce(contact_phone, '')) <= 40
    and char_length(coalesce(message, '')) <= 1000
    and char_length(source_path) <= 240
    and char_length(coalesce(referrer, '')) <= 500
    and char_length(coalesce(user_agent, '')) <= 500
  );

drop policy if exists "cms members can read inquiries" on public.cms_inquiries;
create policy "cms members can read inquiries"
  on public.cms_inquiries for select
  to authenticated
  using (public.is_cms_editor());

drop policy if exists "cms admins can update inquiries" on public.cms_inquiries;
create policy "cms admins can update inquiries"
  on public.cms_inquiries for update
  to authenticated
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

create or replace function public.touch_cms_inquiry_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_inquiries_touch_updated_at on public.cms_inquiries;
create trigger cms_inquiries_touch_updated_at
before update on public.cms_inquiries
for each row execute function public.touch_cms_inquiry_updated_at();

-- Tell PostgREST to refresh its table metadata immediately.
notify pgrst, 'reload schema';
