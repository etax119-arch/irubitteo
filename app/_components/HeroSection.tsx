import Link from 'next/link';
import { Clock, FileText, ChevronRight } from 'lucide-react';
import HeroSlider from './HeroSlider';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="space-y-8 text-left">
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
            이루빛터는 장애인 근로자를 위한 맞춤형 일자리 매칭부터<br className="hidden sm:block"/>
            편리한 출퇴근 관리까지, 든든한 다리가 되어드립니다.
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
              href="/inquiry"
              className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded font-medium text-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              신규 기업 문의
            </Link>
          </div>
        </div>

        <HeroSlider />
      </div>
    </section>
  );
}
