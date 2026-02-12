import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 상태
      user: null,
      isAuthenticated: false,
      isLoading: true, // 초기 로딩 상태

      // 액션
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user, // 프로필 정보 영속화 (자격증명 아님, 토큰은 HttpOnly 쿠키)
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error && state?.isAuthenticated) {
            // 영속화된 인증 데이터가 있으면 로딩 즉시 해제
            useAuthStore.setState({ isLoading: false });
          }
        };
      },
    }
  )
);

// 로그아웃 이벤트 리스너 (client.ts에서 발생시킴)
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearUser();
  });
}
