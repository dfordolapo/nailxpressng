# Nailexpress

> **Direct-to-Consumer (DTC) Premium Press-On Nails E-Commerce Progressive Web App (PWA)**  
> Live Store: [https://www.nailexpress.ng](https://www.nailexpress.ng)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Vitest](https://img.shields.io/badge/Vitest-Automated_Tests-729B1B?style=flat-square&logo=vitest)](https://vitest.dev)
[![Storybook](https://img.shields.io/badge/Storybook-Design_System-FF4785?style=flat-square&logo=storybook)](https://storybook.js.org)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI_Passed-2088FF?style=flat-square&logo=github-actions)](https://github.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://www.nailexpress.ng)

---

## Executive Overview

**Nailexpress** is a full-stack Progressive Web App engineered from the ground up for a premium press-on nail brand based in Nigeria. The platform combines refined aesthetics (glassmorphism, custom typography, 60fps micro-animations) with enterprise architecture, real-time inventory management, automated payment verification, AI-assisted copy tools, and deep SEO discoverability.

---

## Key Highlights & Features

### Client & Customer Experience
* **Interactive 3D Cards & Sizing Matrix**: 3D card tilt and front-to-back flip physics with instant size selection (Small, Medium, Large) and on-hand preview loupes.
* **Interactive Gift Box Loupe**: Cursor and touch-tracking magnifying glass for high-definition packaging inspection.
* **5-Step Custom Nail Builder**: Interactive custom order funnel with photo upload, Supabase bucket persistence, dynamic price estimation, and automated WhatsApp handoff.
* **Find Your Fit Quiz**: 3-step interactive recommendation modal matching customer vibe, nail shape, and color mood to live catalog stock.
* **High-Performance Shopping & Checkout**:
  * Persistent Cart & Wishlist context with sliding bottom drawers.
  * Seamless **Paystack** inline payment integration (Card, USSD, Bank Transfer in NGN).
  * Automated transactional receipts and order alerts dispatched via **Resend API**.

### Merchant & Admin Suite
* **Full CRUD Product Management**: Manage pricing, compare-at discounts, shape/length tags, inventory counts, and multi-image galleries.
* **AI-Powered Product Copywriting**: Integrated **Google Gemini AI** in the admin dashboard to generate SEO-rich product descriptions in seconds.
* **Custom Orders & Order Pipeline**: Real-time status tracking, quote management, and direct WhatsApp customer outreach actions.

### Progressive Web App (PWA)
* Service worker caching with offline connectivity banners.
* Native standalone install capability across mobile and desktop.
* Multi-device iOS and Android splash screens generated for 20+ viewport dimensions.

### Technical SEO & Googlebot Discoverability
* **Semantic SSR Links**: Every product card renders crawlable `<Link href="/product/[slug]">` anchors in the server-rendered HTML.
* **Schema.org Structured Data (JSON-LD)**: Rich snippet schema for `Product`, `Offer`, `AggregateRating`, `Organization`, and `WebSite`.
* **Dynamic XML Sitemap**: Edge-cached `sitemap.xml` automatically synchronizing dynamic product slugs from Supabase with `robots.txt` and apex-to-www 301 canonical redirects.

---

## Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org), [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Styling & Motion** | Vanilla CSS Modules, CSS Variables, [Framer Motion](https://www.framer.com/motion) |
| **Component Workshop** | [Storybook 10](https://storybook.js.org) (`npm run storybook`) |
| **Database & Auth** | [Supabase](https://supabase.com) (PostgreSQL, Row-Level Security, Storage Buckets) |
| **Payment Gateway** | [Paystack](https://paystack.com) API (Inline Checkout SDK) |
| **Email Infrastructure** | [Resend](https://resend.com) API (React Email HTML Templates) |
| **AI Integration** | [Google Gemini Generative AI](https://ai.google.dev) (`@google/generative-ai`) |
| **Testing Suite** | [Vitest](https://vitest.dev), Testing Library, JSDOM |
| **CI/CD & DevOps** | [GitHub Actions](https://github.com/features/actions), [Vercel Edge Platform](https://vercel.com) |

---

## Repository Structure

```
nailexpress/
├── .github/workflows/       # Automated CI/CD build & test pipeline
├── .storybook/              # Storybook design system configuration
├── public/                  # Static assets, fonts, icons, PWA manifest, splash screens
├── src/
│   ├── app/                 # Next.js 16 App Router (pages, layouts, API endpoints, sitemap, robots)
│   ├── components/          # Reusable UI molecules & modular feature components
│   │   ├── admin/           # Dashboard management widgets
│   │   ├── home/            # Hero, Marquees, Loupe, Shop the Look, Footer
│   │   ├── product/         # Product cards, 3D flip cards, fit quiz, shape filter
│   │   └── ui/              # Buttons, icons, search overlay, PWA banners
│   ├── context/             # React Context Providers (Cart, Wishlist, Toast, Search)
│   ├── lib/                 # Core utilities, Supabase client, email helper, unit tests
│   └── types/               # Centralized TypeScript interface contracts
├── supabase/                # SQL migrations, RLS policies, and database schema
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Enterprise security headers and asset caching
└── vitest.config.ts         # Automated unit testing configuration
```

---

## Engineering & Architecture Highlights

* **Server-Side Rendered (SSR) Catalog**: Full SEO discoverability with static and server-rendered HTML payloads, structured JSON-LD schemas, and dynamic XML sitemap generation.
* **Component-Driven Development**: Scalable UI built with Vanilla CSS Modules and document-driven component testing via Storybook.
* **Robust Automated Testing**: Unit test coverage across pricing math, shopping cart states, and discount calculation with Vitest and Testing Library.
* **Continuous Integration**: Strict GitHub Actions pipeline ensuring zero lint regressions, passing unit tests, and production build verification on every push.

---

## Project Showcase & Attribution
* **Client**: Nailexpress Nigeria
* **Live Store**: [https://www.nailexpress.ng](https://www.nailexpress.ng)
* **Status**: Production Deployment (Vercel Edge Network)
* **Author / Engineer**: Dolapo Oyekanmi ([@dfordolapo](https://github.com/dfordolapo))

---

*Note: This repository is maintained publicly as an engineering and design portfolio case study. All proprietary brand assets and content belong to Nailexpress.*
