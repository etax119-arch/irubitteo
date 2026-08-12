'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { GalleryItem } from '@/types/gallery';

interface ServiceGalleryProps {
  items: GalleryItem[];
}

export default function ServiceGallery({ items }: ServiceGalleryProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      {/* 캐러셀 */}
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const imageSrc = item.imageCardUrl || item.imageUrl;
          const alt = item.imageAlt || `${item.title} - ${item.artistName}`;
          return (
            <Link
              key={item.id}
              href={`/gallery/${item.id}`}
              className="group relative block shrink-0 snap-start w-[150px] sm:w-[170px] lg:w-[190px]"
            >
              <div className="relative h-[200px] lg:h-[230px] overflow-hidden rounded-xl bg-gray-100 shadow-soft">
                <Image
                  src={imageSrc}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 150px, (max-width: 1024px) 170px, 190px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  {...(item.imageBlurData
                    ? { placeholder: 'blur' as const, blurDataURL: item.imageBlurData }
                    : {})}
                />
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                {/* 텍스트 */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-3 text-white">
                  <h4 className="text-sm font-bold break-keep line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-white/80">{item.artistName}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
