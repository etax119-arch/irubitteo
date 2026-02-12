'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Users, Clock, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

const tabs = [
  { id: 'dashboard', label: '대시보드', icon: TrendingUp, href: '/company/dashboard' },
  { id: 'employees', label: '근로자 관리', icon: Users, href: '/company/employees' },
  { id: 'schedule', label: '근무일정관리', icon: Clock, href: '/company/schedule' },
  { id: 'notices', label: '공지사항', icon: MessageSquare, href: '/company/notices' },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // ⚠ useAuth()는 checkAuth() 호출 → isLoading=true → children 언마운트 가능.
  // 하위 페이지에서 user 정보만 필요하면 useAuthStore((s) => s.user) 직접 사용.
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [today, setToday] = useState('');
  useEffect(() => {
    const formatted = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: 서버에서 알 수 없는 클라이언트 날짜 설정
    setToday(formatted);
  }, []);

  const getActiveTab = () => {
    if (pathname.startsWith('/company/employees')) return 'employees';
    if (pathname.startsWith('/company/schedule')) return 'schedule';
    if (pathname.startsWith('/company/notices')) return 'notices';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login/company');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-duru-ivory">
        {/* 헤더 스켈레톤 */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div>
                  <Skeleton className="w-28 h-7 mb-1" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-8 rounded-lg" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>
        </header>
        {/* 탭 스켈레톤 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-24 h-6" />
              ))}
            </div>
          </div>
        </div>
        {/* 콘텐츠 스켈레톤 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-duru-ivory">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
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
                aria-current={activeTab === tab.id ? 'page' : undefined}
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
