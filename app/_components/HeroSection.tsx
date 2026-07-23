import Link from 'next/link';
import Image from 'next/image';
import { Clock, FileUp, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative isolate flex items-center min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/images/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center z-0"
      />
      {/* 가독성 오버레이 (왼쪽 아이보리 → 오른쪽 투명) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-duru-ivory via-duru-ivory/85 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-xl space-y-8 text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-12 h-[2px] bg-landing-orange"></span>
            <span className="text-landing-orange font-bold tracking-[0.2em] text-sm uppercase">
              IRUBITTEO : SHINING TOGETHER
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-[1.3] tracking-tight text-gray-900 break-keep">
            장애인 근로자와 기업이<br/>
            <span className="text-landing-orange">함께 빛나는</span> 일터
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed break-keep max-w-xl">
            가능성이 일상의 빛이 되는 곳, 이루빛터에서는<br className="hidden sm:block"/>
            장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여<br className="hidden sm:block"/>
            빛나는 내일을 함께 합니다.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/login/employee"
              className="px-8 py-4 bg-landing-orange text-white rounded font-medium text-lg hover:bg-landing-orange/90 transition-colors shadow-soft flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              출퇴근 하기
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/resume"
              className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded font-medium text-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <FileUp className="w-5 h-5" />
              이력서 등록하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
