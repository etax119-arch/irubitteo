'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { authApi, type LoginParams } from '@/lib/api/auth';
import type { UserRole } from '@/types/auth';

// 역할별 리다이렉트 경로
const REDIRECT_PATHS: Record<UserRole, string> = {
  admin: '/admin',
  company: '/company',
  employee: '/employee',
};

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } =
    useAuthStore();

  /**
   * 로그인
   * @param type - 로그인 타입 (admin, company, employee)
   * @param identifier - 식별자 (관리자: 이메일, 기업/직원: 코드)
   * @param password - 비밀번호 (관리자만)
   */
  const login = useCallback(
    async (
      type: UserRole,
      identifier: string,
      password?: string
    ): Promise<void> => {
      setLoading(true);

      try {
        let params: LoginParams;

        if (type === 'admin') {
          if (!password) {
            throw new Error('관리자 로그인에는 비밀번호가 필요합니다.');
          }
          params = { type: 'admin', email: identifier, password };
        } else {
          params = { type, code: identifier };
        }

        const response = await authApi.login(params);
        setUser(response.user);

        // 역할별 대시보드로 리다이렉트
        router.push(REDIRECT_PATHS[response.user.role]);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [router, setUser, setLoading]
  );

  /**
   * 로그아웃
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // 로그아웃 API 실패해도 클라이언트 상태는 정리
    } finally {
      clearUser();
      router.push('/');
    }
  }, [router, clearUser]);

  /**
   * 인증 상태 확인 (앱 초기화 시 호출)
   */
  const checkAuth = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const user = await authApi.getMe();
      setUser(user);
    } catch {
      clearUser();
    }
  }, [setUser, clearUser, setLoading]);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    // localStorage에 저장된 상태가 있어도 서버에서 확인
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}

export default useAuth;
