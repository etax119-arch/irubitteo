import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { authKeys } from '@/lib/query/keys';
import type { AuthUser } from '@/types/auth';

export function useAuthQuery(enabled: boolean = true) {
  return useQuery<AuthUser>({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getMe(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
}
