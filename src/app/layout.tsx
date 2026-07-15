import type { Metadata } from 'next';
import { Archivo, Lora } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
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
    <html lang="en" className={cn("scroll-smooth", archivo.variable, lora.variable)}>
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
