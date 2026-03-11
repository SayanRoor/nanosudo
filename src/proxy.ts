// Proxy (middleware): nonce-based CSP + next-intl i18n routing.
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // Nonce + strict-dynamic: no unsafe-inline, no unsafe-eval
    // strict-dynamic trusts scripts dynamically created by nonced scripts
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.jsdelivr.net https://cdn.simpleicons.org https://mc.yandex.ru https://mc.yandex.com https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://api.brevo.com https://api.mapbox.com https://*.tiles.mapbox.com https://events.mapbox.com https://mc.yandex.ru https://mc.yandex.com wss://mc.yandex.ru wss://mc.yandex.com https://www.google-analytics.com https://www.googletagmanager.com https://cloudflareinsights.com https://static.cloudflareinsights.com",
    "frame-src https://www.googletagmanager.com",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

export default function proxy(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  const pathname = request.nextUrl.pathname;

  // Admin routes skip i18n
  if (pathname.startsWith('/admin')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('content-security-policy', csp);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('content-security-policy', csp);
    return response;
  }

  // i18n routes: inject nonce + CSP into request headers so Next.js
  // can propagate the nonce to its own inline scripts, then run intl middleware
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);

  const modifiedRequest = new NextRequest(request, { headers: requestHeaders });
  const response = intlMiddleware(modifiedRequest);
  response.headers.set('content-security-policy', csp);
  response.headers.set('x-nonce', nonce);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
