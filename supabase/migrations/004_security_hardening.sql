-- Migration 004: Security Hardening & Concurrency Protection
-- Jalankan di Supabase SQL Editor untuk memperbarui database yang sudah berjalan.

-- 1. Perketat konfigurasi storage bucket cms-media (limit 8MB, hanya MIME type gambar yang diizinkan)
update storage.buckets
set
  file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'cms-media';

-- 2. Perketat policy insert anon pada cms_inquiries (hanya boleh status 'new' dan batasi semua panjang teks)
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
