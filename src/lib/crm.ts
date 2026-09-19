import type { CartItem } from "./types";
import { formatPrice } from "./price";

export interface CrmLeadPayload {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  items: CartItem[];
  totalPrice: number;
}

export async function sendLeadToCrm(payload: CrmLeadPayload): Promise<{ success: boolean; crmId?: string; error?: string }> {
  const provider = process.env.CRM_PROVIDER ?? "webhook";

  if (provider === "amocrm" && process.env.AMOCRM_WEBHOOK_URL) {
    return sendAmoCrm(payload);
  }

  if (provider === "bitrix24" && process.env.BITRIX24_WEBHOOK_URL) {
    return sendBitrix24(payload);
  }

  if (process.env.CRM_WEBHOOK_URL) {
    return sendGenericWebhook(payload);
  }

  // Development fallback — log to console
  console.log("[CRM] New lead:", JSON.stringify(payload, null, 2));
  return { success: true, crmId: `dev-${Date.now()}` };
}

async function sendGenericWebhook(payload: CrmLeadPayload) {
  const response = await fetch(process.env.CRM_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "mebelsayt",
      ...payload,
      itemsText: formatItemsText(payload.items),
    }),
  });

  if (!response.ok) {
    return { success: false, error: `Webhook error: ${response.status}` };
  }

  const data = await response.json().catch(() => ({}));
  return { success: true, crmId: data.id?.toString() };
}

async function sendAmoCrm(payload: CrmLeadPayload) {
  const response = await fetch(process.env.AMOCRM_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        name: `Заявка с сайта: ${payload.name}`,
        price: payload.totalPrice,
        custom_fields_values: [
          { field_code: "PHONE", values: [{ value: payload.phone }] },
          ...(payload.email ? [{ field_code: "EMAIL", values: [{ value: payload.email }] }] : []),
        ],
        _embedded: {
          tags: [{ name: "сайт" }],
        },
        note: formatItemsText(payload.items) + (payload.comment ? `\n\nКомментарий: ${payload.comment}` : ""),
      },
    ]),
  });

  if (!response.ok) {
    return { success: false, error: `amoCRM error: ${response.status}` };
  }

  return { success: true };
}

async function sendBitrix24(payload: CrmLeadPayload) {
  const url = `${process.env.BITRIX24_WEBHOOK_URL}crm.lead.add.json`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: `Заявка с сайта: ${payload.name}`,
        NAME: payload.name,
        PHONE: [{ VALUE: payload.phone, VALUE_TYPE: "WORK" }],
        ...(payload.email ? { EMAIL: [{ VALUE: payload.email, VALUE_TYPE: "WORK" }] } : {}),
        COMMENTS: formatItemsText(payload.items) + (payload.comment ? `\n\n${payload.comment}` : ""),
        OPPORTUNITY: payload.totalPrice,
        SOURCE_ID: "WEB",
      },
    }),
  });

  const data = await response.json();
  if (!data.result) {
    return { success: false, error: data.error_description ?? "Bitrix24 error" };
  }

  return { success: true, crmId: data.result.toString() };
}

function formatItemsText(items: CartItem[]): string {
  return items
    .map(
      (item) =>
        `${item.productName} (${item.sizeLabel}, ${item.sku}) × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
    )
    .join("\n");
}
