"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?category=divany", label: "Диваны" },
  { href: "/catalog?category=kresla", label: "Кресла" },
  { href: "/catalog?category=krovati", label: "Кровати" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCart((s) => s.totalItems());

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl tracking-wide text-charcoal sm:text-2xl">
          ATELIER<span className="text-gold">MEBEL</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-stone-600 transition-colors hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-charcoal transition-colors hover:border-gold hover:text-gold"
            aria-label="Корзина"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-charcoal md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-stone-200 bg-cream px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm uppercase tracking-widest text-stone-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
