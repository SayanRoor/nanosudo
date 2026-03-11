import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  icons: {
    icon: "/Nanosudo_logo_favicon.png",
    shortcut: "/Nanosudo_logo_favicon.png",
    apple: "/Nanosudo_logo_dark.png",
  },
};

export default async function RootLayout({ children }: { readonly children: ReactNode }): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html lang="ru" suppressHydrationWarning data-theme="dark">
      <head>
        <meta name="apple-mobile-web-app-title" content="Nano Sudo" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-for-app/apple-icon.png" />
        <link rel="icon" href="/favicon-for-app/favicon.ico" />
        <link rel="mask-icon" href="/favicon-for-app/icon0.svg" color="#000000" />
        <link rel="manifest" href="/favicon-for-app/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>
        {/* Yandex Metrica — external script, loaded after window.onload */}
        <Script
          id="ym-init"
          src="/scripts/ym-init.js"
          strategy="lazyOnload"
          nonce={nonce}
        />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/105451631" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NC3L984P"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Tag Manager — external script, loaded after window.onload */}
        <Script
          id="gtm-base"
          src="/scripts/gtm-init.js"
          strategy="lazyOnload"
          nonce={nonce}
        />

        {children}
      </body>
    </html>
  );
}
