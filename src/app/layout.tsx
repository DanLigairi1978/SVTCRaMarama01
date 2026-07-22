import type { Metadata } from 'next';
import { Montserrat, Dancing_Script } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

// Montserrat carries all structural type (body, UI, headlines); Dancing Script is
// the decorative cursive used only for eyebrow/kicker lines above section titles.
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SVTC Website | Soqosoqo Vakamarama iTaukei Cakaudrove',
  description: 'Official website for the Soqosoqo Vakamarama iTaukei Cakaudrove (SVTC). Women Stand Up and Shine.',
  keywords: ['SVTC', 'Cakaudrove', 'Fiji', 'Women Empowerment', 'NGO', 'Ra Marama', 'SVTC Website'],
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", montserrat.variable, dancingScript.variable)}>
      <body className={cn(
        "min-h-screen bg-background font-body antialiased flex flex-col"
      )}>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
