import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-duru-orange-600">두루빛터</div>
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 text-lg font-semibold text-gray-600">
            <a href="#" className="hover:text-duru-orange-600 transition-colors">신규 기업 문의</a>
            <a href="#" className="hover:text-duru-orange-600 transition-colors">채용정보</a>
            <a href="#" className="hover:text-duru-orange-600 transition-colors">고객센터</a>
          </nav>
          <Link
            href="/login/admin"
            className="text-base font-semibold text-white bg-duru-orange-500 px-6 py-2.5 rounded hover:bg-duru-orange-600 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Shield className="w-4 h-4" />
            두루빛 관리자
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
