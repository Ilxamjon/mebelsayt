"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/price";
import { trackEvent } from "@/components/Analytics";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, comment, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка отправки");

      trackEvent("lead_submit", { total: totalPrice(), items: items.length });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки заявки");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-charcoal">Заявка отправлена</h1>
        <p className="mt-4 text-stone-600">
          Менеджер свяжется с вами в ближайшее время. Оплата на сайте не требуется.
        </p>
        <Link href="/catalog" className="mt-8 inline-block text-sm uppercase tracking-widest text-gold hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <h1 className="font-display text-3xl text-charcoal sm:text-4xl">Корзина</h1>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-stone-500">Корзина пуста</p>
          <Link href="/catalog" className="mt-4 inline-block text-sm uppercase tracking-widest text-gold hover:underline">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4 rounded-sm bg-white p-4 shadow-sm">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-stone-100">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.productSlug}`} className="font-medium text-charcoal hover:text-gold">
                      {item.productName}
                    </Link>
                    <p className="text-xs text-stone-400">
                      {item.sizeLabel} · {item.sku}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-200"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-200"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                      <button type="button" onClick={() => removeItem(item.variantId)} className="text-stone-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-sm bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm uppercase tracking-widest text-stone-500">Оформление заявки</h2>
            <p className="mt-2 text-xs text-stone-400">Без оплаты — менеджер перезвонит</p>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Ваше имя *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
              />
              <input
                type="tel"
                placeholder="Телефон *"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
              />
              <textarea
                placeholder="Комментарий"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
              />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
              <span className="text-sm text-stone-500">Итого</span>
              <span className="text-xl font-medium text-charcoal">{formatPrice(totalPrice())}</span>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-sm bg-charcoal py-4 text-sm uppercase tracking-widest text-cream transition-colors hover:bg-gold disabled:opacity-50"
            >
              {loading ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
