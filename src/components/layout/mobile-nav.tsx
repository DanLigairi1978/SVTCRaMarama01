
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import type { NavLink } from "@/lib/types";

interface MobileNavProps {
  navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-ivory-100 hover:text-ochre-200">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-charcoal-900 border-charcoal-700">
        <SheetHeader>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
