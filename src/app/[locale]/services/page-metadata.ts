// SEO metadata for /services page
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import { routing } from '@/i18n/routing';

type ServicesPageMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: ServicesPageMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return generateBaseMetadata();
  }

  const t = await getTranslations({ locale });

  return generateBaseMetadata({
    title: t('services.meta.title'),
    description: t('services.meta.description'),
    locale,
    url: locale === routing.defaultLocale ? 'https://nanosudo.com/services' : `https://nanosudo.com/${locale}/services`,
    keywords: [
      'ии автоматизация казахстан',
      'внедрение ии бизнес',
      'make.com автоматизация',
      'n8n казахстан',
      'claude api интеграция',
      'ai automation kazakhstan',
      'веб-разработка алматы',
      'next.js разработчик',
      'автоматизация бизнес-процессов',
      'ai consulting',
    ],
  });
}
