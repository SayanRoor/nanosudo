import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://nanosudo.com';

const SITE_NAMES: Record<string, string> = {
  ru: 'Sayan Roor — Full-stack разработчик',
  en: 'Sayan Roor — Full-stack Developer',
  kk: 'Sayan Roor — Full-stack әзірлеуші',
};

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  ru: 'Создаю высокопроизводительные веб-приложения на Next.js и TypeScript с фокусом на конверсию. Полный цикл: разработка, интеграции с CRM/1С/Kaspi, маркетинг.',
  en: 'Building high-performance web applications with Next.js and TypeScript. Full-cycle development: from strategy to launch and marketing. Focus on conversion and performance.',
  kk: 'Next.js және TypeScript-те жоғары өнімді веб-қосымшаларды әзірлеймін. Толық цикл: әзірлеу, CRM/1С/Kaspi интеграциясы, маркетинг.',
};

const KEYWORDS: Record<string, string[]> = {
  ru: ['Full-stack разработчик', 'Next.js', 'TypeScript', 'React', 'Node.js', 'Разработка сайтов Алматы', 'Создание веб-приложений', 'Интеграция Kaspi API', 'Интеграция 1С', 'CRM интеграция'],
  en: ['Full-stack developer', 'Next.js', 'TypeScript', 'React', 'Node.js', 'Web development', 'Custom web applications', 'Kaspi API integration', '1C integration', 'CRM integration'],
  kk: ['Full-stack әзірлеуші', 'Next.js', 'TypeScript', 'React', 'Node.js', 'Сайт әзірлеу Алматы', 'Веб-қосымшаларды жасау', 'Kaspi API интеграциясы', '1С интеграциясы', 'CRM интеграциясы'],
};

type GenerateMetadataOptions = {
  readonly title?: string;
  readonly description?: string;
  readonly image?: string;
  readonly url?: string;
  readonly locale?: string;
  readonly type?: 'website' | 'article';
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly author?: string;
  readonly keywords?: string[];
  readonly noIndex?: boolean;
};

function extractPathname(url: string): string {
  const path = url.replace(BASE_URL, '') || '/';
  for (const l of routing.locales) {
    if (path === `/${l}`) return '/';
    if (path.startsWith(`/${l}/`)) return path.slice(l.length + 1);
  }
  return path;
}

function getLocaleUrl(locale: string, pathname: string): string {
  if (pathname === '/') {
    return locale === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${locale}`;
  }
  return locale === routing.defaultLocale
    ? `${BASE_URL}${pathname}`
    : `${BASE_URL}/${locale}${pathname}`;
}

export function generateMetadata({
  title,
  description,
  image = `${BASE_URL}/Sayan_Roor_Web_Dev.jpg`,
  url,
  locale = routing.defaultLocale,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Sayan Roor',
  keywords,
  noIndex = false,
}: GenerateMetadataOptions = {}): Metadata {
  const currentLocale = (locale && routing.locales.includes(locale as (typeof routing.locales)[number])) ? locale : routing.defaultLocale;
  const siteName = SITE_NAMES[currentLocale] || SITE_NAMES[routing.defaultLocale];
  const defaultDesc = DEFAULT_DESCRIPTIONS[currentLocale] || DEFAULT_DESCRIPTIONS[routing.defaultLocale];
  const defaultKeywords = KEYWORDS[currentLocale] || KEYWORDS[routing.defaultLocale];

  const finalDescription = description || defaultDesc;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  const pathname = url ? extractPathname(url) : '/';
  const canonicalUrl = url || getLocaleUrl(currentLocale, pathname);

  const alternateLanguages: Record<string, string> = {};
  for (const l of routing.locales) {
    alternateLanguages[l] = getLocaleUrl(l, pathname);
  }
  alternateLanguages['x-default'] = getLocaleUrl(routing.defaultLocale, pathname);

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: keywords || defaultKeywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      type,
      locale: currentLocale === 'ru' ? 'ru_RU' : currentLocale === 'kk' ? 'kk_KZ' : 'en_US',
      alternateLocale: routing.locales
        .filter((l) => l !== currentLocale)
        .map((l) => l === 'ru' ? 'ru_RU' : l === 'kk' ? 'kk_KZ' : 'en_US'),
      url: canonicalUrl,
      title: fullTitle,
      description: finalDescription,
      siteName: siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [image],
      creator: '@satoshi_iam',
    },
    robots: {
      index: !noIndex,
      follow: true,
      notranslate: false,
      googleBot: {
        index: !noIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(author && {
      authors: [{ name: author }],
    }),
    category: 'technology',
  };
}

