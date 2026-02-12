import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from '@/lib/api/schedules';
import { scheduleKeys } from '@/lib/query/keys';

export function useMonthlySchedules(year: number, month: number) {
  return useQuery({
    queryKey: scheduleKeys.monthly(year, month),
    queryFn: () => scheduleApi.getMonthly(year, month),
    select: (data) => data.schedules,
  });
}
