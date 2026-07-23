'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { GalleryItem } from '@/types/gallery';
import ServiceGallery from './ServiceGallery';

interface ServiceSectionProps {
  galleryItems: GalleryItem[];
}

export default function ServiceSection({ galleryItems }: ServiceSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 헤더가 보인 후 텍스트 애니메이션 시작
          setTimeout(() => setShowText(true), 300);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center py-32 bg-gradient-to-b from-duru-ivory/30 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 - 이루빛터 의미 중심 */}
        <div className="text-center mb-8">
          <div className={`mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Image
              src="/images/logo_tran.png"
              alt="이루빛터"
              width={1563}
              height={1563}
              className="h-[400px] w-auto mx-auto -my-[130px]"
            />
          </div>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed space-y-2">
            <p className={`transition-all duration-700 delay-200 ${
              showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <span className="font-semibold text-gray-900">&apos;이루다&apos;</span>와{' '}
              <span className="font-semibold text-gray-900">&apos;빛&apos;</span>, 그리고{' '}
              <span className="font-semibold text-gray-900">&apos;터전&apos;</span>이 만나
            </p>
            <p className={`transition-all duration-700 delay-400 ${
              showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              장애인 근로자들이 자립의 꿈을 이루고,
            </p>
            <p className={`transition-all duration-700 delay-600 ${
              showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              기업은 사회적 가치를 실현하는{' '}
              <span className="font-semibold text-landing-orange">함께 빛나는 일터</span>를 만듭니다.
            </p>
          </div>
        </div>

        {/* 빛터 갤러리 캐러셀 */}
        <ServiceGallery items={galleryItems} />
      </div>
    </section>
  );
}
