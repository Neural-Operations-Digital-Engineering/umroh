-- Store the structured source context that accompanies each public inquiry.
-- Run after 003_enterprise_security_and_inquiries.sql and 005_repair_inquiries_schema.sql.

alter table public.cms_inquiries
  add column if not exists context jsonb not null default '{}'::jsonb;

alter table public.cms_inquiries
  drop constraint if exists cms_inquiries_context_object;

alter table public.cms_inquiries
  add constraint cms_inquiries_context_object
  check (jsonb_typeof(context) = 'object');

notify pgrst, 'reload schema';
