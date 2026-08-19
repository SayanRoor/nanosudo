-- Storage bucket for blog post images (cover images + inline content images
-- uploaded from the admin editor). Public bucket so published post images
-- are readable via the CDN-style public URL; RLS on storage.objects still
-- restricts authenticated write/list access to admin_members — same pattern
-- as the existing 'brandbooks' bucket.

do $$
begin
  if not exists (
    select 1
    from storage.buckets
    where id = 'blog-images'
  ) then
    perform storage.create_bucket(
      'blog-images',
      'blog-images',
      true,
      (5 * 1024 * 1024)::bigint,
      array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    );
  end if;
end
$$;

drop policy if exists "Admins can read blog-images" on storage.objects;
create policy "Admins can read blog-images"
on storage.objects
for select
using (
  bucket_id = 'blog-images'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert blog-images" on storage.objects;
create policy "Admins can insert blog-images"
on storage.objects
for insert
with check (
  bucket_id = 'blog-images'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete blog-images" on storage.objects;
create policy "Admins can delete blog-images"
on storage.objects
for delete
using (
  bucket_id = 'blog-images'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);
