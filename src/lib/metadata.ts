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

  // Attempt to build a path-safe canonical and alternate URLs
  // This assumes url passed is the full URL without locale prefix if it's the default locale
  const canonicalUrl = url || (currentLocale === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${currentLocale}`);

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: keywords || defaultKeywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ru': `${BASE_URL}/ru`,
        'en': `${BASE_URL}/en`,
        'kk': `${BASE_URL}/kk`,
        'x-default': BASE_URL,
      },
    },
    openGraph: {
      type,
      locale: currentLocale === 'ru' ? 'ru_RU' : currentLocale === 'en' ? 'en_US' : 'kk_KZ',
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
      follow: !noIndex,
      notranslate: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
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

