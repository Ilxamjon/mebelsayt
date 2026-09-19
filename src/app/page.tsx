import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await getFeaturedProducts(6);

  return (
    <>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85"
          alt="Премиальная мягкая мебель"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-cream">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Премиальная мягкая мебель</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Мебель, которая создаёт атмосферу дома
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-stone-200 sm:text-base">
            Индивидуальные размеры, европейские ткани, 5 лет гарантии. Выберите модель — мы свяжемся для оформления заказа.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="w-full rounded-sm bg-gold px-8 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gold/90 sm:w-auto"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/cart"
              className="w-full rounded-sm border border-cream/40 px-8 py-4 text-sm uppercase tracking-widest text-cream transition-colors hover:bg-cream/10 sm:w-auto"
            >
              Оформить заявку
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Коллекция</p>
            <h2 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">Избранные модели</h2>
          </div>
          <Link href="/catalog" className="hidden text-sm uppercase tracking-widest text-stone-500 hover:text-charcoal sm:block">
            Весь каталог →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-charcoal py-16 text-cream lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { title: "Индивидуальные размеры", text: "Любая модель в нужных габаритах — от компактных до просторных." },
            { title: "Фото и чертежи", text: "Каждая карточка: интерьерные снимки, чертежи, видео в высоком качестве." },
            { title: "Заявка в CRM", text: "Корзина без оплаты — менеджер получает заявку и связывается с вами." },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl text-gold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
