# SVTC Website — Monthly Hosting & Service Costs

> **Last Updated:** 19 February 2026  
> **Project:** svtc-website  
> **Plan:** Firebase Spark (Free Tier)

---

## Summary

**Your current estimated monthly cost: $0.00 (Free)**

The SVTC website is well within Firebase's free tier limits. Unless traffic grows dramatically (10,000+ daily visitors) or the Firestore database grows very large, you will not incur any charges.

---

## Service Breakdown

### 1. Firebase Hosting (Website Files)

| Resource | Free Tier Limit | SVTC Usage (est.) | Status |
|----------|----------------|--------------------|--------|
| Storage | 10 GB | ~5 MB | ✅ Free |
| Data Transfer | 360 MB/day | ~50 MB/day | ✅ Free |
| Custom Domain SSL | Included | ✅ | ✅ Free |

> Your static site is only ~5 MB total (HTML, CSS, JS, images). You'd need **2,000x** more content to hit the storage limit. Data transfer is also well within the 360 MB/day cap — that's roughly **7,000+ page views per day** before you'd approach the limit.

**If you exceed free limits:**
- Storage: $0.026/GB/month
- Transfer: $0.15/GB

---

### 2. Cloud Firestore (News Database)

| Resource | Free Tier Limit | SVTC Usage (est.) | Status |
|----------|----------------|--------------------|--------|
| Document Reads | 50,000/day | ~100–500/day | ✅ Free |
| Document Writes | 20,000/day | ~1–5/day | ✅ Free |
| Document Deletes | 20,000/day | ~0–2/day | ✅ Free |
| Stored Data | 1 GiB | < 1 MB | ✅ Free |

> Your "news" collection will have perhaps 10–50 documents at any time. Each homepage visit reads a handful of documents. You would need **100,000+ daily visitors** to approach the read limit.

**If you exceed free limits:**
- Reads: $0.06 per 100,000
- Writes: $0.18 per 100,000
- Storage: $0.18/GiB/month

---

### 3. Firebase Authentication (Google Sign-In)

| Resource | Free Tier Limit | SVTC Usage (est.) | Status |
|----------|----------------|--------------------|--------|
| Monthly Active Users | Unlimited | 3 admins | ✅ Free |
| Phone Auth (SMS) | N/A | Not used | ✅ Free |

> Google Sign-In (Email/Password, Google Provider) is **always free** with no limits on monthly active users.

---

### 4. Google Cloud Storage (Images)

| Resource | Free Tier Limit | SVTC Usage (est.) | Status |
|----------|----------------|--------------------|--------|
| Storage | 5 GB | ~2.5 MB | ✅ Free |
| Downloads | 1 GB/day | ~50 MB/day | ✅ Free |

> Images are now served from Firebase Hosting (bundled in the static export), so GCS is not actively used. If you re-enable GCS in the future, the free tier is 5 GB storage + 1 GB/day download.

---

## What Could Trigger Charges?

| Scenario | Risk Level | Estimated Cost |
|----------|-----------|---------------|
| Normal operation (< 1,000 visitors/day) | 🟢 None | $0 |
| Moderate traffic (1,000–5,000/day) | 🟢 None | $0 |
| Viral spike (10,000+/day for a week) | 🟡 Low | $1–5 |
| Adding large video files to hosting | 🟡 Low | $0–2/month |
| DDoS attack / bot traffic | 🔴 Medium | Unpredictable |

---

## How to Prevent Unexpected Bills

1. **Set a Budget Alert**  
   Go to [Google Cloud Billing → Budgets](https://console.cloud.google.com/billing/budgets)  
   → Create a budget of **$5/month** → Set alerts at 50%, 90%, 100%  
   You'll get an email warning before any meaningful charge.

2. **Monitor Usage**  
   Check the [Firebase Console → Usage & Billing](https://console.firebase.google.com/project/svtc-website/usage)  
   tab monthly to see if you're approaching any limits.

3. **Keep Billing Active**  
   ⚠️ If your billing account is suspended or deactivated, ALL services stop — including the website and database. This is what caused the image 404 errors previously.

4. **Stay on the Spark Plan**  
   The Spark (free) plan has usage caps that prevent runaway charges. You only get charged if you upgrade to the Blaze (pay-as-you-go) plan **and** exceed free tier limits.

---

## Billing Plan Comparison

| Feature | Spark (Free) | Blaze (Pay as you go) |
|---------|-------------|----------------------|
| Monthly Cost | $0 | $0 + usage beyond free tier |
| Hosting Storage | 10 GB | 10 GB free, then $0.026/GB |
| Hosting Transfer | 360 MB/day | 360 MB/day free, then $0.15/GB |
| Firestore Reads | 50K/day | 50K/day free, then $0.06/100K |
| Firestore Storage | 1 GiB | 1 GiB free, then $0.18/GiB |
| Auth Users | Unlimited | Unlimited |
| Budget Alerts | ❌ | ✅ |

> **Recommendation:** If SVTC is currently on the **Blaze plan**, set a $5 budget alert. If on **Spark**, you cannot be charged at all (services simply stop if you hit limits).

---

## Bottom Line

For a small NGO website like SVTC with a handful of admin users and modest traffic, Firebase's free tier is more than sufficient. **You should not expect any monthly fees.** Just keep the billing account active and set a budget alert as a safety net.
