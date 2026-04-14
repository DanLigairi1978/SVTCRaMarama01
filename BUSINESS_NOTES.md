# SVTC Website — Business Notes

> **Prepared by:** Meridian Solutions (Fiji) Ltd  
> **Date:** 19 February 2026

---

## A) Pricing Recommendation (FJD$)

### Deliverable Breakdown

| Deliverable | Market Rate (FJD$) |
|-------------|-------------------|
| Project planning & creative direction | $500 – $800 |
| Custom website design (7 pages, responsive, premium aesthetics) | $2,000 – $3,500 |
| CMS / Admin Dashboard (news management with Firestore) | $800 – $1,500 |
| Firebase integration (Auth, Firestore, Hosting, deployment) | $500 – $1,000 |
| Contact form (Google Sheets integration) | $200 – $400 |
| Content entry & image sourcing | $300 – $500 |
| Testing, QA, deployment | $300 – $500 |

**Total recommended range: FJD $4,500 – $8,000**

### Market Context

- A basic WordPress site in Fiji typically goes for **$2,000–$4,000 FJD**
- This site is custom-built with a CMS dashboard, live database, and premium design — it's worth more than a template site
- Ongoing maintenance (updates, support) could be billed at **$100–$200 FJD/month**

### Recommended NGO Rate for SVTC

Since SVTC is a non-profit, a "community rate" of around **FJD $4,000–$5,000** for the build, plus **$100–$150/month** for ongoing support is a fair middle ground. The monthly fee covers hosting management, content updates, and technical support — giving them peace of mind.

---

## B) Handover & Hosting Ownership

### Recommended Approach: Their Account, Your Access

Create a **new Firebase project under SVTC's Google account** (`svtc2005@gmail.com`), but add yourself as an **Editor/Owner** so you can manage deployments and support.

### Comparison of Approaches

| Approach | Pros | Cons |
|----------|------|------|
| **Their account, your access** ✅ | They own the asset, clean handover, they pay any future costs directly, no disputes over ownership | You need them to grant you access initially |
| **Your account only** | Full control, easy for you | They're locked in to you forever, messy if relationship changes, billing is on you |
| **Their account only** | Clean separation | You can't push updates or fix issues without their credentials |

### Handover Steps

1. **SVTC creates a Firebase project** under `svtc2005@gmail.com`
2. **They add you** as a project **Editor** in Firebase Console → Settings → Users & Permissions
3. You **deploy the site** to their new project (just change `.firebaserc` to point to their project ID)
4. They **register their custom domain** (e.g. `svtc.org.fj`) in Firebase Hosting → Custom Domain
5. You keep a copy of the source code on your machine for maintenance
6. Update the `ADMIN_EMAILS` list in `AuthContext.tsx` to include `svtc2005@gmail.com`

### Key Business Principles

- **You retain the source code** — they get the deployed site, not the codebase. If they want changes, they come to you (ongoing revenue)
- **You stay as a project collaborator** — you can deploy updates, fix bugs, and manage the dashboard without needing their password
- **They own the infra** — no liability on you for billing, data, or compliance
- **Clean IP boundary** — "I built this, you own the hosting, I maintain it under contract"

### Handover Agreement Essentials

- Source code remains property of Meridian Solutions (Fiji) Ltd
- SVTC gets an unlimited, non-exclusive license to use the deployed website
- Ongoing maintenance at agreed FJD$/month covers updates, hosting management, and content changes
- Emergency support response within 24–48 hours
- If the maintenance agreement ends, source code handover terms to be negotiated separately

---

**Bottom line:** Let them own the house, you keep the keys to maintain it. Best of both worlds.
