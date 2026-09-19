import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendLeadToCrm } from "@/lib/crm";
import type { CartItem } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, comment, items } = body as {
      name: string;
      phone: string;
      email?: string;
      comment?: string;
      items: CartItem[];
    };

    if (!name?.trim() || !phone?.trim() || !items?.length) {
      return NextResponse.json({ error: "Заполните имя, телефон и добавьте товары" }, { status: 400 });
    }

    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const crmResult = await sendLeadToCrm({ name, phone, email, comment, items, totalPrice });

    const order = await prisma.order.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        comment: comment?.trim() || null,
        items: JSON.stringify(items),
        totalPrice,
        crmSent: crmResult.success,
        crmId: crmResult.crmId ?? null,
      },
    });

    if (!crmResult.success) {
      return NextResponse.json(
        { error: crmResult.error ?? "Ошибка CRM", orderId: order.id },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("[orders]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
