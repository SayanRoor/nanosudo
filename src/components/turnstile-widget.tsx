"use client";

// Cloudflare Turnstile — bot protection for public forms (brief/support).
// Plain script loader, no added dependency. Renders nothing if the site key
// isn't configured (NEXT_PUBLIC_TURNSTILE_SITE_KEY unset), so forms keep
// working before/without the feature being set up — see useTurnstile().
import { useCallback, useEffect, useId, useRef, useState, type ReactElement } from "react";

import { clientEnv } from "@/config";

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let scriptLoadPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptLoadPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = (): void => resolve();
    script.onerror = (): void => reject(new Error("Failed to load Turnstile script."));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

// Shared state: renders the widget and reports back a verification token.
export function useTurnstile(): {
  readonly enabled: boolean;
  readonly token: string | null;
  readonly onVerify: (token: string) => void;
  readonly onExpire: () => void;
} {
  const [token, setToken] = useState<string | null>(null);
  const enabled = Boolean(clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const onVerify = useCallback((t: string): void => setToken(t), []);
  const onExpire = useCallback((): void => setToken(null), []);
  return { enabled, token, onVerify, onExpire };
}

type TurnstileWidgetProps = {
  readonly onVerify: (token: string) => void;
  readonly onExpire?: () => void;
  readonly className?: string;
};

export function TurnstileWidget({ onVerify, onExpire, className }: TurnstileWidgetProps): ReactElement | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const domId = useId();
  const siteKey = clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;
    const container = containerRef.current;

    void loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": onExpire,
        theme: "auto",
      });
    });

    return (): void => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
    // Widget is rendered once per mount; onVerify/onExpire are stable via useCallback upstream.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;

  return <div ref={containerRef} className={className} id={`turnstile-${domId}`} />;
}
