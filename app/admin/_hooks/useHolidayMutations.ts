import { useMutation, useQueryClient } from '@tanstack/react-query';
import { holidayApi } from '@/lib/api/holidays';
import { holidayKeys, scheduleKeys } from '@/lib/query/keys';
import type { HolidayCreateInput, HolidayUpdateInput } from '@/types/holiday';

/**
 * 공휴일이 바뀌면 기업 근무일정 달력도 흐려진다 — 달력은 공휴일을
 * `GET /schedules/monthly` 응답으로 함께 받으므로 그 캐시까지 무효화한다.
 */
function useInvalidateHolidays(year: number) {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({ queryKey: holidayKeys.year(year) });
    void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
  };
}

export function useCreateHoliday(year: number) {
  const invalidate = useInvalidateHolidays(year);

  return useMutation({
    mutationFn: (input: HolidayCreateInput) => holidayApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateHoliday(year: number) {
  const invalidate = useInvalidateHolidays(year);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: HolidayUpdateInput }) =>
      holidayApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteHoliday(year: number) {
  const invalidate = useInvalidateHolidays(year);

  return useMutation({
    mutationFn: (id: string) => holidayApi.remove(id),
    onSuccess: invalidate,
  });
}
