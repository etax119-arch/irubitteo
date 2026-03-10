import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivityAt: number | null;
}

interface AuthActions {
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  recordActivity: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 상태
      user: null,
      isAuthenticated: false,
      isLoading: true, // 초기 로딩 상태
      lastActivityAt: null,

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
          lastActivityAt: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      recordActivity: () => set({ lastActivityAt: Date.now() }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user, // 프로필 정보 영속화 (자격증명 아님, 토큰은 HttpOnly 쿠키)
        lastActivityAt: state.lastActivityAt,
      }),
      onRehydrateStorage: () => {
        return () => {
          useAuthStore.setState({ isLoading: false });
        };
      },
    }
  )
);
