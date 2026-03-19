# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ShipAny Template Two — an AI SaaS boilerplate built with Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, and Tailwind CSS 4. Supports multiple databases (PostgreSQL, MySQL, SQLite/Turso), payment providers (Stripe, PayPal, Creem), AI providers (Replicate, Gemini, FAL, OpenRouter), and i18n (next-intl).

## Commands

```bash
# Development
npm run dev                # Next.js dev server with Turbopack
npm run build              # Production build
npm run start              # Start production server

# Code quality
npm run lint               # ESLint
npm run format             # Prettier format
npm run format:check       # Check formatting

# Database (uses dotenv-cli + drizzle-kit)
npm run db:generate        # Generate migrations from schema
npm run db:migrate         # Run migrations
npm run db:push            # Push schema directly to DB
npm run db:studio          # Open Drizzle Studio

# Auth & RBAC
npm run auth:generate      # Generate better-auth types
npm run rbac:init          # Initialize default roles/permissions
npm run rbac:assign        # Assign role to a user

# Cloudflare deployment
npm run cf:preview         # Preview on CF Workers
npm run cf:deploy          # Deploy to CF Workers
```

## Architecture

### Layer Organization

- **`src/config/`** — Static configuration: env vars (`index.ts`), DB schema, i18n messages, CSS theme
- **`src/core/`** — System fundamentals: auth (better-auth), DB connection, i18n, RBAC, theme provider
- **`src/shared/`** — Cross-cutting code: UI blocks, components, hooks, models (data access), services (business logic), types, lib (utilities)
- **`src/extensions/`** — Pluggable provider integrations: payment, AI, analytics, email, storage, ads, customer-service, affiliate
- **`src/themes/`** — Theme templates with theme-specific block overrides
- **`src/app/`** — Next.js App Router pages and API routes
- **`content/`** — MDX content for docs, blog posts, pages, changelogs (via Fumadocs)
- **`scripts/`** — CLI utilities (`with-env.ts` wraps scripts with env loading)

### Routing Structure

Routes are under `src/app/[locale]/` with route groups:
- `(landing)/` — Public pages (home, pricing, blog, AI tools, settings, activity)
- `(auth)/` — Sign-in, sign-up, verify-email
- `(admin)/` — Admin dashboard (users, roles, permissions, posts, payments, credits, etc.)
- `(chat)/` — Chat UI
- `(docs)/` — Documentation pages

API routes live in `src/app/api/` organized by domain (auth, payment, ai, chat, user, config, email, storage, etc.).

### Database

Multi-dialect support via Drizzle ORM with compatibility shims:
- Schema files: `src/config/db/schema.{postgres,mysql,sqlite}.ts`
- `src/config/db/schema.ts` re-exports the active dialect's schema
- `src/core/db/index.ts` — Universal `db()` accessor; MySQL/SQLite shims polyfill `.returning()` and `.onConflictDoUpdate()` to match PostgreSQL API
- Dialect selected by `DATABASE_PROVIDER` env var (default: `postgresql`)
- All env config centralized in `src/config/index.ts` via the `envConfigs` object

### Authentication

better-auth with runtime config merging:
- Base config: `src/core/auth/config.ts`
- Client helpers: `src/core/auth/client.ts`
- Social providers (Google, GitHub) enabled when credentials are set
- Email verification enabled when Resend API key is present
- Database hooks on user creation handle credit grants and role assignment

### Payment System

`PaymentManager` in `src/extensions/payment/index.ts` orchestrates pluggable providers. Flow: Order creation → Checkout session → Provider processing → Webhook → Credit grant. Credit system uses FIFO queue for consumption.

### Extensions Pattern

Each extension follows a Manager + Provider pattern:
```
Manager (PaymentManager, AIManager, EmailManager, etc.)
├── addProvider(provider, isDefault)
├── getProvider(name) / getDefaultProvider()
└── domain methods delegate to the active provider
```
Providers implement a shared interface per domain (`PaymentProvider`, `AIProvider`, etc.).

### Services & Models Pattern

- **Models** (`src/shared/models/`) — Data access layer, direct DB queries via Drizzle
- **Services** (`src/shared/services/`) — Business logic, orchestrate models and extensions
- **Extensions** (`src/extensions/`) — Provider implementations behind abstract interfaces

### Styling

Tailwind CSS 4 with OKLCH CSS variables defined in `src/config/style/theme.css`. Fonts: Noto Sans Mono (sans), Merriweather (serif), JetBrains Mono (mono). UI built on Radix primitives (48 components in `src/shared/components/ui/`).

### i18n

next-intl with `as-needed` locale prefix. Two locales: `en` (default), `zh`. Translations in `src/config/locale/messages/{en,zh}/` with 40+ namespace JSON files. Server: `getLocale()`, Client: `useTranslations()`.

### Themes

Theme overrides in `src/themes/default/blocks/` can replace shared blocks. Themes provide layouts and page-level components.

## Key Conventions

- Import paths use `@/*` alias (maps to `src/`)
- Content source alias `@/.source` (maps to `.source/index.ts`)
- IDs generated via `getUuid()` from `src/shared/lib/hash.ts`
- Timestamps: auto `createdAt`/`updatedAt`, soft deletes via `deletedAt`
- Environment variables accessed through `envConfigs` in `src/config/index.ts` (never raw `process.env` in app code)
- Route groups use parentheses for organization without URL impact
- All database operations should work across dialects — use the compatibility shims, avoid dialect-specific SQL
- API responses use `respData()` and `respErr()` from `src/shared/lib/resp.ts`
- RBAC: Roles hierarchy is super_admin > admin > editor > viewer, managed in `src/core/rbac/permission.ts`
- React Compiler is enabled in `next.config.mjs`
- Output mode: standalone (except on Vercel)
