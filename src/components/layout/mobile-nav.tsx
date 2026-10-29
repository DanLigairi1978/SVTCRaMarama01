"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { useAuth } from "@/context/AuthContext";
import type { NavLink } from "@/lib/types";

interface MobileNavProps {
  navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();

  const handleAuthAction = async () => {
    setIsOpen(false);
    if (!user) {
      await signInWithGoogle();
    } else {
      await logout();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-ivory-100 hover:text-ochre-200">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-charcoal-900 border-charcoal-700 flex flex-col justify-between">
        <div>
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SheetDescription className="sr-only">
              Links to the main sections of the SVTC website.
            </SheetDescription>
            <Logo />
          </SheetHeader>
          <div className="mt-8 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-label text-lg font-semibold uppercase tracking-wide text-ivory-100 hover:text-ochre-200"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="font-label text-lg font-semibold uppercase tracking-wide text-ochre-200 hover:text-ochre-100"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-charcoal-700 flex flex-col gap-3">
          <Button
            onClick={handleAuthAction}
            variant={!user ? "inverse" : "ghost"}
            className={!user ? "w-full" : "w-full text-ivory-100 hover:text-ochre-200"}
          >
            {!user ? "Sign In with Google" : "Sign Out"}
          </Button>

          <Button asChild className="w-full">
            <Link href="/involved" onClick={() => setIsOpen(false)}>
              <HeartHandshake className="mr-1.5 h-4 w-4" /> Support Us
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
