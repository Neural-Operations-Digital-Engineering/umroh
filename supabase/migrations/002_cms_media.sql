-- Storage untuk gambar yang dikelola dari CMS.
-- Jalankan migration ini setelah 001_cms.sql di Supabase SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];


drop policy if exists "public can read cms media" on storage.objects;
create policy "public can read cms media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'cms-media');

drop policy if exists "cms editors can upload media" on storage.objects;
create policy "cms editors can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-media' and public.is_cms_editor());

drop policy if exists "cms editors can update media" on storage.objects;
create policy "cms editors can update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cms-media' and public.is_cms_editor())
  with check (bucket_id = 'cms-media' and public.is_cms_editor());

drop policy if exists "cms editors can delete media" on storage.objects;
create policy "cms editors can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-media' and public.is_cms_editor());
