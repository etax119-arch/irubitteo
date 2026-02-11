import { useQuery } from '@tanstack/react-query';
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

export function useAdminDailyAttendance(date: string) {
  return useQuery({
    queryKey: adminKeys.dailyAttendance(date),
    queryFn: () => getAdminDailyAttendance(date),
    staleTime: DASHBOARD_STALE_TIME,
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
