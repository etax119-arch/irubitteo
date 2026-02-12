import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { extractErrorMessage } from '@/lib/api/error';
import { useToastStore } from '@/components/ui/Toast';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 30 * 60 * 1000, // 30분
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // 4xx 에러는 재시도하지 않음
          if (error instanceof AxiosError && error.response?.status && error.response.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        onError: (error) => {
          // 전역 mutation 에러 토스트 — 개별 onError 오버라이드 시 호출되지 않음
          useToastStore.getState().addToast(extractErrorMessage(error), 'error');
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // Server: always create a new client
  if (typeof window === 'undefined') return makeQueryClient();
  // Browser: singleton
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
