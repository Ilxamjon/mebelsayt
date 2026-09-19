"use client";

import Image from "next/image";
import { useState } from "react";
import { Play, X } from "lucide-react";
import type { ProductMedia } from "@/lib/types";

interface ProductGalleryProps {
  media: ProductMedia[];
  productName: string;
}

export function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const visualMedia = media.filter((m) => m.type !== "VIDEO");
  const videos = media.filter((m) => m.type === "VIDEO");
  const active = visualMedia[activeIndex] ?? visualMedia[0];

  if (!active) return null;

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone-100 sm:aspect-[16/10]"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={active.url}
            alt={active.alt || productName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          <span className="absolute bottom-3 right-3 rounded-sm bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wider text-white">
            {active.type === "BLUEPRINT" ? "Чертёж" : active.type === "INTERIOR" ? "Интерьер" : "Фото"}
          </span>
        </button>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {visualMedia.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-sm sm:h-20 sm:w-24 ${
                i === activeIndex ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={item.url} alt={item.alt} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>

        {videos.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-stone-400">Видео</p>
            {videos.map((video) => (
              <div key={video.id} className="relative aspect-video overflow-hidden rounded-sm bg-stone-900">
                <iframe
                  src={video.url}
                  title={video.alt || productName}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-white"
            onClick={() => setLightbox(false)}
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-[80vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.url}
              alt={active.alt || productName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
