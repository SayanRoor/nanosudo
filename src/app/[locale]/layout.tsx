import type { ReactElement } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { routing } from "@/i18n/routing";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";
import { BackgroundInfrastructure } from "@/components/layout/background-infrastructure";

// Lazy-load non-critical cookie consent banner
const CookieConsent = dynamic(
  () => import("@/components/cookie-consent").then((m) => ({ default: m.CookieConsent })),
);

const interSans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
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

  const messages = await getMessages();
  const t = await getTranslations({ locale });

  return (
    <div lang={locale} className={`${interSans.variable} ${geistMono.variable} font-sans antialiased scroll-smooth bg-background text-foreground`}>
      <ThemeProvider>
        <NextIntlClientProvider messages={messages}>
          <BackgroundInfrastructure />
          <a className="skip-link" href="#main-content">
            {t("common.skipToContent")}
          </a>
          {children}
          <CookieConsent />
          <SpeedInsights />
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}

