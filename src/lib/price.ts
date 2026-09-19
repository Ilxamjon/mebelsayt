export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getEffectivePrice(
  price: number,
  discountPrice: number | null | undefined,
): { current: number; original: number | null; hasDiscount: boolean } {
  if (discountPrice != null && discountPrice < price) {
    return { current: discountPrice, original: price, hasDiscount: true };
  }
  return { current: price, original: null, hasDiscount: false };
}

export function calcDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}
