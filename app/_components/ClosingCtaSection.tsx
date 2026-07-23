'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, FileText } from 'lucide-react';

type ClosingCtaVariant = 'cards' | 'banner' | 'split';

interface ClosingCtaSectionProps {
  variant?: ClosingCtaVariant;
}

const SEEKER = {
  href: '/resume',
  eyebrow: '장애인 구직자',
  title: '나에게 맞는 일자리를 찾고 계신가요?',
  desc: '상담부터 취업, 근태 관리까지 원스톱으로 도와드려요.',
  features: ['맞춤형 직무 추천 및 상담', '이력서 등록 및 기업 매칭', '취업 후 적응 지원 프로그램'],
  cta: '이력서 등록 바로가기',
  icon: FileText,
} as const;

const COMPANY = {
  href: '/inquiry',
  eyebrow: '기업',
  title: '함께할 인재를 찾고 계신가요?',
  desc: '장애인 고용을 통해 사회적 가치를 실현하도록 지원해요.',
  features: ['직무 분석 및 인재 매칭', '안정적인 근로 관리', '통합 근태·인사 관리 시스템'],
  cta: '신규 기업 문의 신청',
  icon: Building2,
} as const;

function useReveal() {
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

  return { isVisible, sectionRef };
}

/* ─────────────────────────── variant: cards ─────────────────────────── */
function CardsVariant({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 break-keep">
          이제 <span className="text-landing-orange">이루빛터</span>와 함께 시작해요
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed break-keep">
          구직자와 기업 모두, 여기서 다음 걸음을 내디딜 수 있어요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {[SEEKER, COMPANY].map((item, index) => {
          const isCompany = item === COMPANY;
          const Icon = item.icon;

          return (
            <div
              key={item.href}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${150 + index * 120}ms` : '0ms' }}
            >
              <div className="h-full flex flex-col rounded-2xl bg-white border border-duru-orange-100 shadow-soft p-8 lg:p-10 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-duru-orange-200">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-duru-orange-50 text-landing-orange">
                  <Icon aria-hidden className="w-6 h-6" />
                </span>
                <span className="mt-5 text-sm font-semibold text-landing-orange">{item.eyebrow}</span>
                <h3 className="mt-1 text-2xl font-bold text-duru-text-main break-keep leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3 text-base text-duru-text-sub break-keep leading-relaxed">
                  {item.desc}
                </p>
                <ul className="mt-6 space-y-3 text-duru-text-main">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 break-keep">
                      <span className="w-1.5 h-1.5 rounded-full bg-landing-orange shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={item.href}
                  className={`group mt-8 inline-flex items-center justify-center gap-2 w-full py-4 text-lg font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-duru-orange-500 ${
                    isCompany
                      ? 'bg-landing-orange text-white hover:bg-duru-orange-600 shadow-md'
                      : 'bg-white border-2 border-landing-orange text-landing-orange hover:bg-duru-orange-50'
                  }`}
                >
                  {item.cta}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── variant: banner ─────────────────────────── */
function BannerVariant({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 break-keep leading-tight">
        가능성이 일상의 빛이 되는 곳,
        <br />
        지금 이루빛터와 함께 시작해요
      </h2>
      <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed break-keep mb-10">
        구직자에게는 맞춤형 일자리를, 기업에게는 꼭 맞는 인재를 이어드려요.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={SEEKER.href}
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-white text-landing-orange shadow-md hover:bg-duru-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-landing-orange focus:ring-white"
        >
          <FileText className="w-5 h-5" />
          이력서 등록하기
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href={COMPANY.href}
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-transparent text-white border-2 border-white/80 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-landing-orange focus:ring-white"
        >
          <Building2 className="w-5 h-5" />
          기업 문의하기
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────── variant: split ─────────────────────────── */
function SplitPanel({
  item,
  tone,
  isVisible,
  delay,
}: {
  item: typeof SEEKER | typeof COMPANY;
  tone: 'orange' | 'ivory';
  isVisible: boolean;
  delay: number;
}) {
  const isOrange = tone === 'orange';

  return (
    <Link
      href={item.href}
      className={`group flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-16 lg:py-20 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${
        isOrange
          ? 'bg-landing-orange text-white hover:bg-duru-orange-600'
          : 'bg-duru-orange-50 text-duru-text-main hover:bg-duru-orange-100'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      <div className="max-w-md mx-auto w-full">
        <span
          className={`block text-sm font-semibold ${
            isOrange ? 'text-white/80' : 'text-landing-orange'
          }`}
        >
          {item.eyebrow}
        </span>
        <h3 className="mt-1 text-2xl sm:text-3xl font-bold break-keep leading-snug">
          {item.title}
        </h3>
        <p
          className={`mt-4 text-base sm:text-lg break-keep leading-relaxed ${
            isOrange ? 'text-white/90' : 'text-duru-text-sub'
          }`}
        >
          {item.desc}
        </p>
        <span
          className={`mt-8 inline-flex items-center gap-2 text-lg font-bold ${
            isOrange ? 'text-white' : 'text-landing-orange'
          }`}
        >
          {item.cta}
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────────── section ─────────────────────────── */
export default function ClosingCtaSection({ variant = 'cards' }: ClosingCtaSectionProps) {
  const { isVisible, sectionRef } = useReveal();

  if (variant === 'split') {
    return (
      <section
        ref={sectionRef}
        className="grid md:grid-cols-2 pt-16 lg:pt-24 bg-white"
        aria-label="이루빛터 시작하기"
      >
        <SplitPanel item={SEEKER} tone="orange" isVisible={isVisible} delay={100} />
        <SplitPanel item={COMPANY} tone="ivory" isVisible={isVisible} delay={220} />
      </section>
    );
  }

  const bgClass =
    variant === 'banner'
      ? 'bg-gradient-to-br from-landing-orange to-duru-orange-600'
      : 'bg-duru-orange-50';

  return (
    <section ref={sectionRef} className={`min-h-screen flex items-center py-32 ${bgClass}`}>
      {variant === 'banner' ? (
        <BannerVariant isVisible={isVisible} />
      ) : (
        <CardsVariant isVisible={isVisible} />
      )}
    </section>
  );
}
