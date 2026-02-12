'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/Skeleton';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // ⚠ useAuth()는 checkAuth() 호출 → isLoading=true → children 언마운트 가능.
  // 하위 페이지에서 user 정보만 필요하면 useAuthStore((s) => s.user) 직접 사용.
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login/employee');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-duru-ivory px-4 py-6" role="status">
        <span className="sr-only">로딩 중</span>
        {/* HeaderCard 스켈레톤 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="w-40 h-6" />
            <Skeleton className="w-16 h-8 rounded-lg" />
          </div>
          <Skeleton className="w-32 h-4" />
        </div>
        {/* AttendanceButtons 스켈레톤 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        {/* NoticeSection 스켈레톤 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <Skeleton className="w-24 h-5 mb-3" />
          <Skeleton className="w-full h-16 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
