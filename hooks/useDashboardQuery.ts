import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance';
import { attendanceKeys } from '@/lib/query/keys';

export function useCompanyDaily(date: string) {
  return useQuery({
    queryKey: attendanceKeys.companyDaily(date),
    queryFn: () => attendanceApi.getCompanyDaily(date),
    staleTime: 60 * 1000,
  });
}
