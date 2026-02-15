import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/auth/store';
import { getQueryClient } from '@/lib/query/client';


// 커스텀 요청 설정 속성 (인터셉터에서 사용)
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _skipAuthRetry?: boolean;
    _retryCount?: number;
  }
  interface AxiosRequestConfig {
    _skipAuthRetry?: boolean;
  }
}

// Always use Next.js rewrite proxy so browser requests stay same-origin.
// This avoids CSP/CORS issues across local and Docker environments.
const API_BASE_URL = '/api/proxy';

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  withCredentials: true, // HttpOnly Cookie 전송을 위해 필수
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── 토큰 갱신 설정 ──
const REFRESH_CONFIG = {
  MAX_QUEUE_SIZE: 50,
  QUEUE_TIMEOUT_MS: 10_000,
  REFRESH_TIMEOUT_MS: 5_000,
  STAGGER_BASE_MS: 50,
  CIRCUIT_BREAKER_THRESHOLD: 3,
  CIRCUIT_BREAKER_RESET_MS: 30_000,
  PROACTIVE_REFRESH_BEFORE_MS: 2 * 60 * 1000,   // 만료 2분 전 갱신
  ACCESS_TOKEN_TTL_MS: 15 * 60 * 1000,           // 15분 (서버 설정과 동일)
} as const;

// ── 토큰 갱신 상태 ──
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
}> = [];
let consecutiveFailures = 0;
let circuitOpenUntil = 0;

// ── 서킷 브레이커 ──
function isCircuitOpen(): boolean {
  if (consecutiveFailures < REFRESH_CONFIG.CIRCUIT_BREAKER_THRESHOLD) return false;
  return Date.now() < circuitOpenUntil;
}

function recordRefreshSuccess() {
  consecutiveFailures = 0;
}

function recordRefreshFailure() {
  consecutiveFailures++;
  if (consecutiveFailures >= REFRESH_CONFIG.CIRCUIT_BREAKER_THRESHOLD) {
    circuitOpenUntil = Date.now() + REFRESH_CONFIG.CIRCUIT_BREAKER_RESET_MS;
  }
}

/** 로그인 성공 시 서킷 리셋 */
export function resetRefreshCircuit() {
  consecutiveFailures = 0;
  circuitOpenUntil = 0;
}

// ── 프로액티브 토큰 갱신 ──
let proactiveTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleProactiveRefresh() {
  cancelProactiveRefresh();
  const delay =
    REFRESH_CONFIG.ACCESS_TOKEN_TTL_MS - REFRESH_CONFIG.PROACTIVE_REFRESH_BEFORE_MS;
  proactiveTimer = setTimeout(performProactiveRefresh, delay);
}

export function cancelProactiveRefresh() {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}

async function performProactiveRefresh() {
  proactiveTimer = null;

  if (isCircuitOpen()) {
    proactiveTimer = setTimeout(performProactiveRefresh, REFRESH_CONFIG.CIRCUIT_BREAKER_RESET_MS);
    return;
  }

  if (isRefreshing) {
    proactiveTimer = setTimeout(performProactiveRefresh, REFRESH_CONFIG.REFRESH_TIMEOUT_MS);
    return;
  }

  isRefreshing = true;
  try {
    await apiClient.post('/auth/refresh', undefined, {
      timeout: REFRESH_CONFIG.REFRESH_TIMEOUT_MS,
      _skipAuthRetry: true,
    });
    recordRefreshSuccess();
    processQueue(null);
    scheduleProactiveRefresh();
  } catch (err) {
    recordRefreshFailure();
    drainQueue(err);
  } finally {
    isRefreshing = false;
  }
}

// ── 큐 처리 ──
function processQueue(error: unknown) {
  failedQueue.forEach((entry, index) => {
    clearTimeout(entry.timer);
    if (error) {
      entry.reject(error);
    } else {
      // 시차 재시도: 50ms 간격으로 resolve
      setTimeout(() => entry.resolve(), index * REFRESH_CONFIG.STAGGER_BASE_MS);
    }
  });
  failedQueue = [];
}

function drainQueue(error: unknown) {
  failedQueue.forEach((entry) => {
    clearTimeout(entry.timer);
    entry.reject(error);
  });
  failedQueue = [];
}

function clearAuthState() {
  cancelProactiveRefresh();
  useAuthStore.getState().clearUser();
  if (typeof window !== 'undefined') {
    getQueryClient().clear();
  }
}

// 요청 인터셉터: FormData 전송 시 Content-Type 제거 (브라우저가 boundary 포함하여 자동 설정)
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// ── 429 Rate Limit 재시도 설정 ──
const MAX_RATE_LIMIT_RETRIES = 3;
const RETRYABLE_METHODS = new Set(['get', 'head']);

function parseRetryAfter(header: string | string[] | undefined): number | null {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
  const date = new Date(value).getTime();
  if (!Number.isNaN(date)) {
    const delay = date - Date.now();
    return delay > 0 ? delay : null;
  }
  return null;
}

// 응답 인터셉터: 프로액티브 갱신 스케줄 + 429 재시도 + 401 토큰 갱신
apiClient.interceptors.response.use(
  (response) => {
    const url = response.config.url ?? '';
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
      scheduleProactiveRefresh();
    } else if (url.includes('/auth/me') && !proactiveTimer) {
      scheduleProactiveRefresh();
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // 429 Rate Limit — Axios에서만 재시도 (GET/HEAD만, 최대 3회)
    if (
      originalRequest &&
      error.response?.status === 429 &&
      RETRYABLE_METHODS.has(originalRequest.method?.toLowerCase() ?? '') &&
      (originalRequest._retryCount ?? 0) < MAX_RATE_LIMIT_RETRIES
    ) {
      originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
      const retryAfterMs = parseRetryAfter(error.response.headers['retry-after']);
      const delay = retryAfterMs
        ?? Math.min(1000 * 2 ** (originalRequest._retryCount - 1), 8000);
      await new Promise((r) => setTimeout(r, delay));
      return apiClient(originalRequest);
    }

    // 401 에러이고, 재시도하지 않은 요청이며, auth 요청이 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRetry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      // 서킷 오픈 → 즉시 거부
      if (isCircuitOpen()) {
        clearAuthState();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 큐 크기 초과 → 즉시 거부
        if (failedQueue.length >= REFRESH_CONFIG.MAX_QUEUE_SIZE) {
          return Promise.reject(error);
        }

        // 타임아웃과 함께 큐에 추가
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            const idx = failedQueue.findIndex((e) => e.timer === timer);
            if (idx !== -1) failedQueue.splice(idx, 1);
            reject(new Error('Token refresh queue timeout'));
          }, REFRESH_CONFIG.QUEUE_TIMEOUT_MS);

          failedQueue.push({ resolve, reject, timer });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 갱신 시도 (타임아웃 적용)
        await apiClient.post('/auth/refresh', undefined, {
          timeout: REFRESH_CONFIG.REFRESH_TIMEOUT_MS,
          _skipAuthRetry: true,
        });
        recordRefreshSuccess();
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        recordRefreshFailure();
        drainQueue(refreshError);
        clearAuthState();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
