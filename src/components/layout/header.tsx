
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

// Routes that open on a full-bleed photo hero — header floats transparent over it.
const HERO_ROUTES = ["/", "/about", "/work", "/involved", "/calendar"];

export function Header() {
  const pathname = usePathname();
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const isHeroRoute = HERO_ROUTES.includes(pathname);

  return (
    <header
      className={cn(
        "z-50 w-full",
        isHeroRoute
          ? "absolute top-0 left-0 right-0 bg-gradient-to-b from-charcoal-900/70 to-transparent"
          : "sticky top-0 bg-charcoal-900"
      )}
    >
      <div className="container flex h-20 items-center">
        <Logo />
        <nav className="hidden md:flex md:ml-10 md:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-label text-xs font-semibold uppercase tracking-wide border-b-2 pb-1 transition-colors",
                pathname === link.href
                  ? "text-ochre-200 border-ochre-200"
                  : "text-ivory-100 border-transparent hover:text-ochre-200"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/dashboard"
              className={cn(
                "font-label text-xs font-semibold uppercase tracking-wide border-b-2 pb-1 transition-colors",
                pathname === "/dashboard"
                  ? "text-ochre-200 border-ochre-200"
                  : "text-ivory-100 border-transparent hover:text-ochre-200"
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

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Button onClick={signInWithGoogle} variant="inverse" size="sm">
                Sign In
              </Button>
            ) : (
              <Button onClick={logout} variant="ghost" size="sm" className="text-ivory-100 hover:text-ochre-200">
                Sign Out
              </Button>
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
