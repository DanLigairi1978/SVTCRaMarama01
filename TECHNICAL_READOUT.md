# Technical Readout: SVTC Ramara Website

## User Query & Objective

> "note that there is a copy of this site currently running/deployed in Firebase) and is running well... I just want everything to tie into firebase and run through GIT so I can make changes.. as it stands.. an exact copy of this site is running on Firebase.. so I want to be able to make changes here in AG, send to Github and deploy whilst maintaining its auth link and features from Firebase and linked TO firebase like we have been doing with the other projects so far. So compile a tech read-out in an MD and also include this query I have above."

### Workflow Strategy (AG -> GitHub -> Firebase)

The workflow you've described is the industry standard for modern web development. Because the production site is already running on Firebase, updating the code here locally (or in AG) will **not** break the existing authentication hookups, database records, or hosting settings, as long as the environment variables point to the correct Firebase project.

Here is the flow:
1. **Develop Local/AG:** You make changes to the UI, components, or logic here in AG. 
2. **Commit & Push to GitHub:** We commit those changes and push to `https://github.com/DanLigairi1978/SVTCRaMarama01`. This tracks the history of all changes securely.
3. **Deploy to Firebase:** When a change is ready for production, we build the static version of the site (`npm run build`) and deploy it directly to the active Firebase project (`firebase deploy --only hosting`). 

Because your `NEXT_PUBLIC_FIREBASE_API_KEY` and `NEXT_PUBLIC_FIREBASE_APP_ID` (stored securely in `.env.local`) match the production Firebase project, the local/AG version and the deployed version are talking to the **exact same database and authentication backend**.

---

## Technical Architecture

### Core Tech Stack
* **Framework:** Next.js 15 (App Router).
* **Language:** TypeScript.
* **Styling:** Tailwind CSS + custom Radix UI components (accessible primitives for dialogs, tabs, accordions, etc.).
* **Icons:** Lucide React.
* **Forms & Validation:** React Hook Form + Zod.
* **Backend / BaaS:** Firebase (Authentication, Firestore, Hosting).

### Next.js Configuration (`next.config.ts`)
The project is configured for a **Static Export**:
```typescript
output: "export",
images: { unoptimized: true, ... }
```
This is a critical distinction. It means the Next.js app does not run a Node.js server in production. Instead, `npm run build` generates pure HTML/CSS/JS files into an `out/` directory. Firebase Hosting then serves these static files. All dynamic functionality (like Authentication and Database calls) happens client-side via the Firebase Web SDK.

### Firebase Integration
* **Project ID:** `svtc-website`
* **Initialization (`src/lib/firebase.ts`):** Initializes the Firebase app globally using environment variables. It exports `app`, `auth`, and `db` instances to be used across the application.
* **Authentication (`src/context/AuthContext.tsx`):** Provides a global React Context for user state.
  * Uses `signInWithPopup` via `GoogleAuthProvider`.
  * Implements an Admin check using a hardcoded `ADMIN_EMAILS` array (`svtc05@gmail.com`, `bulutani@yahoo.com`, `ligarius22@gmail.com`). Only users with these emails evaluate to `isAdmin = true`, allowing them specialized access (like the Dashboard).
* **Hosting (`firebase.json`):** Configured to treat the `out/` directory as the public root (`"public": "out"`), perfectly aligning with Next.js's static export architecture.

### Directory Structure
* `src/app/`: Next.js App Router root. Contains all page routes:
  * `/`: Landing Page (`page.tsx`).
  * `/about`: About SVTC.
  * `/calendar`: Event Calendar.
  * `/contact`: Contact Forms.
  * `/dashboard`: Protected Admin Dashboard.
  * `/involved`: Get Involved routing.
  * `/work`: Our Work page.
* `src/components/`: Reusable UI elements.
  * `layout/`: Global structure (Header, Footer, Logo).
  * `ui/`: Primitives based on shadcn/ui + Radix (Buttons, Inputs, Dialogs).
* `src/context/`: Global state providers (`AuthContext.tsx`).
* `src/lib/`: Utilities, configurations, and dummy data (`actions.ts`, `firebase.ts`, `data.ts`, `calendar-data.ts`).
* `public/`: Static assets (images, fonts, favicons). Environment variable `.env.local` controls secrets and ensures they are not leaked via `.gitignore`.

### Deployment Commands
To deploy changes from AG to the live Firebase environment:
1. `npm run build` (This clears the old `out/` folder and generates a fresh static site).
2. `firebase deploy --only hosting` (This uploads the newly built `out/` folder to Firebase). 

*Note: Since you want this tied through GitHub, standard practice is to push code to GitHub manually after making changes, and then run the deployment command.*
