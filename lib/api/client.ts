import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/auth/store';

// 커스텀 요청 설정 속성 (인터셉터에서 사용)
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _skipAuthRetry?: boolean;
  }
  interface AxiosRequestConfig {
    _skipAuthRetry?: boolean;
  }
}

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api/proxy'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1');

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  withCredentials: true, // HttpOnly Cookie 전송을 위해 필수
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중인지 추적
let isRefreshing = false;
// 갱신 대기 중인 요청들
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// 요청 인터셉터: FormData 전송 시 Content-Type 제거 (브라우저가 boundary 포함하여 자동 설정)
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // 401 에러이고, 재시도하지 않은 요청이며, refresh 요청이 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRetry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // 이미 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 갱신 시도
        await apiClient.post('/auth/refresh');
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // 갱신 실패 시 로그아웃 처리 (쿠키 삭제는 서버에서 처리)
        useAuthStore.getState().clearUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
