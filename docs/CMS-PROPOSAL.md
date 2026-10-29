# SVTC Custom CMS — Proposed Architecture & Build Plan

Written against the actual codebase (Next.js 15 static export, Firebase Hosting, Firestore, Google
auth with a nine-email allowlist, shadcn/Tailwind with centralised CSS-variable tokens). Every
recommendation below builds on what already exists rather than replacing it.

---

## 0. The one decision that shapes everything

Your requirements — admin-created pages, instant theme overhauls, instant contact rewiring — all mean
**content must change without a developer redeploying**. Today the site is a static export: new pages
literally cannot exist until someone rebuilds. There are two honest ways out:

| | **A. Firebase App Hosting (SSR)** — recommended | B. Rebuild-on-publish (stay static) |
|---|---|---|
| How | Move hosting to Firebase App Hosting, drop `output: "export"`, render pages from Firestore on request (with ISR caching) | Keep static export; a GitHub Action rebuilds + redeploys when the admin hits Publish |
| New pages live | Instantly | ~3–5 min after publish |
| SEO | Full — content in initial HTML | Full — but only after rebuild |
| Complexity | Moderate (one-time migration) | Higher long-term (CI plumbing, token mgmt, failure modes admins can't debug) |
| Cost | ~US$0–10/mo at SVTC's traffic (scales to zero) | ~$0 |

**Recommendation: A.** "Instant" was in the requirements three times; B fails it. App Hosting is
first-class for Next.js 15, and at NGO traffic levels the Cloud Run instance will idle near zero cost.
Everything below assumes A (but degrades gracefully to B if cost vetoes it).

---

## 1. Content & Page Management

### Data model (Firestore)

```
pages/{slug}            → title, seo, status (draft|published), nav placement, ordered sectionIds
pages/{slug}/sections/* → { type, order, props }        ← the actual content
sectionTemplates (code) → the fixed library of section types
themes/{id}             → design tokens (see §2)
settings/comms          → contact routing (see §3)
roles/{uid}             → admin | editor                 (see §5)
```

### Sections, not free-form HTML

The admin composes pages from a **library of section templates** — the ones the site already uses,
extracted into schema-driven components:

`Hero` · `PageHeader` · `TextWithImage` · `CardGrid` · `StatBand` · `NumberedList` (strategic
priorities) · `IconList` (values) · `CTABand` · `PartnerStrip` · `AccordionList` (calendar) ·
`FormSection` · `NewsFeed` · `StoryFeed`

Each template declares its fields with **zod schemas** (already a dependency); the dashboard
auto-generates the edit form from the schema (react-hook-form — also already a dependency). The admin
picks a template, fills the fields, drags to reorder, previews, publishes.

**Why this is the right call:** it's what makes "inherited styling" *enforceable* rather than
aspirational. Admins never touch markup or classes — they supply words, images, and choices from
enums. Every section renders through the same components the designers control, so a new page is
incapable of going off-brand. A free-form rich-text page builder would satisfy the requirement on
paper and destroy the design system in a month.

### Migration

The seven existing pages get seeded into this model by a one-time script (their copy is finite and
already inventoried in the audit). The public site then renders **all** pages — existing and
admin-created — through one dynamic route (`app/[...slug]/page.tsx`) reading Firestore with ISR
caching. Visitors see zero visual change on day one.

### Rich text

Body paragraphs use a constrained rich-text editor (**Tiptap**) limited to: bold, italic, links,
lists. No colours, no font pickers, no arbitrary embeds — presentation stays in the theme layer.

---

## 2. Design & Theming Engine

This is where the existing codebase pays off most: **all styling already routes through CSS custom
properties** (the audit found only 2 distinct hardcoded hex values in the entire source).

### Theme documents

A `themes/{id}` doc holds the full token set — palette (as HSL triplets, matching `globals.css`),
semantic role mappings (primary/accent/background/…), font pairing, type scale, radius scale, shadow
tiers. The public layout reads the **active** theme server-side and emits it as a `:root { --… }`
style block, so a theme change restyles the whole site instantly — no rebuild, no code.

### Dashboard controls

- **Colours:** palette editor with live preview; semantic roles pick from the palette. Automatic
  WCAG contrast checking on every text/background pair, warning before publish.
- **Fonts:** curated Google Fonts allowlist (loaded via `next/font`), separate headline / body /
  script slots — mirroring the Montserrat + Dancing Script structure now in place.
- **Text styles:** type-scale editor (per-level size/weight/tracking) mapped onto the existing
  `--fs-*` / weight tokens.
- **Versioned + revertible:** every publish snapshots the previous theme; one-click rollback.

### Claude Design System integration

The current design came from a Claude Design project whose `tokens/*.css` files are structured CSS
custom properties — the same shape as the theme doc. The CMS gets an **importer**:

1. Admin uploads the design system's token files (or pastes the export) into the dashboard.
2. The importer parses only recognised custom properties (`--color-*`, `--fs-*`, `--radius-*`,
   `--shadow-*`, font imports) and maps them onto a new **draft theme**.
3. Side-by-side preview against the live theme → publish or discard.

Hard boundary, enforced by construction: the importer can only ever produce a theme document.
Content, layout, structure, and code are unreachable from this path — satisfying the
"design/presentation changes only" restriction structurally, not by policy.

---

## 3. Dynamic Communications Routing

Replace the current hardcoded Google Apps Script endpoint with:

- **A Cloud Function** (`submitContactForm`) that validates (same zod schema), writes every
  submission to a `messages` collection (permanent, searchable archive in the dashboard), and emails
  it out via **Resend** (or SMTP/nodemailer — the dependency finally earns its keep, server-side
  where it belongs).
- **Routing config in `settings/comms`:** destination inbox(es) per form, editable in the dashboard.
  Changing where messages go = editing a field. Instant, no deploy. Supports multiple recipients and
  a per-form reply-to.
- **Abuse protection:** Firebase App Check + honeypot field + per-IP rate limiting in the Function —
  necessary the moment a send-email endpoint is public.

The dashboard gets a **Messages inbox view** as a free by-product of archiving to Firestore, so a
missed email never means a lost message.

---

## 4. Advanced Telemetry & Reporting

The honest engineering position: at SVTC's traffic volume, a first-party pipeline on Firestore is
genuinely the right size — no external analytics vendor, no cookie banners, full ownership.

### Collection (client)

A tiny (<2 KB) first-party script on every public page, anonymous session ID (random, per-visit,
no cookies, no PII):

- `page_view` — route + referrer
- `dwell` — IntersectionObserver marks which *section* is on screen; a 15-second heartbeat
  attributes time to it (giving true per-section dwell, not just per-page)
- `interact` — any element tagged `data-track="…"` reports clicks (CTAs, nav, partner links);
  section templates ship pre-tagged
- `funnel` — named steps for the donor path (see caveat below)

Events batch via `navigator.sendBeacon` to an ingest Function.

### Storage & aggregation

Raw events land in a short-retention collection; a **scheduled rollup Function** aggregates them into
pre-computed time buckets — `stats_minute`, `stats_hour`, `stats_day`, `stats_month` — holding visitor
counts, per-section dwell totals, and per-element interaction counts. Dashboards read only the small
rollup docs, which is what keeps Firestore costs near zero and the graphs fast. Minute-level data
retained ~48h, hourly ~90 days, daily/monthly forever.

### Dashboard & reports

- **Live view:** "visitors right now" + interactive multi-resolution graph (minute → year), built
  with **Recharts — already a dependency**.
- **Brush-to-report:** admin drags a timeframe on the graph → instant report: average/total traffic,
  per-section dwell table, interaction counts per tracked element, donor-funnel step conversion —
  viewable in-dashboard, exportable CSV/PDF.

### One flag I owe you

The requirements name a **donor page and payment portal — neither exists on the site today** (the
donate CTA routes to the contact page). The funnel instrumentation will be built and ready, but it
can only track a flow that exists. If payments go through an external provider (M-PAiSA, Stripe,
bank), we track up to the handoff click plus a thank-you-page return beacon; full in-portal
behaviour requires the portal to be part of the site. Worth deciding alongside Phase 4.

---

## 5. Cross-cutting: security & roles (do this first)

1. **Rotate and remove the client-exposed GitHub token** (`NEXT_PUBLIC_GITHUB_IMAGES_TOKEN` — in the
   public bundle today; anyone can extract it). Image uploads move to **Firebase Storage** with
   Storage rules, served via CDN. Story photos migrate over.
2. **Replace the two hardcoded admin email lists** (AuthContext + firestore.rules) with a
   `roles/{uid}` collection + **custom auth claims**, managed from a dashboard "Team" page. This is
   what makes "me or any admin I choose" real: you grant/revoke admins yourself, no code edit, no
   deploy. Roles: `admin` (everything) and `editor` (content only, no theme/comms/team) — cheap to
   add now, painful later.

---

## 6. Phased build plan

| Phase | Scope | Effort |
|---|---|---|
| **0. Foundations** | Token rotation, Storage migration, roles + custom claims, App Hosting migration, dynamic `[...slug]` route | ~1 week |
| **1. Content engine** | Section template library, zod-driven editors, page composer, seed the 7 pages, draft/preview/publish | ~2 weeks |
| **2. Theming** | Theme docs + live injection, palette/font/type editors, contrast guard, versioning, **Claude DS importer** | ~1 week |
| **3. Communications** | Contact Function + Resend, routing settings UI, messages inbox, App Check | ~2–3 days |
| **4. Telemetry** | Beacon, ingest, rollups, live dashboard, brush-to-report, donor funnel hooks | ~1.5–2 weeks |

**Total: ~6 working weeks** for the full spec. Each phase ships independently and the site stays live
throughout — Phase 0 alone removes a real security exposure even if nothing else proceeds.

## 7. Running costs (monthly, at current traffic)

Firestore + Functions + Storage within or near free tier; App Hosting ~US$0–10; Resend free tier
(3k emails/mo). Realistic ceiling: **under ~US$15/month**, most months near zero. (Consistent with
the constraints in `HOSTING_COSTS.md`.)

## 8. What I deliberately did *not* propose

- **A third-party headless CMS** (Sanity/Contentful/Payload): genuinely good tools, but they'd
  bolt a second auth system, second dashboard, and per-seat pricing onto a site that already has
  auth, a dashboard shell, and a working Firestore content pattern. The custom route is *less*
  total machinery here, and the Claude-DS import requirement is bespoke either way.
- **Free-form page building** (drag-anything, edit-any-style): it directly contradicts the
  inherited-styling requirement. Constraint is the feature.
- **Google Analytics:** section-level dwell and brush-to-report as specced are better served
  first-party, and it keeps the site cookie-banner-free.
