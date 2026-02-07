import type { ReactElement } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { routing } from "@/i18n/routing";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";
import { BackgroundInfrastructure } from "@/components/layout/background-infrastructure";
import {
  StructuredData,
  generatePersonStructuredData,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData
} from "@/components/seo/structured-data";

const geistSans = Geist({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-mono",
});

export function generateStaticParams(): Array<{ locale: string }> {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutMetadataProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {
      ...generateBaseMetadata(),
      icons: {
        icon: "/Nanosudo_logo_favicon.png",
        shortcut: "/Nanosudo_logo_favicon.png",
        apple: "/Nanosudo_logo_dark.png",
      },
    };
  }

  const baseMetadata = generateBaseMetadata({
    locale,
  });

  return {
    ...baseMetadata,
    icons: {
      icon: "/Nanosudo_logo_favicon.png",
      shortcut: "/Nanosudo_logo_favicon.png",
      apple: "/Nanosudo_logo_dark.png",
    },
  };
}

type LocaleLayoutProps = {
  readonly children: React.ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps): Promise<ReactElement> {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  return (
    <div lang={locale} className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased scroll-smooth bg-background text-foreground`}>
      <ThemeProvider>
        <NextIntlClientProvider messages={messages}>
          <StructuredData data={generatePersonStructuredData(locale)} />
          <StructuredData data={generateWebsiteStructuredData(locale)} />
          <StructuredData data={generateOrganizationStructuredData()} />
          <BackgroundInfrastructure />
          <a className="skip-link" href="#main-content">
            {t("common.skipToContent")}
          </a>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}

