"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-stone-200 bg-charcoal text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-xl text-cream">ATELIER<span className="text-gold">MEBEL</span></p>
          <p className="mt-4 text-sm leading-relaxed text-stone-400">
            Премиальная мягкая мебель на заказ. Индивидуальные размеры, европейские материалы, 5 лет гарантии.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Каталог</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/catalog?category=divany" className="hover:text-cream">Диваны</Link></li>
            <li><Link href="/catalog?category=kresla" className="hover:text-cream">Кресла</Link></li>
            <li><Link href="/catalog?category=krovati" className="hover:text-cream">Кровати</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Контакты</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>+7 (495) 000-00-00</li>
            <li>info@ateliermebel.ru</li>
            <li>Москва, шоурум по записи</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-700 px-4 py-6 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} AtelierMebel. Все права защищены.
      </div>
    </footer>
  );
}
