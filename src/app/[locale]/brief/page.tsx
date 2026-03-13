import type { ReactElement } from "react";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import BriefSimplePage from "./page-simple-client";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

type BriefPageProps = {
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: BriefPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brief" });
  const baseUrl = 'https://nanosudo.com';
  const url = locale === routing.defaultLocale
    ? `${baseUrl}/brief`
    : `${baseUrl}/${locale}/brief`;
  return generateBaseMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    url,
    noIndex: true,
  });
}

// CRITICAL: This page MUST NOT be prerendered
// generateStaticParams in layout.tsx forces Next.js to prerender all pages
// Solution: Override generateStaticParams to return empty array
// This prevents Next.js from attempting to prerender this page
export function generateStaticParams(): Array<{ locale: string }> {
  // Return empty array to prevent prerendering
  // This overrides the generateStaticParams from layout.tsx for this specific page
  return [];
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = false;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export default function BriefPage(): ReactElement {
  // Force dynamic rendering by using unstable_noStore
  // This ensures the page is always rendered dynamically at request time
  // unstable_noStore is safe to use and doesn't throw errors during build
  noStore();

  return <BriefSimplePage />;
}
