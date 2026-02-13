import { useQuery } from '@tanstack/react-query';
import { getAdminAccounts } from '@/lib/api/admin';
import { adminKeys } from '@/lib/query/keys';

const ADMIN_ACCOUNTS_STALE_TIME = 60 * 1000;

export function useAdminAccounts() {
  return useQuery({
    queryKey: adminKeys.accounts(),
    queryFn: getAdminAccounts,
    staleTime: ADMIN_ACCOUNTS_STALE_TIME,
  });
}
