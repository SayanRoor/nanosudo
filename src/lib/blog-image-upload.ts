// Uploads an image to the 'blog-images' Supabase Storage bucket (admin-only
// write via RLS, public read) and returns its public URL. Used by the blog
// admin editor for cover images and inline content images/screenshots.
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const BLOG_IMAGES_BUCKET = "blog-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches the bucket's file_size_limit
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export class BlogImageUploadError extends Error {}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadBlogImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new BlogImageUploadError("Поддерживаются только PNG, JPEG, WebP и GIF.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new BlogImageUploadError("Файл больше 5MB — сожмите изображение и попробуйте снова.");
  }

  const supabase = getSupabaseBrowserClient();
  const filePath = `${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new BlogImageUploadError(error.message);
  }

  const { data } = supabase.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
