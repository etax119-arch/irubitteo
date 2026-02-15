import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getAdminMonthlyStats, calculateAdminMonthlyStats, updateAdminMonthlyStats } from '@/lib/api/admin';
import { adminKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { MonthlyWorkStatsCompany } from '@/types/adminDashboard';

export function useAdminMonthlyStats(
  year: number,
  month: number,
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  return useQuery({
    queryKey: adminKeys.monthlyStats(year, month, page, search),
    queryFn: () => getAdminMonthlyStats(year, month, page, limit, search),
    placeholderData: keepPreviousData,
  });
}

export function useCalculateMonthlyStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { year: number; month: number }) =>
      calculateAdminMonthlyStats(params.year, params.month),
    onSuccess: (_data, variables) => {
      // prefix invalidate: page/search 없이 호출하여 모든 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: adminKeys.monthlyStats(variables.year, variables.month),
      });
    },
  });
}

export function useUpdateMonthlyStats(year: number, month: number, page: number, search?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminMonthlyStats,
    onMutate: async (params) => {
      const queryKey = adminKeys.monthlyStats(year, month, page, search);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PaginatedResponse<MonthlyWorkStatsCompany>>(queryKey);

      queryClient.setQueryData<PaginatedResponse<MonthlyWorkStatsCompany>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((company) => ({
            ...company,
            employees: company.employees.map((emp) =>
              emp.id === params.employeeId
                ? {
                    ...emp,
                    ...(params.workDays !== undefined && { workDays: params.workDays }),
                    ...(params.totalWorkHours !== undefined && { totalHours: params.totalWorkHours }),
                  }
                : emp
            ),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _params, context) => {
      if (context?.previous) {
        queryClient.setQueryData(adminKeys.monthlyStats(year, month, page, search), context.previous);
      }
    },
  });
}
