import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance';
import { attendanceKeys } from '@/lib/query/keys';

export function useEmployeeAttendanceHistory(
  employeeId: string,
  options: { page?: number; limit?: number; startDate?: string; endDate?: string } = {}
) {
  const { page = 1, limit = 10, startDate, endDate } = options;
  return useQuery({
    queryKey: attendanceKeys.employeeHistory(employeeId, { page, limit, startDate, endDate }),
    queryFn: () => attendanceApi.getAttendances({ employeeId, page, limit, startDate, endDate }),
    select: (data) => ({ records: data.data, pagination: data.pagination }),
    enabled: !!employeeId,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}
