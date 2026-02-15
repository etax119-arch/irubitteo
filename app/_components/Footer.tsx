import { Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 text-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h5 className="text-white font-bold text-xl mb-4">이루빛터</h5>
            <p className="leading-relaxed mb-4 max-w-sm">
              장애인 근로자의 안정적인 일자리와<br/>
              효율적인 근태 관리를 지원하는 고용 플랫폼입니다.
            </p>
          </div>
          <div>
            <h6 className="text-white font-bold mb-4 text-lg">서비스</h6>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">일자리 찾기</a></li>
              <li><a href="#" className="hover:text-white">근태관리 안내</a></li>
              <li><a href="#" className="hover:text-white">기업 채용 문의</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-bold mb-4 text-lg">문의처</h6>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Mail className="w-5 h-5"/> etax119@gmail.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-5 h-5"/> 서울특별시 성동구 아차산로17길 49, 1509호, 1510호, 1511호, 1512호 (성수동2가, 생각공장 데시앙플렉스)</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Iru-bit-teo. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/policies/terms" className="hover:text-white">이용약관</Link>
            <Link href="/policies/privacy" className="hover:text-white">개인정보처리방침</Link>
            <Link href="/policies/accessibility" className="hover:text-white">웹접근성정책</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
