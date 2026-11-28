// Scheduled blog publishing: a post with status "published" and a future
// `published_at` stays hidden until that calendar day starts in Almaty.
// The date filter is the single source of truth for visibility, so a missed
// cron run can never leave a due post unpublished.

export const BLOG_TIMEZONE = "Asia/Almaty";

/** Today's date (YYYY-MM-DD) in the blog's timezone. */
export function getBlogToday(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BLOG_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** True when a published post's date is still in the future. */
export function isScheduledForFuture(
  publishedAt: string | null | undefined,
  today: string = getBlogToday(),
): boolean {
  if (!publishedAt) {
    return false;
  }
  return publishedAt.slice(0, 10) > today;
}

/** PostgREST `or` filter: no date set, or date already reached. */
export function publishedByDateFilter(today: string = getBlogToday()): string {
  return `published_at.is.null,published_at.lte.${today}`;
}
