// Admin route group layout — auth guard + sidebar via AdminLayout client component.

import type { ReactElement, ReactNode } from "react";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AdminLayout } from "@/features/admin/components/admin-layout";
import "../globals.css";

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

export default function AdminRootLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <div className={`${interSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
      <ThemeProvider>
        <AdminLayout>{children}</AdminLayout>
      </ThemeProvider>
    </div>
  );
}
