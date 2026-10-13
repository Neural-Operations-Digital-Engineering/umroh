-- Migration 006: remove SVG uploads and define inquiry retention.
-- Run this on existing Supabase projects after migrations 001–005.

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'cms-media';

-- Inquiry records contain contact names and phone numbers. The application policy
-- retains them for 24 months; schedule this function with Supabase Cron or an
-- equivalent trusted scheduler.
create or replace function public.purge_old_cms_inquiries(retention_days integer default 730)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.cms_inquiries
  where created_at < now() - make_interval(days => greatest(retention_days, 1));
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_old_cms_inquiries(integer) from public, anon, authenticated;
grant execute on function public.purge_old_cms_inquiries(integer) to service_role;

notify pgrst, 'reload schema';
