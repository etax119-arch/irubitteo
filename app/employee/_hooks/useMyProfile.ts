import { useQuery } from '@tanstack/react-query';
import { getMyEmployeeProfile } from '@/lib/api/employees';
import { employeeKeys } from '@/lib/query/keys';

export function useMyProfile() {
  return useQuery({
    queryKey: employeeKeys.me(),
    queryFn: () => getMyEmployeeProfile(),
    staleTime: 5 * 60 * 1000,
  });
}
