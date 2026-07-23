'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronRight, Megaphone } from 'lucide-react';
import { formatKSTLongDate } from '@/lib/kst';
import type { AnnouncementItem } from '@/types/announcement';

interface AnnouncementSectionProps {
  items: AnnouncementItem[];
}

// 리스트가 꽉 찼을 때와 비었을 때 섹션 높이를 동일하게 유지하기 위한 기준값
const VISIBLE_ROWS = 6;
const ROW_MIN_HEIGHT = 96; // px (썸네일 + 상하 여백)

function AnnouncementThumbnail({ item }: { item: AnnouncementItem }) {
  const cover = item.images[0];

  return (
    <div className="relative shrink-0 w-24 sm:w-28 aspect-[16/9] rounded-xl bg-duru-orange-50 overflow-hidden">
      {cover ? (
        <Image
          src={cover.imageCardUrl || cover.imageUrl}
          alt={cover.imageAlt || item.title}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          {...(cover.imageBlurData
            ? { placeholder: 'blur' as const, blurDataURL: cover.imageBlurData }
            : {})}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Megaphone aria-hidden className="w-7 h-7 text-landing-orange/60" />
        </div>
      )}
    </div>
  );
}

export default function AnnouncementSection({ items }: AnnouncementSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEmpty = items.length === 0;

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center py-32 bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 break-keep">
            지금 <span className="text-landing-orange">진행 중인 공고</span>를 확인해 보세요
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed break-keep">
            이루빛터와 함께할 새로운 기회가 기다리고 있어요.
          </p>
        </div>

        {/* 공고 리스트 — 비어있어도 동일한 높이를 유지 */}
        <div
          className="flex flex-col rounded-2xl border border-duru-orange-100 bg-white shadow-soft overflow-hidden"
          style={{ minHeight: `${VISIBLE_ROWS * ROW_MIN_HEIGHT}px` }}
        >
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-duru-orange-50">
                <Megaphone aria-hidden className="w-7 h-7 text-landing-orange/70" />
              </span>
              <p className="text-base font-semibold text-duru-text-main break-keep">
                현재 진행 중인 공고가 없어요
              </p>
              <p className="text-sm text-duru-text-sub break-keep">
                새로운 공고가 등록되면 이곳에서 가장 먼저 만나보실 수 있어요.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-duru-orange-100">
              {items.map((item, index) => {
                const date = formatKSTLongDate(item.createdAt);

                return (
                  <li
                    key={item.id}
                    className={`transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: isVisible ? `${100 + index * 60}ms` : '0ms' }}
                  >
                    <Link
                      href={`/announcements/${item.id}`}
                      className="group flex items-center gap-4 px-4 py-4 sm:px-5 transition-colors hover:bg-duru-orange-50/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-duru-orange-500"
                      style={{ minHeight: `${ROW_MIN_HEIGHT}px` }}
                    >
                      <AnnouncementThumbnail item={item} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex rounded-full bg-duru-orange-50 px-2.5 py-0.5 text-xs font-semibold text-landing-orange">
                            모집중
                          </span>
                          <span className="text-xs text-duru-text-sub">{date}</span>
                        </div>
                        <h3 className="font-bold text-duru-text-main break-keep leading-snug line-clamp-1 group-hover:text-landing-orange transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-duru-text-sub break-keep leading-relaxed line-clamp-1">
                          {item.content}
                        </p>
                      </div>
                      <ChevronRight
                        aria-hidden
                        className="hidden sm:block w-5 h-5 shrink-0 text-duru-text-sub/50 transition-colors group-hover:text-landing-orange"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 전체 보기 */}
        <div
          className={`mt-10 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: isVisible ? '300ms' : '0ms' }}
        >
          <Link
            href="/announcements"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-landing-orange hover:text-duru-orange-600 transition-colors"
          >
            전체 공고 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
