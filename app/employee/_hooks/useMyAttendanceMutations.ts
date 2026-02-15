import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance';
import { attendanceKeys } from '@/lib/query/keys';
import type { ClockInInput, ClockOutInput } from '@/types/attendance';

export function useClockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input?: ClockInInput) => attendanceApi.clockIn(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.myToday() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.myHistoryAll() });
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ClockOutInput) => attendanceApi.clockOut(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.myToday() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.myHistoryAll() });
    },
  });
}

export function useAddPhotos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attendanceId, photos }: { attendanceId: string; photos: Blob[] }) =>
      attendanceApi.addPhotos(attendanceId, photos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.myHistoryAll() });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attendanceId, photoUrl }: { attendanceId: string; photoUrl: string }) =>
      attendanceApi.deletePhoto(attendanceId, photoUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.myHistoryAll() });
    },
  });
}
