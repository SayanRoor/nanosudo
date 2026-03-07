'use client';

// Layout wrapper: base shell for pages with optional header and footer.
import type { ReactElement, ReactNode } from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/cn";
import { SiteHeader } from "./site-header";

// Lazy-load footer: it contains mapbox-gl (~280 KB) and is always below the fold.
const SiteFooter = dynamic(() => import("./site-footer").then((m) => ({ default: m.SiteFooter })), {
  ssr: false,
});

type SiteShellProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
};

export function SiteShell({
  children,
  className,
  header,
  footer,
}: SiteShellProps): ReactElement {
  // Show header on all pages
  const resolvedHeader = header !== undefined
    ? header
    : <SiteHeader />;
  const resolvedFooter = footer ?? <SiteFooter />;

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-background text-foreground",
        className,
      )}
    >
      {resolvedHeader}
      <div className="flex flex-1 flex-col">{children}</div>
      {resolvedFooter ? (
        <footer className="border-t border-border/60 bg-surface/80">
          {resolvedFooter}
        </footer>
      ) : null}
    </div>
  );
}
