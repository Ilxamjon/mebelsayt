"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react";

export default function ImportPage() {
  const [adminKey, setAdminKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ updated: number; notFound: number; total: number } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !adminKey) return;

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/import-prices", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка импорта");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">Импорт цен из Excel</h1>
      <p className="mt-2 text-sm text-stone-500">
        Загрузите .xlsx файл — цены и скидки обновятся автоматически по артикулу (SKU).
      </p>

      <div className="mt-6 rounded-sm bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-medium text-charcoal">
          <FileSpreadsheet className="h-4 w-4 text-gold" />
          Формат файла
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-stone-600">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="p-2 text-left">sku / Артикул</th>
                <th className="p-2 text-left">price / Цена</th>
                <th className="p-2 text-left">discountPrice / Цена со скидкой</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">MIL-240</td>
                <td className="p-2">349000</td>
                <td className="p-2">319000</td>
              </tr>
              <tr>
                <td className="p-2">BER-STD</td>
                <td className="p-2">149000</td>
                <td className="p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-sm bg-white p-6 shadow-sm">
        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500">Ключ администратора</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="mt-1 w-full rounded-sm border border-stone-200 px-4 py-3 text-sm outline-none focus:border-gold"
            placeholder="ADMIN_SECRET из .env"
            required
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500">Файл Excel (.xlsx)</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="flex items-center gap-2 rounded-sm bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            Обновлено: {result.updated} из {result.total}
            {result.notFound > 0 && ` · Не найдено SKU: ${result.notFound}`}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-sm bg-charcoal px-6 py-3 text-sm uppercase tracking-widest text-cream hover:bg-gold disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {loading ? "Загрузка..." : "Импортировать"}
        </button>
      </form>
    </div>
  );
}
