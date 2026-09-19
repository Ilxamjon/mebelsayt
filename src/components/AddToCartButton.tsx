"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { trackEvent } from "@/components/Analytics";
import { getEffectivePrice } from "@/lib/price";

interface AddToCartButtonProps {
  product: Product;
  variantId: string;
}

export function AddToCartButton({ product, variantId }: AddToCartButtonProps) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return null;

  const mainImage = product.media.find((m) => m.type === "GALLERY") ?? product.media[0];
  const pricing = getEffectivePrice(variant.price, variant.discountPrice);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      sizeLabel: variant.sizeLabel,
      sku: variant.sku,
      price: pricing.current,
      imageUrl: mainImage?.url,
    });
    trackEvent("add_to_cart", {
      product: product.name,
      sku: variant.sku,
      price: pricing.current,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="flex w-full items-center justify-center gap-2 rounded-sm bg-charcoal px-6 py-4 text-sm uppercase tracking-widest text-cream transition-colors hover:bg-gold sm:w-auto"
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Добавлено
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          В корзину
        </>
      )}
    </button>
  );
}
