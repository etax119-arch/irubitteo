import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAdminStats, getAdminDailyAttendance, getAbsenceAlerts } from '@/lib/api/admin';
import { adminKeys } from '@/lib/query/keys';

const DASHBOARD_STALE_TIME = 60 * 1000;

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: getAdminStats,
    staleTime: DASHBOARD_STALE_TIME,
  });
}

export function useAdminDailyAttendance(
  date: string,
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  return useQuery({
    queryKey: adminKeys.dailyAttendance(date, page, search),
    queryFn: () => getAdminDailyAttendance(date, page, limit, search),
    staleTime: DASHBOARD_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useAbsenceAlerts() {
  return useQuery({
    queryKey: adminKeys.absenceAlerts(),
    queryFn: () => getAbsenceAlerts(3, 1, 5),
    select: (data) => data.data,
    staleTime: DASHBOARD_STALE_TIME,
  });
}
