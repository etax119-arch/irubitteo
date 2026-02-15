'use client';

import { useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/auth/store';
import { authApi, type LoginParams } from '@/lib/api/auth';
import { cancelProactiveRefresh } from '@/lib/api/client';
import { authKeys } from '@/lib/query/keys';
import { useAuthQuery } from './useAuthQuery';
import type { UserRole } from '@/types/auth';

// 역할별 리다이렉트 경로
const REDIRECT_PATHS: Record<UserRole, string> = {
  admin: '/admin',
  company: '/company',
  employee: '/employee',
};

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } =
    useAuthStore();

  // 로그인 페이지에서는 /auth/me 호출 차단
  const isLoginPage = pathname.startsWith('/login');
  const authQuery = useAuthQuery(!isLoginPage);

  // TanStack Query 결과를 Zustand에 동기화
  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    if (authQuery.isSuccess && authQuery.data) {
      setUser(authQuery.data);
    } else if (authQuery.isError) {
      if (authQuery.error instanceof AxiosError && authQuery.error.response?.status === 401) {
        clearUser();
      } else {
        // 네트워크 오류 등은 기존 인증 상태 유지
        setLoading(false);
      }
    }
  }, [isLoginPage, authQuery.isSuccess, authQuery.isError, authQuery.data, authQuery.error, setUser, clearUser, setLoading]);

  /**
   * 로그인
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

        // 캐시에 직접 설정 (이후 탭 이동 시 API 호출 없음)
        queryClient.setQueryData(authKeys.me(), response.user);

        // 역할별 대시보드로 리다이렉트
        router.push(REDIRECT_PATHS[response.user.role]);
      } finally {
        setLoading(false);
      }
    },
    [router, queryClient, setUser, setLoading]
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
      cancelProactiveRefresh();
      clearUser();
      await queryClient.cancelQueries();
      queryClient.clear();
      router.push('/');
    }
  }, [router, queryClient, clearUser]);

  /**
   * 인증 상태 확인 (앱 초기화 시 호출)
   */
  const checkAuth = useCallback(async (): Promise<void> => {
    if (!useAuthStore.getState().isAuthenticated) {
      setLoading(true);
    }

    try {
      const user = await queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: () => authApi.getMe(),
      });
      setUser(user);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        clearUser();
      }
    } finally {
      setLoading(false);
    }
  }, [queryClient, setUser, clearUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}
