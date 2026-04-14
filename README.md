# Ramara / SVTC Website

A Next.js 15 website for the Solwara Village Tourism Cooperative (SVTC) — built with TypeScript, Tailwind CSS, Firebase, and Radix UI.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables are documented in `.env.example`.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server (Turbopack, port 9002) |
| `npm run build` | Build the static export to `/out` |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Deployment

This project is configured for **static export** (`output: "export"`) and hosted via **Firebase Hosting**.

```bash
# 1. Build the static site
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) – React framework with static export
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling
- [Firebase](https://firebase.google.com/) – Hosting + Firestore + Auth
- [Radix UI](https://www.radix-ui.com/) – Accessible component primitives
- [Nodemailer](https://nodemailer.com/) – Email via SMTP
