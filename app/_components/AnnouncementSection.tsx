'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Megaphone } from 'lucide-react';
import { formatKSTLongDate } from '@/lib/kst';
import type { AnnouncementItem } from '@/types/announcement';

interface AnnouncementSectionProps {
  items: AnnouncementItem[];
}

// 공고가 있을 때와 없을 때 섹션 높이를 동일하게 유지하기 위한 기준값
const CARD_MIN_HEIGHT = 340; // px

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

  // 가장 최근 공고 하나만 크게 노출
  const featured = items[0];
  const cover = featured?.images[0];

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

        {/* 대표 공고 1건 — 비어있어도 동일한 높이를 유지 */}
        <div
          className={`flex flex-col rounded-3xl border border-duru-orange-100 bg-white shadow-soft overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            minHeight: `${CARD_MIN_HEIGHT}px`,
            transitionDelay: isVisible ? '150ms' : '0ms',
          }}
        >
          {featured ? (
            <Link
              href={`/announcements/${featured.id}`}
              className="group flex flex-1 flex-col focus:outline-none focus:ring-2 focus:ring-inset focus:ring-duru-orange-500"
            >
              <div className="relative w-full aspect-[16/9] bg-duru-orange-50 overflow-hidden">
                {cover ? (
                  <Image
                    src={cover.imageUrl}
                    alt={cover.imageAlt || featured.title}
                    fill
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    {...(cover.imageBlurData
                      ? { placeholder: 'blur' as const, blurDataURL: cover.imageBlurData }
                      : {})}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Megaphone aria-hidden className="w-14 h-14 text-landing-orange/50" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col px-6 py-7 sm:px-8 sm:py-8">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="inline-flex rounded-full bg-duru-orange-50 px-3 py-1 text-xs font-semibold text-landing-orange">
                    모집중
                  </span>
                  <span className="text-sm text-duru-text-sub">
                    {formatKSTLongDate(featured.createdAt)}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-duru-text-main break-keep leading-snug line-clamp-2 group-hover:text-landing-orange transition-colors">
                  {featured.title}
                </h3>
                <p className="mt-3 text-base text-duru-text-sub break-keep leading-relaxed line-clamp-3">
                  {featured.content}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-landing-orange">
                  자세히 보기
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ) : (
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
            className="inline-flex items-center gap-2 rounded-full bg-landing-orange px-7 py-3.5 text-base font-semibold text-white shadow-soft transition-colors hover:bg-duru-orange-600 focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:ring-offset-2"
          >
            전체 공고 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
