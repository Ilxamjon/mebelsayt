"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGallery } from "./ProductGallery";
import { SizeSelector } from "./SizeSelector";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice, getEffectivePrice, calcDiscountPercent } from "@/lib/price";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const variant = product.variants.find((v) => v.id === variantId);
  const pricing = variant ? getEffectivePrice(variant.price, variant.discountPrice) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery media={product.media} productName={product.name} />

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-gold">{product.category.name}</p>
          <h1 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl lg:text-5xl">{product.name}</h1>

          {pricing && (
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-medium text-charcoal">{formatPrice(pricing.current)}</span>
              {pricing.original && (
                <>
                  <span className="text-lg text-stone-400 line-through">{formatPrice(pricing.original)}</span>
                  <span className="rounded-sm bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold">
                    −{calcDiscountPercent(pricing.original, pricing.current)}%
                  </span>
                </>
              )}
            </div>
          )}

          <p className="mt-6 leading-relaxed text-stone-600">{product.description}</p>

          <div className="mt-8">
            <SizeSelector variants={product.variants} selectedId={variantId} onSelect={setVariantId} />
          </div>

          <div className="mt-8">
            <AddToCartButton product={product} variantId={variantId} />
          </div>

          <p className="mt-4 text-xs text-stone-400">
            Оплата на сайте не требуется. Менеджер свяжется с вами для уточнения деталей.
          </p>

          {product.specs.length > 0 && (
            <div className="mt-10 border-t border-stone-200 pt-8">
              <h2 className="text-xs uppercase tracking-widest text-stone-500">Характеристики</h2>
              <dl className="mt-4 space-y-3">
                {product.specs.map((spec) => (
                  <div key={spec.id} className="flex justify-between gap-4 text-sm">
                    <dt className="text-stone-500">{spec.label}</dt>
                    <dd className="text-right font-medium text-charcoal">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
