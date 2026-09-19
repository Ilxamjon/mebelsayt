import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";

interface PriceRow {
  sku: string;
  price?: number;
  discountPrice?: number | null;
}

function parseRows(buffer: ArrayBuffer): PriceRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  return rows
    .map((row) => {
      const sku = String(row.sku ?? row.SKU ?? row["Артикул"] ?? "").trim();
      const price = Number(row.price ?? row.Price ?? row["Цена"] ?? 0);
      const discountRaw = row.discountPrice ?? row["Цена со скидкой"] ?? row["Скидка"];
      const discountPrice = discountRaw != null && discountRaw !== "" ? Number(discountRaw) : null;

      return { sku, price, discountPrice };
    })
    .filter((r) => r.sku);
}

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const rows = parseRows(buffer);

    let updated = 0;
    let notFound = 0;

    for (const row of rows) {
      const variant = await prisma.productVariant.findUnique({ where: { sku: row.sku } });
      if (!variant) {
        notFound++;
        continue;
      }

      await prisma.productVariant.update({
        where: { sku: row.sku },
        data: {
          ...(row.price != null && row.price > 0 ? { price: Math.round(row.price) } : {}),
          discountPrice: row.discountPrice != null && row.discountPrice > 0 ? Math.round(row.discountPrice) : null,
        },
      });
      updated++;
    }

    return NextResponse.json({ success: true, updated, notFound, total: rows.length });
  } catch (error) {
    console.error("[import-prices]", error);
    return NextResponse.json({ error: "Ошибка обработки файла" }, { status: 500 });
  }
}
