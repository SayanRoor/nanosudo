import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';

type HomePageMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: HomePageMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const t = await getTranslations({ locale });

  // `home.hero.title` is a rich-text message (contains <highlight> tags), so a
  // plain `t()` call throws a formatting error and next-intl falls back to the
  // raw key string ("home.hero.title"). Read the raw message instead and strip
  // the markup tags to get a clean plain-text title for SEO/social metadata.
  const rawHeroTitle = t.raw('home.hero.title') as string | undefined;
  const heroTitle = (rawHeroTitle ?? 'Разрабатываю решения, которые приносят результат').replace(
    /<[^>]*>/g,
    '',
  );

  return generateBaseMetadata({
    title: heroTitle,
    description: t('home.hero.description', { defaultValue: 'ИИ-автоматизация и веб-разработка для бизнеса в Казахстане. Make.com, n8n, Claude API, Next.js. Полный цикл: разработка, интеграции с CRM/1С/Kaspi. Первая консультация бесплатно.' }),
    locale,
    url: `https://nanosudo.com/${locale}`,
    keywords: [
      'ии автоматизация казахстан',
      'ai автоматизация алматы',
      'make.com автоматизация',
      'n8n казахстан',
      'claude api интеграция',
      'веб разработка алматы',
      'next.js разработчик казахстан',
      'автоматизация бизнес процессов',
      'cursor claude vibe coding',
      'fullstack разработчик казахстан',
    ],
  });
}

