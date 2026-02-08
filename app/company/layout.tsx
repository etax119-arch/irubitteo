'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Users, Clock, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const tabs = [
  { id: 'dashboard', label: '대시보드', icon: TrendingUp, href: '/company/dashboard' },
  { id: 'employees', label: '근로자 관리', icon: Users, href: '/company/employees' },
  { id: 'schedule', label: '근무일정관리', icon: Clock, href: '/company/schedule' },
  { id: 'notices', label: '공지사항', icon: MessageSquare, href: '/company/notices' },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [today, setToday] = useState('');
  useEffect(() => {
    setToday(new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  const getActiveTab = () => {
    if (pathname.startsWith('/company/employees')) return 'employees';
    if (pathname.startsWith('/company/schedule')) return 'schedule';
    if (pathname.startsWith('/company/notices')) return 'notices';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-duru-ivory">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">기업 관리자</h1>
                <p className="text-sm text-gray-600">{user?.name ?? ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{today}</span>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<LogOut className="w-4 h-4" />}
                onClick={logout}
              >
                로그아웃
              </Button>
              <div className="w-10 h-10 bg-duru-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-duru-orange-600">관</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-duru-orange-500 text-duru-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-semibold">{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
