
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
  { href: "/stories", label: "Stories" },
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
      <div className="mx-auto max-w-[1400px] w-full px-4 lg:px-6 xl:px-8 flex min-h-20 py-3 items-center">
        <Logo />
        <nav className="hidden lg:flex lg:ml-4 lg:space-x-2.5 xl:ml-10 xl:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-label text-[0.65rem] xl:text-xs font-semibold uppercase border-b-2 pb-1 whitespace-nowrap transition-colors",
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
                "font-label text-[0.65rem] xl:text-xs font-semibold uppercase border-b-2 pb-1 whitespace-nowrap transition-colors",
                pathname === "/dashboard"
                  ? "text-ochre-200 border-ochre-200"
                  : "text-ivory-100 border-transparent hover:text-ochre-200"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 xl:space-x-4">
          <div className="lg:hidden">
            <MobileNav navLinks={navLinks} />
          </div>

          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {!user ? (
              <Button onClick={signInWithGoogle} variant="inverse" size="sm">
                Sign In
              </Button>
            ) : (
              <Button onClick={logout} variant="ghost" size="sm" className="text-ivory-100 hover:text-ochre-200">
                Sign Out
              </Button>
            )}

            <Button asChild size="sm">
              <Link href="/involved">
                <HeartHandshake className="mr-1.5 h-4 w-4 hidden xl:inline" /> Support Us
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
}
