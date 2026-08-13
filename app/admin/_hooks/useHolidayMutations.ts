import { useMutation, useQueryClient } from '@tanstack/react-query';
import { holidayApi } from '@/lib/api/holidays';
import { holidayKeys, scheduleKeys } from '@/lib/query/keys';
import type { HolidayCreateInput, HolidayUpdateInput } from '@/types/holiday';

/**
 * 공휴일이 바뀌면 기업 근무일정 달력도 흐려진다 — 달력은 공휴일을
 * `GET /schedules/monthly` 응답으로 함께 받으므로 그 캐시까지 무효화한다.
 */
function useInvalidateHolidays() {
  const queryClient = useQueryClient();

  return () => {
    // 연도 단위가 아니라 전체를 비운다 — 날짜를 다른 연도로 옮기는 수정이 있으면
    // 원래 연도와 옮겨간 연도 두 곳이 모두 흐려진다.
    void queryClient.invalidateQueries({ queryKey: holidayKeys.all });
    void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
  };
}

export function useCreateHoliday() {
  const invalidate = useInvalidateHolidays();

  return useMutation({
    mutationFn: (input: HolidayCreateInput) => holidayApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateHoliday() {
  const invalidate = useInvalidateHolidays();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: HolidayUpdateInput }) =>
      holidayApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteHoliday() {
  const invalidate = useInvalidateHolidays();

  return useMutation({
    mutationFn: (id: string) => holidayApi.remove(id),
    onSuccess: invalidate,
  });
}
