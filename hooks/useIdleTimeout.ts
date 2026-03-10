'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/lib/auth/store';
import { authApi } from '@/lib/api/auth';
import { clearAuthState } from '@/lib/api/client';

// 서버와 동일한 기준: 5시간 + 5분 여유 (서버 ping 오차 대칭)
// cf. client.ts REFRESH_CONFIG.IDLE_TIMEOUT_MS는 5시간 (프로액티브 갱신 중단용, 여유 없음)
const IDLE_TIMEOUT_MS = 5 * 60 * 60 * 1000 + 5 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 1000;
const LOCAL_THROTTLE_MS = 30 * 1000;
const SERVER_PING_INTERVAL_MS = 5 * 60 * 1000;

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;

export function useIdleTimeout(onTimeout: () => void) {
  const localThrottleRef = useRef(0);
  const serverPingRef = useRef(0);
  const logoutInProgressRef = useRef(false);

  const safeTimeout = useCallback(() => {
    if (logoutInProgressRef.current) return;
    logoutInProgressRef.current = true;
    onTimeout();
  }, [onTimeout]);

  // 재로그인 시 logoutInProgressRef 리셋
  useEffect(() => {
    const unsub = useAuthStore.subscribe((state) => {
      if (state.isAuthenticated) {
        logoutInProgressRef.current = false;
      }
    });
    return unsub;
  }, []);

  const handleActivity = useCallback(() => {
    const now = Date.now();

    // 로컬 활동 기록 (30초 throttle)
    if (now - localThrottleRef.current >= LOCAL_THROTTLE_MS) {
      localThrottleRef.current = now;
      useAuthStore.getState().recordActivity();
    }

    // 서버 ping (5분 throttle)
    if (now - serverPingRef.current >= SERVER_PING_INTERVAL_MS) {
      serverPingRef.current = now;
      authApi.recordActivity().catch(() => {});
    }
  }, []);

  useEffect(() => {
    // idle 상태 확인 후 safeTimeout 호출
    const checkIdle = () => {
      const { lastActivityAt, isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated || !lastActivityAt) return;
      if (Date.now() - lastActivityAt >= IDLE_TIMEOUT_MS) {
        safeTimeout();
      }
    };

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, handleActivity, { passive: true });
    }

    // 주기적 idle 체크
    const intervalId = setInterval(checkIdle, CHECK_INTERVAL_MS);

    // 탭 복귀 시 즉시 체크
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkIdle();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 탭 간 lastActivityAt 동기화 (storage 이벤트)
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== 'auth-storage' || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        const remoteLastActivity = parsed?.state?.lastActivityAt;
        if (typeof remoteLastActivity === 'number') {
          const local = useAuthStore.getState().lastActivityAt;
          if (!local || remoteLastActivity > local) {
            useAuthStore.setState({ lastActivityAt: remoteLastActivity });
          }
        }
        // 다른 탭에서 로그아웃한 경우
        if (parsed?.state?.isAuthenticated === false) {
          const { isAuthenticated } = useAuthStore.getState();
          if (isAuthenticated) {
            clearAuthState();
            window.location.href = '/';
          }
        }
      } catch { /* JSON 파싱 실패 무시 */ }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, handleActivity);
      }
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('storage', handleStorage);
    };
  }, [handleActivity, safeTimeout]);
}
