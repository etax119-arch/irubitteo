'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Building2, Users, BarChart3, Bell, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const tabs = [
  { id: 'dashboard', label: '대시보드', icon: TrendingUp, href: '/admin/dashboard' },
  { id: 'companies', label: '회원사 관리', icon: Building2, href: '/admin/companies' },
  { id: 'employees', label: '근로자 관리', icon: Users, href: '/admin/employees' },
  { id: 'workstats', label: '근무 통계', icon: BarChart3, href: '/admin/workstats' },
  { id: 'notifications', label: '알림센터', icon: Bell, href: '/admin/notifications' },
  { id: 'reports', label: '리포트', icon: FileText, href: '/admin/reports' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [hasNewNotification, setHasNewNotification] = useState(true);

  const getActiveTab = () => {
    if (pathname.startsWith('/admin/companies')) return 'companies';
    if (pathname.startsWith('/admin/employees')) return 'employees';
    if (pathname.startsWith('/admin/workstats')) return 'workstats';
    if (pathname.startsWith('/admin/notifications')) return 'notifications';
    if (pathname.startsWith('/admin/reports')) return 'reports';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (activeTab === 'notifications') {
      setHasNewNotification(false);
    }
  }, [activeTab]);

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
                <h1 className="text-2xl font-bold text-gray-900">이루빛터 관리자</h1>
                <p className="text-sm text-gray-600">통합 관리 시스템</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">2026년 1월 28일</span>
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
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-duru-orange-500 text-duru-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="relative font-semibold">
                  {tab.label}
                  {tab.id === 'notifications' && hasNewNotification && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </span>
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
