import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Building2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/30 backdrop-blur-md border-b border-white/40 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo_tran.png"
            alt="이루빛터"
            width={1563}
            height={1563}
            className="h-[220px] w-auto -my-[40px] -ml-[30px]"
            priority
          />
        </Link>

        <div className="flex items-center gap-4 lg:gap-8">
          {/* 항목이 4개라 md에서는 글자·간격을 줄여 헤더가 잘리지 않게 함 */}
          <nav aria-label="메인 네비게이션" className="hidden md:flex items-center gap-4 lg:gap-8 text-base lg:text-lg font-semibold text-gray-600 whitespace-nowrap">
            <Link href="/gallery" className="hover:text-landing-orange transition-colors">빛터 갤러리</Link>
            <Link href="/newsletter" className="hover:text-landing-orange transition-colors">빛터 소식지</Link>
            <Link href="/story" className="hover:text-landing-orange transition-colors">빛터 이야기</Link>
            <Link href="/inquiry" className="hover:text-landing-orange transition-colors">신규기업 문의</Link>
          </nav>
          <Link
            href="/login/company"
            className="text-xs sm:text-base font-semibold text-white bg-landing-orange px-3 sm:px-6 h-10 rounded hover:bg-landing-orange/90 transition-colors flex items-center gap-1 sm:gap-2 shadow-sm whitespace-nowrap"
          >
            <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
            제휴 회원 페이지
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
