"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const dashboardNav = [
  { href: "/dashboard", label: "News" },
  { href: "/dashboard/stories", label: "Stories" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && (!user || !isAdmin)) {
      router.replace("/");
    }
  }, [mounted, user, isAdmin, loading, router]);

  if (!mounted || loading || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="font-body text-muted-foreground">Manage website content and updates.</p>
        <nav className="flex gap-6 mt-6 border-b border-border">
          {dashboardNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-label text-xs font-semibold uppercase tracking-wide border-b-2 pb-3 transition-colors",
                pathname === item.href
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
