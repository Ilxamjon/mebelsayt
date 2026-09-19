import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, percent, skuPattern, categoryId, startsAt, endsAt } = body;

    if (!name || !percent) {
      return NextResponse.json({ error: "Укажите название и процент скидки" }, { status: 400 });
    }

    const rule = await prisma.discountRule.create({
      data: {
        name,
        percent: Number(percent),
        skuPattern: skuPattern || null,
        categoryId: categoryId || null,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        isActive: true,
      },
    });

    // Apply discount to matching variants
    const variants = await prisma.productVariant.findMany({
      where: skuPattern ? { sku: { contains: skuPattern } } : {},
      include: { product: true },
    });

    let applied = 0;
    for (const variant of variants) {
      if (categoryId && variant.product.categoryId !== categoryId) continue;
      const discountPrice = Math.round(variant.price * (1 - Number(percent) / 100));
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { discountPrice },
      });
      applied++;
    }

    return NextResponse.json({ success: true, ruleId: rule.id, applied });
  } catch (error) {
    console.error("[discounts]", error);
    return NextResponse.json({ error: "Ошибка создания скидки" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ruleId = searchParams.get("id");
  if (!ruleId) {
    return NextResponse.json({ error: "Укажите id правила" }, { status: 400 });
  }

  await prisma.discountRule.update({
    where: { id: ruleId },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
