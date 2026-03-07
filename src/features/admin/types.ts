export type BlogPostRow = {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  author: string;
  tags: string[];
  reading_time: number;
  featured: boolean;
  image: string | null;

  title_ru: string | null;
  description_ru: string | null;
  excerpt_ru: string | null;
  content_ru: string | null;
  image_alt_ru: string | null;
  category_ru: string | null;
  published_label_ru: string | null;

  title_en: string | null;
  description_en: string | null;
  excerpt_en: string | null;
  content_en: string | null;
  image_alt_en: string | null;
  category_en: string | null;
  published_label_en: string | null;

  title_kk: string | null;
  description_kk: string | null;
  excerpt_kk: string | null;
  content_kk: string | null;
  image_alt_kk: string | null;
  category_kk: string | null;
  published_label_kk: string | null;

  created_at: string;
  updated_at: string;
};

export type SubmissionRow = {
  id: string;
  created_at: string;
  updated_at: string | null;

  client_name: string;
  industry: string;
  geography: string[] | null;
  languages: string[] | null;
  business_goals: string[] | null;

  target_audience: string;
  channels: string[] | null;
  usp: string | null;
  integrations: string[] | null;

  kpi_traffic: string | null;
  kpi_conversion: string | null;
  has_brandbook: boolean;
  brandbook_link: string | null;
  brandbook_file_url: string | null;
  brand_tone: number | null;

  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_method: "email" | "telegram" | "whatsapp" | "phone";
  team_roles: string | null;

  status: "new" | "in_progress" | "completed" | "archived";
  submitted_ip: string | null;
  user_agent: string | null;
};
