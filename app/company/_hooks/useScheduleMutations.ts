import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '@/lib/api/schedules';
import { scheduleKeys } from '@/lib/query/keys';
import type { ScheduleCreateInput, ScheduleUpdateInput } from '@/types/schedule';

export function useCreateSchedule(year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ScheduleCreateInput) => scheduleApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.monthly(year, month) });
    },
  });
}

export function useUpdateSchedule(year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ScheduleUpdateInput }) =>
      scheduleApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.monthly(year, month) });
    },
  });
}

export function useDeleteSchedule(year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.monthly(year, month) });
    },
  });
}
