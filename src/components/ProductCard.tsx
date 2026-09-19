import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, getEffectivePrice } from "@/lib/price";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.media.find((m) => m.type === "GALLERY") ?? product.media[0];
  const cheapest = product.variants[0];
  const pricing = cheapest ? getEffectivePrice(cheapest.price, cheapest.discountPrice) : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-sm bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {mainImage && (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {pricing?.hasDiscount && (
          <span className="absolute left-3 top-3 bg-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Sale
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-widest text-stone-400">{product.category.name}</p>
        <h3 className="mt-1 font-display text-lg text-charcoal sm:text-xl">{product.name}</h3>
        {pricing && (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-medium text-charcoal">{formatPrice(pricing.current)}</span>
            {pricing.original && (
              <span className="text-xs text-stone-400 line-through">{formatPrice(pricing.original)}</span>
            )}
          </div>
        )}
        {product.variants.length > 1 && (
          <p className="mt-1 text-xs text-stone-400">{product.variants.length} размеров</p>
        )}
      </div>
    </Link>
  );
}
