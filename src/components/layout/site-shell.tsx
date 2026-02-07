'use client';

// Layout wrapper: base shell for pages with optional header and footer.
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/cn";
// Dynamic background removed to simplify hero visuals and avoid intrusive animations
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { GlobalTechBackground } from "../global-tech-background";

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
        "relative flex min-h-screen flex-col bg-background text-foreground",
        className,
      )}
    >
      <GlobalTechBackground />
      {/* Static background only; dynamic background removed to improve UX */}
      {resolvedHeader}
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      {resolvedFooter ? (
        <footer className="relative z-10 border-t border-border/60 bg-surface/80">
          {resolvedFooter}
        </footer>
      ) : null}
    </div>
  );
}
