"use client";

// Floating scroll-to-top / scroll-to-bottom buttons.
import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";

export function ScrollButtons(): ReactElement {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <button
        type="button"
        className="rounded-full border border-border/60 bg-surface/80 p-3 text-foreground shadow-soft transition hover:-translate-y-1 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Scroll to top"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowRight className="h-4 w-4 -rotate-90" />
      </button>
      <button
        type="button"
        className="rounded-full border border-border/60 bg-surface/80 p-3 text-foreground shadow-soft transition hover:translate-y-1 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Scroll to bottom"
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }}
      >
        <ArrowRight className="h-4 w-4 rotate-90" />
      </button>
    </div>
  );
}
