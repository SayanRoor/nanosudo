import type { ReactElement, ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

type TrackLayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
};

export async function generateMetadata({ params }: TrackLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "support" });
  const baseUrl = 'https://nanosudo.com';
  const url = locale === routing.defaultLocale
    ? `${baseUrl}/support/track`
    : `${baseUrl}/${locale}/support/track`;
  return generateBaseMetadata({
    title: t("track.title"),
    locale,
    url,
    noIndex: true,
  });
}

export default function TrackLayout({ children }: TrackLayoutProps): ReactElement {
  return <>{children}</>;
}
