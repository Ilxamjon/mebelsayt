import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/price";

export default async function AdminPage() {
  const [productCount, orderCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">Панель управления</h1>
      <p className="mt-2 text-sm text-stone-500">AtelierMebel — администрирование сайта</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-stone-400">Товаров</p>
          <p className="mt-2 text-3xl font-semibold text-charcoal">{productCount}</p>
        </div>
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-stone-400">Заявок</p>
          <p className="mt-2 text-3xl font-semibold text-charcoal">{orderCount}</p>
        </div>
        <Link href="/admin/import" className="rounded-sm bg-gold/10 p-6 shadow-sm transition-colors hover:bg-gold/20">
          <p className="text-xs uppercase tracking-widest text-gold">Быстрое действие</p>
          <p className="mt-2 text-lg font-medium text-charcoal">Загрузить цены из Excel →</p>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="text-sm uppercase tracking-widest text-stone-500">Последние заявки</h2>
        <div className="mt-4 overflow-x-auto rounded-sm bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-widest text-stone-400">
                <th className="p-4">Дата</th>
                <th className="p-4">Клиент</th>
                <th className="p-4">Телефон</th>
                <th className="p-4">Сумма</th>
                <th className="p-4">CRM</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-stone-50">
                  <td className="p-4 text-stone-500">{new Date(order.createdAt).toLocaleString("ru-RU")}</td>
                  <td className="p-4 font-medium">{order.name}</td>
                  <td className="p-4">{order.phone}</td>
                  <td className="p-4">{formatPrice(order.totalPrice)}</td>
                  <td className="p-4">
                    <span className={order.crmSent ? "text-green-600" : "text-stone-400"}>
                      {order.crmSent ? "✓ Отправлено" : "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    Заявок пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
