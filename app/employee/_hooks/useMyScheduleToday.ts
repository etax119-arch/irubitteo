import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from '@/lib/api/schedules';
import { scheduleKeys } from '@/lib/query/keys';

export function useMyScheduleToday() {
  return useQuery({
    queryKey: scheduleKeys.today(),
    queryFn: () => scheduleApi.getToday(),
    staleTime: 5 * 60 * 1000,
  });
}
