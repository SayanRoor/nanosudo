-- Attachments for the public support portal (/support): clients can attach
-- screenshots and reference links when submitting a ticket.
--
-- Storage bucket is public + anon-insert (unlike 'blog-images'/'brandbooks'
-- which are admin-only writes) because the uploader here is an anonymous
-- site visitor filling out the support form, mirroring the existing
-- "Anonymous can submit service requests" policy on the table itself.

alter table public.service_requests
  add column if not exists attachment_urls text[],
  add column if not exists links text[];

comment on column public.service_requests.attachment_urls is
  'Public Supabase Storage URLs of screenshots the client attached when submitting the ticket';
comment on column public.service_requests.links is
  'Reference links (e.g. to the affected page) the client added when submitting the ticket';

do $$
begin
  if not exists (
    select 1
    from storage.buckets
    where id = 'support-attachments'
  ) then
    perform storage.create_bucket(
      'support-attachments',
      'support-attachments',
      true,
      (5 * 1024 * 1024)::bigint,
      array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    );
  end if;
end
$$;

drop policy if exists "Anyone can upload support attachments" on storage.objects;
create policy "Anyone can upload support attachments"
on storage.objects
for insert
to anon
with check (bucket_id = 'support-attachments');

drop policy if exists "Admins can read support attachments" on storage.objects;
create policy "Admins can read support attachments"
on storage.objects
for select
using (
  bucket_id = 'support-attachments'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete support attachments" on storage.objects;
create policy "Admins can delete support attachments"
on storage.objects
for delete
using (
  bucket_id = 'support-attachments'
  and exists (
    select 1
    from public.admin_members am
    where am.auth_user_id = auth.uid()
  )
);
