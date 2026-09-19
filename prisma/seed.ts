import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.order.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const sofas = await prisma.category.create({
    data: { name: "Диваны", slug: "divany", sortOrder: 1 },
  });
  const armchairs = await prisma.category.create({
    data: { name: "Кресла", slug: "kresla", sortOrder: 2 },
  });
  const beds = await prisma.category.create({
    data: { name: "Кровати", slug: "krovati", sortOrder: 3 },
  });

  const products = [
    {
      name: "Диван Milano",
      slug: "divan-milano",
      description:
        "Премиальный модульный диван с глубокой посадкой и мягкой обивкой из итальянской ткани. Идеален для просторных гостиных в современном стиле.",
      categoryId: sofas.id,
      isFeatured: true,
      sortOrder: 1,
      variants: [
        { sizeLabel: "200 см", width: 200, depth: 95, height: 82, sku: "MIL-200", price: 289000 },
        { sizeLabel: "240 см", width: 240, depth: 95, height: 82, sku: "MIL-240", price: 349000, discountPrice: 319000 },
        { sizeLabel: "280 см", width: 280, depth: 95, height: 82, sku: "MIL-280", price: 399000 },
      ],
      media: [
        { type: "GALLERY" as const, url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85", alt: "Диван Milano", sortOrder: 0 },
        { type: "INTERIOR" as const, url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=85", alt: "Milano в интерьере", sortOrder: 1 },
        { type: "INTERIOR" as const, url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=85", alt: "Milano гостиная", sortOrder: 2 },
        { type: "BLUEPRINT" as const, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85", alt: "Чертёж Milano", sortOrder: 3 },
        { type: "VIDEO" as const, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", alt: "Видео Milano", sortOrder: 4 },
      ],
      specs: [
        { label: "Каркас", value: "массив бука, фанера", sortOrder: 0 },
        { label: "Наполнитель", value: "ППУ высокой плотности + пружинный блок", sortOrder: 1 },
        { label: "Обивка", value: "итальянская ткань, 50 000 циклов Martindale", sortOrder: 2 },
        { label: "Гарантия", value: "5 лет", sortOrder: 3 },
      ],
    },
    {
      name: "Кресло Bergamo",
      slug: "kreslo-bergamo",
      description:
        "Элегантное кресло с широкими подлокотниками и анатомической поддержкой спины. Создано для долгого комфортного отдыха.",
      categoryId: armchairs.id,
      isFeatured: true,
      sortOrder: 2,
      variants: [
        { sizeLabel: "Стандарт", width: 85, depth: 90, height: 78, sku: "BER-STD", price: 149000 },
        { sizeLabel: "XL", width: 95, depth: 95, height: 78, sku: "BER-XL", price: 169000, discountPrice: 154000 },
      ],
      media: [
        { type: "GALLERY" as const, url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=85", alt: "Кресло Bergamo", sortOrder: 0 },
        { type: "INTERIOR" as const, url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1600&q=85", alt: "Bergamo в интерьере", sortOrder: 1 },
        { type: "BLUEPRINT" as const, url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85", alt: "Чертёж Bergamo", sortOrder: 2 },
      ],
      specs: [
        { label: "Каркас", value: "массив дуба", sortOrder: 0 },
        { label: "Механизм", value: "поворотный, 360°", sortOrder: 1 },
        { label: "Обивка", value: "натуральная кожа", sortOrder: 2 },
      ],
    },
    {
      name: "Кровать Venezia",
      slug: "krovat-venezia",
      description:
        "Кровать с мягким изголовьем ручной стёжки. Встроенная подсветка и система хранения в основании.",
      categoryId: beds.id,
      isFeatured: true,
      sortOrder: 3,
      variants: [
        { sizeLabel: "160×200", width: 160, depth: 210, height: 110, sku: "VEN-160", price: 219000 },
        { sizeLabel: "180×200", width: 180, depth: 210, height: 110, sku: "VEN-180", price: 249000 },
        { sizeLabel: "200×200", width: 200, depth: 210, height: 110, sku: "VEN-200", price: 279000 },
      ],
      media: [
        { type: "GALLERY" as const, url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=85", alt: "Кровать Venezia", sortOrder: 0 },
        { type: "INTERIOR" as const, url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=85", alt: "Venezia спальня", sortOrder: 1 },
        { type: "BLUEPRINT" as const, url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1600&q=85", alt: "Чертёж Venezia", sortOrder: 2 },
      ],
      specs: [
        { label: "Изголовье", value: "мягкое, каретная стёжка", sortOrder: 0 },
        { label: "Основание", value: "ортопедическое, ламели", sortOrder: 1 },
        { label: "Подсветка", value: "LED, тёплый свет", sortOrder: 2 },
      ],
    },
    {
      name: "Диван Como",
      slug: "divan-como",
      description: "Компактный диван для городских апартаментов. Чистые линии и премиальные материалы.",
      categoryId: sofas.id,
      isFeatured: false,
      sortOrder: 4,
      variants: [
        { sizeLabel: "180 см", width: 180, depth: 88, height: 80, sku: "COM-180", price: 199000 },
        { sizeLabel: "210 см", width: 210, depth: 88, height: 80, sku: "COM-210", price: 229000 },
      ],
      media: [
        { type: "GALLERY" as const, url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85", alt: "Диван Como", sortOrder: 0 },
        { type: "INTERIOR" as const, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85", alt: "Como в интерьере", sortOrder: 1 },
      ],
      specs: [
        { label: "Стиль", value: "минимализм", sortOrder: 0 },
        { label: "Ножки", value: "массив дуба", sortOrder: 1 },
      ],
    },
  ];

  for (const p of products) {
    const { variants, media, specs, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        variants: { create: variants },
        media: { create: media },
        specs: { create: specs },
      },
    });
  }

  await prisma.discountRule.create({
    data: {
      name: "Весенняя акция — диваны Milano 240",
      percent: 9,
      skuPattern: "MIL-240",
      isActive: true,
    },
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
