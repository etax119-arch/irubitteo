import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance';
import { attendanceKeys } from '@/lib/query/keys';

export function useMyTodayAttendance() {
  return useQuery({
    queryKey: attendanceKeys.myToday(),
    queryFn: () => attendanceApi.getTodayAttendance(),
    staleTime: 30 * 1000,
  });
}

export function useMyAttendanceHistory(options: {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  enabled?: boolean;
}) {
  const { page, limit, startDate, endDate, enabled = true } = options;
  return useQuery({
    queryKey: attendanceKeys.myHistory({ page, limit, startDate, endDate }),
    queryFn: () =>
      attendanceApi.getAttendances({ status: 'checkout', page, limit, startDate, endDate }),
    select: (data) => ({ records: data.data, pagination: data.pagination }),
    enabled,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}
