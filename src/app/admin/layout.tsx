import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="text-sm font-semibold text-charcoal">
            Admin · AtelierMebel
          </Link>
          <nav className="flex gap-4 text-xs uppercase tracking-widest text-stone-500">
            <Link href="/admin" className="hover:text-charcoal">Дашборд</Link>
            <Link href="/admin/import" className="hover:text-charcoal">Импорт цен</Link>
            <Link href="/admin/discounts" className="hover:text-charcoal">Скидки</Link>
            <Link href="/" className="hover:text-gold">На сайт →</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
