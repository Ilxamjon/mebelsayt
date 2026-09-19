"use client";

import type { ProductVariant } from "@/lib/types";
import { formatPrice, getEffectivePrice } from "@/lib/price";

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
}

export function SizeSelector({ variants, selectedId, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-stone-500">Размер</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const pricing = getEffectivePrice(variant.price, variant.discountPrice);
          const isSelected = variant.id === selectedId;
          const dims = [variant.width, variant.depth, variant.height].filter(Boolean).join(" × ");

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              className={`min-w-[100px] rounded-sm border px-4 py-3 text-left transition-colors ${
                isSelected
                  ? "border-charcoal bg-charcoal text-cream"
                  : "border-stone-200 bg-white text-charcoal hover:border-gold"
              }`}
            >
              <span className="block text-sm font-medium">{variant.sizeLabel}</span>
              {dims && <span className="mt-0.5 block text-[10px] opacity-70">{dims} см</span>}
              <span className="mt-1 block text-xs">{formatPrice(pricing.current)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
