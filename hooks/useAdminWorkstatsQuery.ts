import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminMonthlyStats, calculateAdminMonthlyStats, updateAdminMonthlyStats } from '@/lib/api/admin';
import { adminKeys } from '@/lib/query/keys';
import type { MonthlyWorkStatsCompany } from '@/types/adminDashboard';

export function useAdminMonthlyStats(year: number, month: number) {
  return useQuery({
    queryKey: adminKeys.monthlyStats(year, month),
    queryFn: () => getAdminMonthlyStats(year, month),
  });
}

export function useCalculateMonthlyStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { year: number; month: number }) =>
      calculateAdminMonthlyStats(params.year, params.month),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.monthlyStats(variables.year, variables.month),
      });
    },
  });
}

export function useUpdateMonthlyStats(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminMonthlyStats,
    onMutate: async (params) => {
      const queryKey = adminKeys.monthlyStats(year, month);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<MonthlyWorkStatsCompany[]>(queryKey);

      queryClient.setQueryData<MonthlyWorkStatsCompany[]>(queryKey, (old) =>
        old?.map((company) => ({
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
        }))
      );
      return { previous };
    },
    onError: (_err, _params, context) => {
      if (context?.previous) {
        queryClient.setQueryData(adminKeys.monthlyStats(year, month), context.previous);
      }
    },
  });
}
