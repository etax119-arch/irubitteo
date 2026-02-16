'use client';

import { useEffect, useRef, useState } from 'react';

const impactItems = [
  {
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: '함께 성장하는',
    subtitle: '일터',
    description: '발달장애인과 비장애인이 함께 일하며 서로의 가능성을 확장합니다',
    gradient: 'from-amber-500/10 to-orange-500/10'
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: '투명하고 체계적인',
    subtitle: '관리',
    description: '정확한 근무 기록과 급여 관리로 신뢰할 수 있는 환경을 만듭니다',
    gradient: 'from-orange-500/10 to-red-500/10'
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '지속 가능한',
    subtitle: '성과',
    description: '단순한 일자리를 넘어 장기적인 커리어와 성장을 지원합니다',
    gradient: 'from-red-500/10 to-pink-500/10'
  }
];

const stats = [
  { value: '287명', label: '누적 고용', suffix: '+' },
  { value: '94%', label: '만족도', suffix: '' },
  { value: '3년', label: '평균 근속', suffix: '+' }
];

export default function StorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-duru-ivory/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-20">
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-duru-orange-50 to-amber-50 border border-duru-orange-100 rounded-full text-duru-orange-600 text-sm font-semibold mb-6 shadow-sm">
            IMPACT
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            이루빛터가 만드는
            <br />
            <span className="bg-gradient-to-r from-duru-orange-600 to-amber-600 bg-clip-text text-transparent">
              변화
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            일자리를 넘어선 기회, 고용을 넘어선 성장.
            <br className="hidden sm:block" />
            이루빛터는 지속 가능한 변화를 만들어갑니다.
          </p>
        </div>

        {/* 임팩트 카드 */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {impactItems.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 hover:border-duru-orange-200 transition-all duration-500 hover:shadow-xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`
              }}
            >
              {/* 배경 그라데이션 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* 아이콘 */}
                <div className="mb-6 text-duru-orange-600 group-hover:text-duru-orange-700 transition-colors duration-300 group-hover:scale-110 transform transition-transform">
                  {item.icon}
                </div>

                {/* 제목 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-duru-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                  {item.subtitle}
                </div>

                {/* 설명 */}
                <p className="text-gray-600 leading-relaxed break-keep">
                  {item.description}
                </p>
              </div>

              {/* 데코레이션 라인 */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-duru-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        {/* 통계 */}
        <div className="relative">
          {/* 배경 블러 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-duru-orange-500/5 via-amber-500/5 to-red-500/5 rounded-3xl blur-3xl" />

          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-10 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center group ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } transition-all duration-700`}
                  style={{
                    transitionDelay: `${600 + idx * 100}ms`
                  }}
                >
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-duru-orange-600 to-amber-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                    <span className="text-3xl">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-600 font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}