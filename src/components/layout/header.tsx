
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/lib/types";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { HeartHandshake } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/work", label: "Our Work" },
  { href: "/calendar", label: "Calendar" },
  { href: "/involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="hidden md:flex md:ml-10 md:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="md:hidden">
            <MobileNav navLinks={navLinks} />
          </div>

          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <Button onClick={signInWithGoogle} variant="outline" size="sm">
                Sign In
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Optional: Show user name or avatar here */}
                <Button onClick={logout} variant="ghost" size="sm">
                  Sign Out
                </Button>
              </div>
            )}

            <Button asChild>
              <Link href="/involved">
                <HeartHandshake className="mr-2 h-4 w-4" /> Support Us
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
}
