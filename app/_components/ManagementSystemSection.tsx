'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** 세로형 이미지는 상단 기준으로 크롭 */
  objectPosition?: string;
}

const FEATURES: Feature[] = [
  {
    id: 'workers',
    title: '근로자 관리',
    description:
      '우리 회사 근로자의 프로필과 근무 정보, 특이사항까지 한 곳에서 꼼꼼하게 살펴보세요.',
    image: '/images/management/employee-management.png',
    imageAlt: '근로자 관리 페이지 화면 — 근로자 목록과 장애유형, 근무 상태 확인',
  },
  {
    id: 'attendance',
    title: '출퇴근 기록',
    description:
      '근로자가 앱으로 남긴 출퇴근 기록이 실시간으로 정리되어, 오늘의 근태를 바로 확인할 수 있어요.',
    image: '/images/management/attendance-records.png',
    imageAlt: '출퇴근 기록 페이지 화면 — 날짜별 출근·퇴근 시간과 상태 목록',
    objectPosition: 'object-top',
  },
  {
    id: 'schedule',
    title: '근무 일정',
    description:
      '달력에서 근로자별 일정을 한눈에 — 등록과 조정도 클릭 몇 번이면 충분해요.',
    image: '/images/management/schedule-management.png',
    imageAlt: '근무 일정 관리 페이지 화면 — 월간 달력과 날짜별 업무 지시서',
  },
  {
    id: 'notices',
    title: '공지사항',
    description:
      '안전교육, 행사 소식을 근로자 앱으로 바로 전해 중요한 안내를 놓치지 않아요.',
    image: '/images/management/notice-management.png',
    imageAlt: '공지사항 관리 페이지 화면 — 발송 대상 근로자 선택과 공지 작성',
  },
];

export default function ManagementSystemSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(FEATURES[0].id);
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

  const activeFeature = FEATURES.find((f) => f.id === activeTab) ?? FEATURES[0];

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center py-32 bg-gradient-to-b from-white to-duru-orange-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            근로자의 하루를 <span className="text-landing-orange">한눈에</span>, 관리는 더 가볍게
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            이루빛터 회원사에게 제공되는 근로자 관리 시스템으로,{' '}
            <br className="hidden sm:block" />
            채용 이후의 일상까지 함께 살핍니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* 기능 메뉴 */}
          <div
            role="tablist"
            aria-label="관리 시스템 기능"
            className={`lg:col-span-4 grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:gap-3 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {FEATURES.map((feature) => {
              const isActive = feature.id === activeTab;
              return (
                <button
                  key={feature.id}
                  type="button"
                  role="tab"
                  id={`management-tab-${feature.id}`}
                  aria-selected={isActive}
                  aria-controls="management-tabpanel"
                  onClick={() => setActiveTab(feature.id)}
                  className={`text-center lg:text-left rounded-2xl px-4 py-3 lg:px-6 lg:py-5 border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-orange ${
                    isActive
                      ? 'bg-white border-landing-orange shadow-soft lg:border lg:border-l-4'
                      : 'bg-white/50 border-transparent hover:bg-white/80'
                  }`}
                >
                  <span
                    className={`block font-bold text-base lg:text-lg ${
                      isActive ? 'text-landing-orange' : 'text-duru-text-main'
                    }`}
                  >
                    {feature.title}
                  </span>
                  <span className="hidden lg:block mt-1.5 text-sm leading-relaxed text-duru-text-sub">
                    {feature.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 모바일: 활성 탭 설명 */}
          <p className="lg:hidden text-sm text-duru-text-sub text-center leading-relaxed px-2">
            {activeFeature.description}
          </p>

          {/* 스크린샷 프레임 */}
          <div
            role="tabpanel"
            id="management-tabpanel"
            aria-labelledby={`management-tab-${activeFeature.id}`}
            className={`lg:col-span-8 relative aspect-[3/2] w-full rounded-2xl overflow-hidden bg-white shadow-soft border border-duru-orange-100 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {FEATURES.map((feature) => {
              const isActive = feature.id === activeTab;
              return (
                <Image
                  key={feature.id}
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  aria-hidden={!isActive}
                  className={`object-cover transition-opacity duration-300 ease-out ${
                    feature.objectPosition ?? ''
                  } ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
