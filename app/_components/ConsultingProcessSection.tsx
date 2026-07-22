'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  Calculator,
  ChevronRight,
  ClipboardList,
  FileSignature,
  HeartHandshake,
  UserSearch,
  type LucideIcon,
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** gpt-image-2 일러스트 도착 시 이 필드만 추가하면 아이콘 대신 렌더됨 */
  image?: string;
  imageAlt?: string;
}

const STEPS: Step[] = [
  {
    id: 'estimate',
    title: '고객사 의무고용 인원 산출',
    description: '의무고용 인원을 산출하고 재택근로자 고용 가능 인원을 파악해 드려요.',
    icon: Calculator,
    image: '/images/consulting/step-1.png',
    imageAlt: '의무고용 인원 산출 일러스트 — 계산기와 인원 명단',
  },
  {
    id: 'request',
    title: '장애인 고용 의뢰',
    description: '상시근로인원과 직무, 근무조건(근무시간·급여 등)을 파악하고 제안해요.',
    icon: ClipboardList,
    image: '/images/consulting/step-2.png',
    imageAlt: '고용 의뢰 일러스트 — 체크리스트와 말풍선',
  },
  {
    id: 'recommend',
    title: '인력 추천',
    description: '고객사가 요청한 직무에 꼭 맞는 인재를 추천해 드려요.',
    icon: UserSearch,
    image: '/images/consulting/step-3.png',
    imageAlt: '인력 추천 일러스트 — 돋보기로 인재 프로필 확인',
  },
  {
    id: 'contract',
    title: '채용 확정 및 직무부여',
    description: '근로계약 체결과 직무교육을 함께 진행해요.',
    icon: FileSignature,
    image: '/images/consulting/step-4.png',
    imageAlt: '채용 확정 일러스트 — 근로계약서 서명',
  },
  {
    id: 'support',
    title: '근로자 관리 지원',
    description: '재택근로자 운영 관리와 고충 심리 상담까지 지원해요.',
    icon: HeartHandshake,
    image: '/images/consulting/step-5.png',
    imageAlt: '근로자 관리 지원 일러스트 — 하트를 감싼 두 손과 상담 헤드셋',
  },
];

/** 화살표를 배치할 원 사이 중간점 (grid-cols-5 기준 원 중심은 10~90%) */
const ARROW_POSITIONS = [20, 40, 60, 80];

function StepVisual({ step, sizeClass }: { step: Step; sizeClass: string }) {
  return (
    <div
      className={`relative z-10 ${sizeClass} rounded-full bg-white border-2 border-duru-orange-200 shadow-soft flex items-center justify-center overflow-hidden`}
    >
      {step.image ? (
        <Image
          src={step.image}
          alt={step.imageAlt ?? step.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      ) : (
        <step.icon aria-hidden className="w-7 h-7 lg:w-9 lg:h-9 text-landing-orange" />
      )}
    </div>
  );
}

export default function ConsultingProcessSection() {
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

  const stepTransition = (index: number) => ({
    className: `transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`,
    style: { transitionDelay: isVisible ? `${150 + index * 120}ms` : '0ms' },
  });

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-duru-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            처음이어도 괜찮습니다, <span className="text-landing-orange">다섯 단계</span>로 함께
            걸어요
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            의무고용 인원 산출부터 채용 이후의 관리까지,{' '}
            <br className="hidden sm:block" />
            이루빛터가 각 단계마다 곁에서 안내합니다.
          </p>
        </div>

        {/* 데스크톱: 가로 타임라인 */}
        <div className="relative hidden lg:block">
          {/* 원 중심(10%~90%)을 관통하는 점선 */}
          <div
            aria-hidden
            className={`absolute left-[10%] right-[10%] top-10 xl:top-12 border-t-2 border-dashed border-duru-orange-200 transition-opacity duration-700 delay-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {ARROW_POSITIONS.map((pos) => (
            <div
              key={pos}
              aria-hidden
              className={`absolute top-10 xl:top-12 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 shadow-soft z-10 transition-opacity duration-700 delay-700 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ left: `${pos}%` }}
            >
              <ChevronRight className="w-4 h-4 text-landing-orange" />
            </div>
          ))}
          <ol className="grid grid-cols-5 gap-x-4">
            {STEPS.map((step, index) => {
              const t = stepTransition(index);
              return (
                <li
                  key={step.id}
                  className={`flex flex-col items-center text-center ${t.className}`}
                  style={t.style}
                >
                  <div className="relative">
                    <StepVisual step={step} sizeClass="w-20 h-20 xl:w-24 xl:h-24" />
                    <span className="absolute -top-1 -right-1 z-20 w-7 h-7 rounded-full bg-landing-orange text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-bold text-duru-text-main leading-snug break-keep">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-duru-text-sub leading-relaxed break-keep">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* 모바일: 세로 타임라인 */}
        <div className="relative lg:hidden">
          <div
            aria-hidden
            className={`absolute left-7 top-7 bottom-7 border-l-2 border-dashed border-duru-orange-200 transition-opacity duration-700 delay-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <ol className="flex flex-col gap-8">
            {STEPS.map((step, index) => {
              const t = stepTransition(index);
              return (
                <li key={step.id} className={`flex gap-4 items-start ${t.className}`} style={t.style}>
                  <div className="relative shrink-0">
                    <StepVisual step={step} sizeClass="w-14 h-14" />
                    <span className="absolute -top-1 -right-1 z-20 w-5 h-5 rounded-full bg-landing-orange text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-duru-text-main leading-snug break-keep">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-duru-text-sub leading-relaxed break-keep">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
