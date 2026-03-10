-- Add newsletter tracking column to blog_posts.
-- Stores when the newsletter campaign was last sent for this post.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS newsletter_sent_at timestamptz;
