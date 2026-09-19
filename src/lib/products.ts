import { prisma } from "./db";
import type { Product } from "./types";

const productInclude = {
  category: true,
  variants: { where: { isActive: true }, orderBy: { price: "asc" as const } },
  media: { orderBy: { sortOrder: "asc" as const } },
  specs: { orderBy: { sortOrder: "asc" as const } },
};

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  return products as Product[];
}

export async function getAllProducts(categorySlug?: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: productInclude,
    orderBy: { sortOrder: "asc" },
  });
  return products as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: productInclude,
  });
  return product as Product | null;
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getRelatedProducts(categorySlug: string, excludeSlug: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      slug: { not: excludeSlug },
      category: { slug: categorySlug },
    },
    include: productInclude,
    take: limit,
  });
  return products as Product[];
}
