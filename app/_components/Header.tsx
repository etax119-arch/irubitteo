import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Building2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo_tran.png"
            alt="이루빛터"
            width={1563}
            height={1563}
            className="h-[220px] w-auto -my-[40px] -ml-[30px]"
            priority
          />
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 text-lg font-semibold text-gray-600">
            <Link href="/gallery" className="hover:text-landing-orange transition-colors">빛터 갤러리</Link>
            <Link href="/newsletter" className="hover:text-landing-orange transition-colors">빛터 소식지</Link>
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
