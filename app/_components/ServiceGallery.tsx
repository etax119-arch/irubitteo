'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { GalleryItem } from '@/types/gallery';

interface ServiceGalleryProps {
  items: GalleryItem[];
}

/** 화면을 채우기 위한 한 세트의 최소 카드 수 */
const MIN_CARDS_PER_SET = 10;
/** 카드 1장이 지나가는 데 걸리는 시간(초) */
const SECONDS_PER_CARD = 4.5;

export default function ServiceGallery({ items }: ServiceGalleryProps) {
  if (items.length === 0) return null;

  // 카드 수가 적으면 세트를 반복해 화면을 채운다
  const repeat = Math.ceil(MIN_CARDS_PER_SET / items.length);
  const set = Array.from({ length: repeat }, () => items).flat();
  // 무한 루프를 위해 세트를 두 번 렌더링 (translateX(-50%) 지점에서 이어짐)
  const track = [...set, ...set];
  const duration = `${set.length * SECONDS_PER_CARD}s`;

  return (
    <div className="group relative mt-12">
      {/* 좌우 페이드 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-duru-orange-50/40 to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

      {/* 자동 슬라이드 캐러셀 */}
      <div className="overflow-hidden pb-2">
        <div
          className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ animationDuration: duration }}
        >
          {track.map((item, index) => {
            const imageSrc = item.imageCardUrl || item.imageUrl;
            const alt = item.imageAlt || `${item.title} - ${item.artistName}`;
            const isClone = index >= set.length;
            return (
              <Link
                key={`${item.id}-${index}`}
                href={`/gallery/${item.id}`}
                aria-hidden={isClone}
                tabIndex={isClone ? -1 : undefined}
                className="group/card relative block shrink-0 pr-5 w-[170px] sm:w-[190px] lg:w-[210px]"
              >
                <div className="relative h-[200px] lg:h-[230px] overflow-hidden rounded-xl bg-gray-100 shadow-soft">
                  <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 170px, (max-width: 1024px) 190px, 210px"
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
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
    </div>
  );
}
