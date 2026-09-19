import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AtelierMebel — Премиальная мягкая мебель",
    template: "%s | AtelierMebel",
  },
  description:
    "Премиальная мягкая мебель: диваны, кресла, кровати. Индивидуальные размеры, фото в интерьере, чертежи. Заявка через корзину — без оплаты на сайте.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "AtelierMebel",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Analytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
