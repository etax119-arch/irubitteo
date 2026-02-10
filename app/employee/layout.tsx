'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-duru-ivory flex items-center justify-center" role="status">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duru-orange-500" />
        <span className="sr-only">로딩 중</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
