-- Blog posts table for admin CMS (trilingual: ru / en / kk)

CREATE TABLE IF NOT EXISTS blog_posts (
  id           uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         text    UNIQUE NOT NULL,
  status       text    NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'published', 'archived')),
  published_at date,
  author       text    NOT NULL DEFAULT 'Sayan Roor',
  tags         text[]  NOT NULL DEFAULT '{}',
  reading_time integer NOT NULL DEFAULT 5,
  featured     boolean NOT NULL DEFAULT false,
  image        text,

  -- Russian
  title_ru           text,
  description_ru     text,
  excerpt_ru         text,
  content_ru         text,
  image_alt_ru       text,
  category_ru        text,
  published_label_ru text,

  -- English
  title_en           text,
  description_en     text,
  excerpt_en         text,
  content_en         text,
  image_alt_en       text,
  category_en        text,
  published_label_en text,

  -- Kazakh
  title_kk           text,
  description_kk     text,
  excerpt_kk         text,
  content_kk         text,
  image_alt_kk       text,
  category_kk        text,
  published_label_kk text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) can do everything
CREATE POLICY "admin_all_blog_posts"
  ON blog_posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Anonymous users can only read published posts
CREATE POLICY "public_read_published_blog_posts"
  ON blog_posts FOR SELECT TO anon
  USING (status = 'published');

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();
