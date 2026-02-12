import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance';
import { attendanceKeys, employeeKeys } from '@/lib/query/keys';
import type { AttendanceUpdateInput } from '@/types/attendance';

export function useUpdateAttendance(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attendanceId, input }: { attendanceId: string; input: AttendanceUpdateInput }) =>
      attendanceApi.updateAttendance(attendanceId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.employeeHistory(employeeId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });
    },
  });
}
