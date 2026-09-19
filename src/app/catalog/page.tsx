import { getAllProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

interface CatalogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export const metadata = {
  title: "Каталог",
  description: "Каталог премиальной мягкой мебели: диваны, кресла, кровати.",
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts(category),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-gold">Каталог</p>
        <h1 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">Мягкая мебель</h1>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/catalog"
          className={`rounded-sm px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
            !category ? "bg-charcoal text-cream" : "bg-white text-stone-600 hover:text-charcoal"
          }`}
        >
          Все
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.slug}`}
            className={`rounded-sm px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
              category === cat.slug ? "bg-charcoal text-cream" : "bg-white text-stone-600 hover:text-charcoal"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-stone-500">В этой категории пока нет товаров.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
