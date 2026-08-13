import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from '@/lib/api/schedules';
import { scheduleKeys } from '@/lib/query/keys';

/**
 * 월별 일정 + 해당 월 국가 공휴일.
 *
 * 공휴일은 같은 응답에 담겨 오므로 select로 schedules만 뽑지 않는다 —
 * 달력이 두 값을 다 쓴다.
 */
export function useMonthlySchedules(year: number, month: number) {
  return useQuery({
    queryKey: scheduleKeys.monthly(year, month),
    queryFn: () => scheduleApi.getMonthly(year, month),
  });
}
