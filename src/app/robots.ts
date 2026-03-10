import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next/', '/_vercel/'],
      },
    ],
    sitemap: 'https://nanosudo.com/sitemap.xml',
  };
}
