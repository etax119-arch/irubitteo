'use client';

import { Clock, Building2, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const services = [
  {
    icon: Clock,
    title: "스마트 출퇴근 관리",
    desc: "모바일 앱으로 간편하게 출퇴근을 기록하고 근무 일정을 관리합니다.",
    gradient: "from-landing-orange/10 to-landing-orange/10",
    iconColor: "text-landing-orange"
  },
  {
    icon: Building2,
    title: "기업·기관 채용 연계",
    desc: "장애인 고용을 희망하는 우수 기업 및 공공기관과 협력합니다.",
    gradient: "from-landing-orange/10 to-landing-orange/10",
    iconColor: "text-landing-orange"
  },
  {
    icon: HeartHandshake,
    title: "안정적인 근무 지원",
    desc: "취업 후에도 지속적인 상담과 모니터링으로 적응을 돕습니다.",
    gradient: "from-landing-orange/10 to-landing-orange/10",
    iconColor: "text-landing-orange"
  }
];

const stats = [
  { value: '1,200', label: '장애인 고용 사업장', suffix: '+' },
  { value: '94%', label: '만족도', suffix: '' },
  { value: '3년', label: '평균 근속', suffix: '+' }
];

export default function ServiceSection() {
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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-duru-ivory/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 - 이루빛터 의미 중심 */}
        <div className="text-center mb-20">
          <div className="inline-block px-5 py-2 bg-landing-orange/10 border border-landing-orange/30 rounded-full text-landing-orange text-base font-semibold mb-6 shadow-sm">
            ABOUT
          </div>
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

        {/* 서비스 카드 그리드 - 3개 */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className={`group relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 hover:border-landing-orange/40 transition-all duration-500 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${800 + idx * 150}ms`
                }}
              >
                {/* 배경 그라데이션 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* 아이콘 */}
                  <div className={`mb-6 ${service.iconColor} group-hover:text-landing-orange transition-colors duration-300 group-hover:scale-110 transform transition-transform`}>
                    <Icon className="w-12 h-12" />
                  </div>

                  {/* 제목 */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>

                  {/* 설명 */}
                  <p className="text-base text-gray-600 leading-relaxed break-keep">
                    {service.desc}
                  </p>
                </div>

                {/* 데코레이션 라인 */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-landing-orange to-landing-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>

        {/* 통계 */}
        <div className="relative mt-20">
          {/* 배경 블러 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-landing-orange/5 via-landing-orange/10 to-landing-orange/5 rounded-3xl blur-3xl" />

          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-10 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center group ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } transition-all duration-700`}
                  style={{
                    transitionDelay: `${1200 + idx * 100}ms`
                  }}
                >
                  <div className="text-5xl md:text-6xl font-bold text-landing-orange mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                    <span className="text-3xl">{stat.suffix}</span>
                  </div>
                  <div className="text-lg text-gray-600 font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA 영역 */}
        <div className={`mt-16 text-center ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transition-all duration-700 delay-500`}>
          <p className="text-lg text-gray-600 mb-6">
            더 자세한 서비스 내용이 궁금하신가요?
          </p>
          <a
            href="/inquiry"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-landing-orange text-white font-semibold rounded-xl hover:bg-landing-orange/90 hover:shadow-lg hover:scale-105 transition-all duration-300"
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
