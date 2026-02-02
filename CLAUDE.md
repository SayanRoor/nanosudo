# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website for a full-stack developer, built with Next.js 15, TypeScript, Tailwind CSS 4, Supabase, and Brevo for transactional emails. The site features an interactive brief form with cost calculation, internationalization (i18n), and a modern design with 3D elements.

## Development Commands

### Core Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Full production build (typecheck + lint + build)
pnpm start            # Run production build
```

### Quality Checks
```bash
pnpm lint             # ESLint with max-warnings=0
pnpm typecheck        # TypeScript type checking
pnpm format           # Prettier formatting
```

### Testing
```bash
pnpm test             # Run unit tests with Vitest
pnpm test:watch       # Run tests in watch mode
pnpm test:build       # Run build verification tests
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:headed  # Run E2E tests with UI
```

### Database
```bash
pnpm db:setup         # Display database setup instructions
pnpm db:migrate       # Push migrations to Supabase (requires Supabase CLI)
```

## Architecture

### Environment Configuration
- **Layered env system**: Split into `env.client.ts`, `env.server.ts`, `env.ssr.ts`, and unified `env.ts`
- **Runtime validation**: All environment variables validated with Zod schemas at startup
- **Type safety**: Proxy-based `serverEnv` throws if accessed on client; `clientEnv` validated once
- Client vars use `NEXT_PUBLIC_*` prefix; server vars validated lazily via Proxy

### Internationalization (i18n)
- **next-intl**: Configured in `src/i18n/` with routing in `src/i18n/routing.ts`
- **Locale detection**: Middleware in `src/middleware.ts` handles locale routing
- **Pages structure**: All pages under `src/app/[locale]/` with locale parameter
- **Navigation**: Use wrappers from `src/i18n/routing.ts` (`Link`, `redirect`, `usePathname`, `useRouter`)

### Brief Form System
The interactive brief form is the core feature:
- **Two versions**: Old (`brief`) and new (`brief-new`) with cost calculation
- **Multi-step forms**: Located in `src/features/brief/components/`
  - Steps: client, audience, metrics, contact (old) + modules, design, content, technical, timeline (new)
- **Validation**: Zod schemas in `src/features/brief/schemas/` validate each step independently
- **State management**: Custom hooks (`use-brief-step.ts`, `use-brief-new-step.ts`) manage form state + localStorage persistence
- **API endpoint**: `src/app/api/brief/route.ts` handles submission:
  - Validates payload with Zod
  - Uploads brandbook files to Supabase Storage
  - Saves to `submissions` table in Supabase
  - Generates PDF report via `src/server/pdf/brief-report.ts`
  - Sends emails via Brevo (admin + client)

### Data Layer
- **Supabase**: PostgreSQL database with RLS policies
  - Tables: `submissions`, `brief_submissions`, `admin_members`
  - Storage: `brandbooks` bucket for brandbook files (PDF/ZIP, 10MB max)
  - Setup scripts: `supabase/setup-db.sql` and migrations in `supabase/migrations/`
- **Admin client**: `src/lib/supabase-admin.ts` uses service role key for server operations
- **Browser client**: `src/lib/supabase-browser.ts` for client-side operations

### Email System
- **Brevo integration**: `src/server/email/brevo.ts` sends transactional emails
- **Email types**: Admin notifications + client confirmations
- **Attachments**: PDF reports attached via base64 encoding

### Feature Structure
Features organized in `src/features/` with:
- `/components` - React components
- `/schemas` - Zod validation schemas
- `/hooks` - Custom React hooks
- `/types` - TypeScript types
- `/constants` - Static data and configuration
- `/utils` - Business logic utilities

### Components
- **Layout**: `src/components/layout/` (site-header, site-shell, container)
- **Background**: `src/components/background/` with Three.js particles
- **Logo**: `src/components/logo/` with multiple variants and SVG shapes
- **SEO**: `src/components/seo/structured-data.tsx` for JSON-LD
- **Theme**: `src/components/theme/theme-provider.tsx` manages dark/light mode

## Code Constraints

### TypeScript
- **No `any`**: Use `unknown` with runtime validation
- **Explicit returns**: All functions must have explicit return types
- **Function size**: Keep functions under 50 lines; split if larger

### Validation
- **Zod everywhere**: All inputs validated with Zod schemas
- **ENV validation**: Environment variables validated at startup
- **Form validation**: react-hook-form with `zodResolver` from `src/lib/zod-resolver.ts`

### Testing Requirements
- **Unit tests**: Business logic and utilities (Vitest)
- **Integration tests**: API routes and database contracts
- **E2E tests**: Critical user flows (Playwright)
- **Coverage focus**: Authentication, payments, data integrity, critical flows
- **Test naming**: Behavior-based (describe/it), one aspect per test

### UX/Accessibility
- **Keyboard navigation**: Focus traps and tab order
- **Contrast/semantics**: WCAG compliance
- **State management**: Error, loading, and empty states required
- **Client components**: Interactive features must use 'use client' directive

### Performance/SEO
- **Budgets**: LCP P75 < 2.5s, CLS < 0.1
- **Images**: Prefer WebP/AVIF, use Next.js Image component
- **Code splitting**: Lazy load heavy components
- **Metadata**: Each page has `page-metadata.ts` with SEO data
- **Sitemap**: Generated in `src/app/sitemap.ts`

## Important Patterns

### Metadata Generation
Each route folder contains `page-metadata.ts` that exports metadata configuration:
- Import and use `createMetadata()` from `src/lib/metadata.ts`
- Provides type-safe metadata generation with i18n support

### Server Actions
- Use serverEnv for sensitive keys
- Return serializable data only
- Validate inputs with Zod
- Handle errors gracefully with user-friendly messages

### Component Files
- New files start with brief comment describing purpose
- Follow existing folder structure
- Use barrel exports (`index.ts`) for public API

### Test Mode
- E2E tests set `E2E_TEST_MODE=true` to skip external integrations
- Check `process.env.E2E_TEST_MODE` in API routes before calling Supabase/Brevo

## Git Workflow

- **Main branch**: `main` (stable)
- **Development branch**: `develop` (target for PRs)
- **Commit format**: Conventional Commits (feat:, fix:, docs:, etc.)
- **Recent context**: Check recent commits for patterns (e.g., "fix after production failed")

## Production Constraints (when working on `main`)

- No breaking changes without documentation
- Rollback plan required for database migrations
- Lighthouse/Web Vitals must stay in budget
- A11y: No serious/critical issues from axe

## Notes

- **Package manager**: pnpm (v8+) only - uses `pnpm-lock.yaml`
- **Node version**: 20+ required
- **Next.js config**: Uses `next-intl` plugin and typed routes
- **Aliases**: `@/` maps to `src/`
- **No console logs**: Keep production code clean
- **Security**: Never log PII/secrets, mask identifiers
