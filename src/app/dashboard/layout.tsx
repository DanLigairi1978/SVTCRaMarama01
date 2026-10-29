"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, AlertCircle } from "lucide-react";

const dashboardNav = [
  { href: "/dashboard", label: "News" },
  { href: "/dashboard/stories", label: "Stories" },
  { href: "/dashboard/staff", label: "Staff" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin, loading, signInWithGoogle, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-md py-24 text-center space-y-6">
        <div className="rounded-full bg-secondary/80 w-16 h-16 mx-auto flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-2xl font-bold">Admin Sign In Required</h1>
          <p className="font-body text-sm text-muted-foreground">
            You must be signed in with an authorized SVTC administrator account to access the dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={signInWithGoogle} className="w-full">
            Sign In with Google
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container max-w-md py-24 text-center space-y-6">
        <div className="rounded-full bg-destructive/10 w-16 h-16 mx-auto flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-2xl font-bold">Unauthorized Account</h1>
          <p className="font-body text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{user.email}</span>. This account does not have administrator privileges.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={async () => {
              await logout();
              await signInWithGoogle();
            }}
            className="w-full"
          >
            Switch to an Admin Account
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
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
