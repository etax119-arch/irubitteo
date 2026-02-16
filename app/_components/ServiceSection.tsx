'use client';

import { Briefcase, Clock, Building2, HeartHandshake } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const services = [
  {
    icon: Briefcase,
    title: "맞춤 일자리 연결",
    desc: "직무 능력과 희망 조건을 고려한 최적의 일자리를 매칭해 드립니다.",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-duru-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
  {
    icon: Clock,
    title: "스마트 출퇴근 관리",
    desc: "모바일 앱으로 간편하게 출퇴근을 기록하고 근무 일정을 관리합니다.",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-duru-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
  {
    icon: Building2,
    title: "기업·기관 채용 연계",
    desc: "장애인 고용을 희망하는 우수 기업 및 공공기관과 협력합니다.",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-duru-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  },
  {
    icon: HeartHandshake,
    title: "안정적인 근무 지원",
    desc: "취업 후에도 지속적인 상담과 모니터링으로 적응을 돕습니다.",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-duru-orange-600",
    bgGradient: "from-orange-50 to-amber-50"
  }
];

export default function ServiceSection() {
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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-duru-ivory/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-20">
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-duru-orange-50 to-amber-50 border border-duru-orange-100 rounded-full text-duru-orange-600 text-sm font-semibold mb-6 shadow-sm">
            SERVICES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            주요 서비스 안내
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            안정적인 직업 생활을 위한
            <br className="hidden sm:block" />
            <span className="font-semibold text-duru-orange-600">통합 서비스</span>를 제공합니다.
          </p>
        </div>

        {/* 서비스 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className={`group relative overflow-hidden bg-white rounded-2xl p-8 border border-gray-100 hover:border-duru-orange-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${idx * 100}ms`
                }}
              >
                {/* 배경 그라데이션 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* 아이콘 */}
                  <div className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-br ${service.bgGradient} border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon className={`w-8 h-8 ${service.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  {/* 제목 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-duru-orange-700 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* 설명 */}
                  <p className="text-gray-600 text-sm leading-relaxed break-keep">
                    {service.desc}
                  </p>
                </div>

                {/* 데코레이션 */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-duru-orange-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-duru-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>

        {/* CTA 영역 */}
        <div className={`mt-16 text-center ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700 delay-500`}>
          <p className="text-gray-600 mb-6">
            더 자세한 서비스 내용이 궁금하신가요?
          </p>
          <a
            href="/inquiry"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-duru-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>서비스 문의하기</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
