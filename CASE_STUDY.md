# NailExpress

**A bespoke ecommerce experience designed and engineered for a premium press-on nail brand.**

---

### Project Overview

* **Role:** Product Designer · UX Writer · Design Engineer
* **Timeline:** ~2 Months
* **Scope:** UX/UI Design, Design System, Frontend Architecture, Backend/Database, Checkout & Payments, Merchant Admin Hub, PWA, SEO
* **Live Product:** [https://www.nailexpress.ng](https://www.nailexpress.ng)

---

### Verified Technology Stack

| Layer | Technologies Used in Codebase |
| :--- | :--- |
| **Core Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Motion** | Vanilla CSS Modules, CSS Variables Design Tokens, Framer Motion |
| **Database & Storage** | Supabase (PostgreSQL, Row-Level Security, Cloud Storage Buckets) |
| **Payments** | Paystack Inline SDK (Card, USSD, Bank Transfer in NGN) + Server Verification |
| **Transactional Email** | Resend API with custom branded HTML email templates |
| **AI Integration** | Google Gemini API (`gemini-3.5-flash`) for automated product copywriting |
| **PWA & Performance** | Web App Manifest, Service Worker offline caching, multi-screen iOS splash screens |
| **SEO & Discoverability** | Schema.org Structured Data (JSON-LD), dynamic edge-cached XML Sitemap, Semantic SSR |
| **Quality & Workshop** | Storybook 10, Vitest |

---

## 1. The Challenge

In regional ecommerce markets such as Nigeria, selling luxury press-on nails online comes with severe friction points:

1. **Quality Skepticism & Tactile Uncertainty:** Press-ons are often associated with cheap plastic salon alternatives. Because customers cannot physically touch the nails, feel their thickness, or inspect hand-painted details, purchase hesitation is high.
2. **Sizing Paralysis:** Traditional press-on sizing (`S`, `M`, `L`, or millimeter measurements) confuses first-time shoppers. Customers fear ordering sets that pop off or cause discomfort.
3. **The WhatsApp Fragmentation Loop:** Most regional merchants operate exclusively through direct messaging on WhatsApp. This leads to lost reference photos, unconfirmed payment receipts, manual back-and-forth quote consultations, and unorganized order fulfillment.

NailExpress needed a digital storefront that combined the sensory storytelling of a luxury atelier with interactive sizing guidance, an accountless 1-tap checkout, and an automated merchant operations suite.

---

## 2. The Approach

Working across product design, UX writing, and design engineering:

* **Editorial Luxury Visual Direction:** Built a bespoke design system using warm terra cotta/rose gold palettes (`#7a403d`, `#eed8d6`), Cormorant Garamond editorial serif typography, and frosted glassmorphism to position the brand as a high-end atelier rather than a generic beauty shop.
* **Sensory Micro-Interactions:** Engineered interactive 3D card tilt physics, reverse-side quick sizing, and cursor-tracking magnifying loupes to replicate the physical experience of inspecting luxury nail art in person.
* **Reducing Pre-Purchase Anxiety:** Built a 3-step visual discovery quiz and transparent "What's In Your Box" packaging inspectability to reassure first-time buyers before they add to cart.
* **Bridging Web to WhatsApp:** Created a structured 5-step custom order studio with direct image uploads to Supabase storage, formatting bespoke orders into structured WhatsApp payloads.
* **Integrated Merchant Operations:** Built an admin control center with inventory tracking, order status pipelines, and one-click Gemini AI product copywriting.

---

## 3. Designed Specifically for NailExpress

### Product Discovery & Browsing
* **3D In-Feed Size Selector Cards:** Standard stores force shoppers to leave collection feeds and open product detail pages just to choose a size. NailExpress cards feature 3D tilt physics that flip on click to expose size chips (`S`, `M`, `L`) and an instant "Add to Cart" action directly within the feed.
* **Tactile Shape & Length Filter Bar:** Replaced dry dropdown menus with visual silhouette previews representing actual nail shapes (Almond, Coffin, Stiletto, Square, Oval) and length badges.
* **"Find Your Fit" Discovery Quiz:** A 3-step interactive recommendation modal translating aesthetic moods (*"Cozy Minimalist"*, *"Glam & Dramatic"*) and lifestyle preferences (*"Short & Practical"*) into instant catalog stock matches.

### Product Experience & Tactile Inspection
* **Magnifying Detail Loupe:** Interactive hover and touch-drag magnifying loupe allowing customers to inspect fine hand-painted art, gem settings, and cat-eye finishes before purchase.
* **Interactive Gift Box Inspection:** An interactive packaging showcase allowing users to inspect the complimentary prep kit (nail glue, buffer, alcohol wipe, cuticle stick) to eliminate uncertainty about application tools.
* **Real-Time Dynamic City Delivery Banner:** PDP banner fetching live admin delivery presets with real-time countdown clocks, clarifying dispatch expectations upfront.

### Custom Ordering
* **5-Step Bespoke Nail Studio:** Replaced unstructured social media DMs with a structured multi-step custom builder (Shape $\rightarrow$ Length $\rightarrow$ Finish $\rightarrow$ Reference Photo Upload $\rightarrow$ Instant Price Estimate) with direct Supabase storage persistence and WhatsApp handoff.

### Checkout & Customer Experience
* **Accountless 1-Tap Saved Address Switcher:** LocalStorage-persisted address manager with quick preset chips (`Home`, `Office`, `Gift / Recipient`) and Nigerian state/LGA dropdown mapping, delivering the speed of a returning customer profile without requiring passwords.
* **Branded Transactional Emails:** Responsive HTML email templates rendered via Resend with order breakdowns, customer delivery details, and merchant dispatch alerts.
* **Frictionless Photo Reviews:** Accountless review submission flow with client-side image compression and photo gallery modal.

---

## 4. Key UX Decisions

### 01. In-Feed Sizing Without Context Loss
* **Problem:** In press-on nail ecommerce, every purchase requires selecting a size (`S`, `M`, `L`). Forcing users into product detail pages just to select a size breaks browsing flow and leads to abandonment.
* **Decision:** Designed a dual-sided 3D card where clicking "Select Size" flips the card, lets the buyer choose their size, and adds it to the cart directly from the feed.
* **Why It Matters:** Preserves the user's scroll position and enables multi-item cart building in seconds.
* **Implementation:** Built in `HandmadeProductCard.js` using CSS 3D transforms (`rotateY`), Framer Motion, and mouse coordinate tilt math.

### 02. Resolving Kit Completeness Anxiety
* **Problem:** First-time press-on shoppers worry they will receive bare nails without adhesive or application tools, causing them to hesitate at checkout.
* **Decision:** Built an interactive "What's In Your Box" magnifying loupe and highlighted prep kit contents across all PDP product accordions.
* **Why It Matters:** Visually confirms that every set arrives as a complete, ready-to-wear kit with glue, buffer, and prep tools included.
* **Implementation:** Built in `GiftBoxBanner.js` and `ProductClient.js` with dynamic CSS background-position calculations.

### 03. Structuring the Bespoke Custom Order Pipeline
* **Problem:** Custom nail inquiries on social media often lack reference photos, nail sizes, or clear finish specifications, resulting in long back-and-forth chats.
* **Decision:** Designed a 5-step custom nail studio funnel that collects shape, length, design style, and inspiration photos before generating an automated WhatsApp handoff.
* **Why It Matters:** Transforms an unstructured messaging exchange into a structured order with upfront price expectations.
* **Implementation:** Built in `src/app/custom-order/page.js` with direct image uploads to Supabase storage buckets.

### 04. Accountless 1-Tap Address Switcher
* **Problem:** Requiring account creation and password entry causes major checkout drop-offs on mobile devices.
* **Decision:** Designed a client-side address book with preset chips (`Home`, `Office`, `Gift / Recipient`) that stores delivery details locally on the user's device.
* **Why It Matters:** Returning shoppers enjoy 1-tap checkout convenience without the friction of account registration.
* **Implementation:** Custom React hook `useSavedAddresses.js` integrated into `src/app/checkout/page.js`.

### 05. Transparent Regional Delivery Expectations
* **Problem:** Ambiguous delivery timelines lead to checkout abandonment and customer support inquiries.
* **Decision:** Integrated a live PDP countdown widget driven by real-time admin presets (e.g. Next-Day Lagos vs 2-3 Day Interstate).
* **Why It Matters:** Sets clear expectations regarding dispatch times before the buyer enters checkout.
* **Implementation:** Fetched from `/api/settings` and rendered with real-time countdown clocks in `ProductClient.js`.

### 06. Frictionless Photo Reviews for Social Proof
* **Problem:** High-friction login barriers prevent customers from submitting photo reviews, depriving the store of social proof.
* **Decision:** Implemented an accountless review modal with client-side image compression and direct cloud photo upload.
* **Why It Matters:** Builds social proof by showing real customer photos directly on product pages.
* **Implementation:** Built in `ProductReviews.js` with client-side compression and Supabase storage upload.

### 07. Flippable Sold-Out & Restock Waitlist Capture
* **Problem:** Traditional ecommerce cards disable "Add to Cart" when items run out, presenting dead ends that bounce interested shoppers.
* **Decision:** Re-architected out-of-stock product cards to flip upon clicking "Notify Me", seamlessly embedding an inline email capture form with zero navigation or modal disruption.
* **Why It Matters:** Turns out-of-stock friction into high-intent lead generation, automatically queuing customers in Supabase for one-click admin restock broadcast notifications.
* **Implementation:** Built into `HandmadeProductCard.js` and `EmailCapture.js`, routing through `/api/newsletter` into the Supabase `subscribers` database.

### 08. Complete Lifecycle Transactional Email Architecture
* **Problem:** Post-purchase anxiety and custom order opacity are high when shopping with independent luxury merchants.
* **Decision:** Designed and engineered a complete 8+ template transactional email lifecycle—spanning instant buyer confirmations, automated custom nail studio quote acknowledgements, shipping updates, cancellation safeguards, abandoned checkout recovery, and automated restock alerts.
* **Why It Matters:** Provides end-to-end transparency, keeps buyers informed at every stage, and automates back-office merchant alerts.
* **Implementation:** Handcrafted responsive HTML templates rendered via Resend API (`src/lib/email.js`, `/api/newsletter`, `/api/admin/subscribers`).

---

## 5. The System Behind the Experience

* **Frontend Architecture:** Next.js 16 App Router using React Server Components (RSC) for fast initial loads and SEO crawlability, with client boundaries for animations and interactive widgets.
* **Database & Storage:** Supabase PostgreSQL manages relational data for products, categories, orders, reviews, and custom order quotes with Row-Level Security.
* **Payment Processing:** Paystack inline checkout modal supports Card, Bank Transfer, and USSD in NGN, backed by server-side verification endpoints.
* **Transactional Email Engine:** Resend API integration with custom HTML email templates for order confirmations, custom order workflows, abandoned carts, restock alerts, and merchant alerts.
* **PWA Standalone Mode:** Web App Manifest, offline caching service worker, and multi-device iOS splash screen matrices deliver a native app experience.
* **SEO & Discoverability:** Automatic Edge XML sitemap, `robots.txt`, and Schema.org JSON-LD structured data for `Product`, `Offer`, and `AggregateRating`.

---

## 6. The Admin Experience

The back-office suite (`src/app/admin`) was designed to streamline daily operations for the brand owner:

* **Product & Inventory Management:** Full CRUD interface for pricing, compare-at discounts, stock counts, and shape/length tags.
* **One-Click Gemini AI Copywriter:** Integrated Google Gemini endpoint (`gemini-3.5-flash`) that analyzes uploaded nail photos to generate elegant, two-word luxury titles and concise SEO descriptions.
* **Custom Order Pipeline:** Centralized dashboard for managing incoming bespoke requests, inspecting uploaded reference images, and tracking customer quotes.
* **Subscribers & Restock Management:** View restock requests per product and broadcast automated "Back in Stock" notification emails directly to waiting customers.
* **Delivery Rate Controls:** Real-time configuration of regional delivery fees and dispatch timeline banners without modifying code.

---

## 7. What I Built

```
DESIGNED
├── Editorial Warm Luxury Design System (Typography, Colors, Spacing)
├── 3D Flippable Product Cards with In-Feed Sizing Selectors & "Notify Me" Flip State
├── "Find Your Fit" 3-Step Interactive Discovery Quiz
├── 5-Step Custom Nail Studio Builder with Cloud Photo Uploads
├── Accountless 1-Tap Saved Address Book (`Home`, `Office`, `Gift`)
├── High-Definition Loupe & Packaging Inspection Micro-interactions
└── Full Lifecycle HTML Transactional Email Suite (Orders, Custom Sets, Abandoned Carts, Restock Alerts)

ENGINEERED
├── Next.js 16 (App Router) & React 19 Frontend Architecture
├── Vanilla CSS Modules & Framer Motion Animation Physics
├── Supabase PostgreSQL Database, Storage Buckets & RLS Policies
├── Paystack Payment Gateway Integration & Webhook Handling
├── Resend Transactional Email Infrastructure (Customer & Admin Workflows)
├── Gemini AI Multimodal Product Copywriting API
├── Admin Operations Dashboard (Catalog, Orders, Custom Funnel, Restock Hub, Rates)
└── PWA Manifest, Service Worker Caching & Dynamic SEO Sitemap
```

---

## 8. Live Product

Explore the finished NailExpress experience:

[VIEW LIVE SITE](https://www.nailexpress.ng)

---

## 9. Verification Notes

1. **Definitely Verified from Codebase:**
   * 3D card tilt and flip mechanics (`HandmadeProductCard.js`).
   * 3-step recommendation quiz (`FindYourFitQuiz.js`).
   * 5-step custom order studio with image upload (`custom-order/page.js`).
   * 1-tap address switcher with localStorage persistence (`useSavedAddresses.js`).
   * Texture and packaging loupes (`ProductClient.js`, `GiftBoxBanner.js`).
   * Dynamic delivery presets and countdown timers (`/api/settings`).
   * Paystack inline payment flow and server verification (`checkout/page.js`, `/api/orders/confirm`).
   * Resend HTML transactional email dispatch (`email.js`).
   * Gemini AI product copy generation (`/api/admin/generate-description`).
   * Admin dashboard routes (`src/app/admin/(dashboard)`).
   * PWA manifest, service worker, and dynamic JSON-LD / sitemap (`manifest.json`, `product/[slug]/page.js`, `sitemap.js`).

2. **Needs Live Deployment Confirmation:**
   * Active `GEMINI_API_KEY` in production environment variables.
   * Active `RESEND_API_KEY` and verified custom domain records.

3. **Public Positioning Guidance:**
   * Position as **Product Designer · UX Writer · Design Engineer**.
   * Avoid unverified conversion metrics (e.g. "increased checkout by 40%") unless supported by live Paystack or analytics data.
