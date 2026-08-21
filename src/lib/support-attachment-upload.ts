// Uploads a screenshot to the 'support-attachments' Supabase Storage bucket
// from the public /support form. Unlike blog-image-upload.ts (admin-only,
// RLS-gated to admin_members), this bucket accepts anonymous inserts — the
// uploader is a site visitor filing a support ticket, not a logged-in admin.
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const ATTACHMENTS_BUCKET = "support-attachments";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches the bucket's file_size_limit
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export class SupportAttachmentUploadError extends Error {}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadSupportAttachment(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new SupportAttachmentUploadError("Поддерживаются только PNG, JPEG, WebP и GIF.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new SupportAttachmentUploadError("Файл больше 5MB — сожмите скриншот и попробуйте снова.");
  }

  const supabase = getSupabaseBrowserClient();
  const filePath = `${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new SupportAttachmentUploadError(error.message);
  }

  const { data } = supabase.storage.from(ATTACHMENTS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
