import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllPublishedPosts } from '@/lib/blog-db';
import type { AppLocale } from '@/lib/blog-data';
import { getAllProjects } from '@/lib/portfolio-data';

const BASE_URL = 'https://nanosudo.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Статические страницы для каждого языка
  const staticPages = routing.locales.flatMap((locale) => [
    {
      url: locale === routing.defaultLocale 
        ? BASE_URL 
        : `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: locale === routing.defaultLocale 
        ? `${BASE_URL}/about`
        : `${BASE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: locale === routing.defaultLocale 
        ? `${BASE_URL}/blog`
        : `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: locale === routing.defaultLocale 
        ? `${BASE_URL}/cases`
        : `${BASE_URL}/${locale}/cases`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: locale === routing.defaultLocale
        ? `${BASE_URL}/contact`
        : `${BASE_URL}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: locale === routing.defaultLocale
        ? `${BASE_URL}/services`
        : `${BASE_URL}/${locale}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: locale === routing.defaultLocale
        ? `${BASE_URL}/support`
        : `${BASE_URL}/${locale}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: locale === routing.defaultLocale
        ? `${BASE_URL}/privacy-policy`
        : `${BASE_URL}/${locale}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]);

  // Динамические страницы блога для каждого языка
  const blogPages: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    const posts = await getAllPublishedPosts(locale as AppLocale);
    for (const post of posts) {
      blogPages.push({
        url: locale === routing.defaultLocale
          ? `${BASE_URL}/blog/${post.slug}`
          : `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Динамические страницы кейсов для каждого языка
  const casePages = routing.locales.flatMap((locale) => {
    const projects = getAllProjects();
    return projects.map((project) => ({
      url: locale === routing.defaultLocale
        ? `${BASE_URL}/cases/${project.id}`
        : `${BASE_URL}/${locale}/cases/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  });

  return [
    ...staticPages,
    ...blogPages,
    ...casePages,
  ];
}

