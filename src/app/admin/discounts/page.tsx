"use client";

import { useState } from "react";
import { Percent } from "lucide-react";

export default function DiscountsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [name, setName] = useState("");
  const [percent, setPercent] = useState("");
  const [skuPattern, setSkuPattern] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ applied: number } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey || !name || !percent) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ name, percent: Number(percent), skuPattern: skuPattern || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">Управление скидками</h1>
      <p className="mt-2 text-sm text-stone-500">
        Создайте правило скидки — цены обновятся автоматически для подходящих артикулов.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-sm bg-white p-6 shadow-sm">
        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500">Ключ администратора</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="mt-1 w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
            required
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500">Название акции</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Весенняя распродажа"
            className="mt-1 w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
            required
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500">Процент скидки</label>
          <input
            type="number"
            min={1}
            max={99}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            placeholder="10"
            className="mt-1 w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
            required
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500">Фильтр по SKU (необязательно)</label>
          <input
            type="text"
            value={skuPattern}
            onChange={(e) => setSkuPattern(e.target.value)}
            placeholder="MIL- (все артикулы Milano)"
            className="mt-1 w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {result && (
          <p className="text-sm text-green-600">Скидка применена к {result.applied} позициям</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-sm bg-charcoal px-6 py-3 text-sm uppercase tracking-widest text-cream hover:bg-gold disabled:opacity-50"
        >
          <Percent className="h-4 w-4" />
          {loading ? "Применение..." : "Применить скидку"}
        </button>
      </form>
    </div>
  );
}
