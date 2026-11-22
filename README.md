# Shahadat Hossen — Developer Portfolio

Personal developer portfolio and technical writing platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and an embedded **Sanity Studio** CMS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js `16.1.6` (App Router, RSC-first), React `19.2.3`, TypeScript (strict) |
| Styling | Tailwind CSS **v4** (CSS-first `@theme` tokens in `src/app/globals.css`), Fraunces + Urbanist + JetBrains Mono via `next/font` |
| CMS & Live Data | Sanity `^4.22`, `next-sanity` `^11.6` (`defineLive()` + `<SanityLive />`), Visual Editing / Draft Mode, embedded Studio at `/studio` |
| Rich Editorial Content | `@portabletext/react`, `@sanity/code-input`, `mermaid`, `react-player`, custom editorial sections, decision cards, outcome grids, and tables |
| Contact & Email | Next.js Server Action (`src/app/actions/sendEmail.ts`), `react-hook-form`, `nodemailer`, `@react-email/components`, `react-toastify` |
| Tooling & Testing | `pnpm`, Vitest `^4.1`, ESLint `^9` (flat config), Sanity TypeGen |

---

## Key Features

- **Modular CMS Page & Section Builder:** Reorderable Sanity `pageSections` dispatched via `SectionBuilder` (`personalIntroSection`, `engineeringPillars`, `quoteSection`, `technicalFoundation`, `philosophySection`, `experienceSection`, `ctaSection`) alongside dedicated page-builder modules for Home, About, Projects, Project Case Studies, Blogs, Blog Posts, and Contact.
- **Editorial Case Study & Blog Renderer:** Custom Portable Text pipeline supporting two-column and single-column `editorialSection` blocks (with nested syntax-highlighted `code` blocks), `mermaidDiagram` with interactive zoom/pan viewer, `decisionCards`, `outcomeState`, `portableTable`, responsive uncropped images (`SanityImage` with `fit="max"`), and YouTube embeds.
- **Type-Safe Sanity Integration:** Automated schema extraction (`src/sanity/extract.json`) and GROQ query-result generation (`src/sanity/types.ts`) via `pnpm typegen`.
- **Global Singletons & SEO:** Fixed-ID `siteSettings` and `layout` singletons powering dynamic metadata (`generateMetadata`), canonical URLs, Open Graph tags, robots rules, and Google Tag Manager.
- **Contact Mail Flow:** Validated Server Action sending React Email templates via SMTP (documented in `src/sections/contact/Email.FLow.md`).

---

## Project Structure

```text
src/
├── app/
│   ├── (frontend)/             # Public routes: /, /about, /projects, /projects/[slug], /blogs, /blogs/[slug], /contact
│   ├── api/draft-mode/         # Sanity Visual Editing draft-mode enable/disable handlers
│   ├── actions/                # "use server" contact form action + validation
│   ├── studio/[[...tool]]/     # Embedded Sanity Studio (/studio)
│   ├── fonts.ts                # Google Font definitions (Fraunces, Urbanist, JetBrains Mono)
│   └── globals.css             # Tailwind v4 @theme design tokens & motion utilities
├── page-builder/               # Route-owned data/ (GROQ + cached loaders), metadata/, and view/ modules
├── layout/                     # LayoutBuilder, global LAYOUT/SITE_SETTINGS queries, Header & Footer builders
├── sections/                   # SectionBuilder dispatcher + reusable UI & Sanity builder sections
├── fragments/                  # Shared root GROQ fragments (media, link, portable-text, section-heading, seo)
├── components/                 # Atomic UI primitives (SanityImage, PortableText, MermaidDiagram, etc.)
├── emails/                     # React Email templates for the contact form
├── lib/                        # Pure helpers (formatDate, hero, metadata) + Sanity link/route resolvers
└── sanity/                     # Schemas, Studio structure, schema registry, presentation & SDK adapters
```

---

## Getting Started

### Prerequisites

- **Node.js** `20+`
- **pnpm**
- A Sanity project (project ID & dataset) and SMTP credentials for the contact form

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the repository root:

```env
# Required — Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-02

# Required — Contact Form SMTP
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
MAIL_RECIEVER_ADDRESS=you@example.com

# Optional — Canonical Site Origin & Studio Presentation Preview URLs
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_DEVELOP=http://localhost:3000
NEXT_PUBLIC_SANITY_STUDIO_PREVIEW_URL_PRODUCTION=https://your-domain.com
```

### 3. Run Locally

```bash
pnpm dev
```

- Portfolio frontend: [http://localhost:3000](http://localhost:3000)
- Embedded Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

---

## Scripts

```bash
pnpm dev         # Runs `pnpm typegen` first (predev), then starts Next.js dev server
pnpm build       # Runs `pnpm typegen` first (prebuild), then builds for production
pnpm start       # Starts the production Next.js server
pnpm typegen     # Extracts Sanity schema & regenerates src/sanity/extract.json + src/sanity/types.ts
pnpm typecheck   # Runs TypeScript type-checking (tsc --noEmit)
pnpm test        # Runs the Vitest suite (helpers, components, schema & Studio structure tests)
pnpm test:watch  # Runs Vitest in watch mode
pnpm lint        # Runs ESLint (flat config)
```

### Verification Gate

```bash
pnpm typecheck && pnpm test && pnpm lint && pnpm build
```

---

## Documentation

- [AGENTS.md](./AGENTS.md) — Architecture rules, conventions, traps, and safe workflows.
- [docs/color-system.md](./docs/color-system.md) — Limestone & Forest color tokens and surface system.
- [src/sections/contact/Email.FLow.md](./src/sections/contact/Email.FLow.md) — Contact form delivery flow and SMTP setup.
