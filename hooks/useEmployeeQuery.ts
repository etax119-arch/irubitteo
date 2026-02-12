import { useQuery } from '@tanstack/react-query';
import { getEmployees, getEmployee } from '@/lib/api/employees';
import { employeeKeys } from '@/lib/query/keys';
import type { EmployeeQueryParams, EmployeeWithCompany } from '@/types/employee';
import type { WorkerFilter } from '@/types/adminDashboard';
import type { PaginatedResponse } from '@/types/api';

export function useActiveEmployees(staleTime?: number) {
  return useQuery({
    queryKey: employeeKeys.active(),
    queryFn: () => getEmployees({ isActive: true, limit: 500 }),
    select: (data) => data.data,
    ...(staleTime !== undefined ? { staleTime } : {}),
  });
}

function buildEmployeeParams(filter: WorkerFilter, search: string): EmployeeQueryParams {
  const params: EmployeeQueryParams = { limit: 100 };
  if (filter === 'current') {
    params.isActive = true;
    params.standby = false;
  } else if (filter === 'resigned') {
    params.isActive = false;
  } else if (filter === 'waiting') {
    params.standby = true;
  }
  if (search) {
    params.search = search;
  }
  return params;
}

export function useAdminEmployees(filter: WorkerFilter, search: string) {
  return useQuery({
    queryKey: employeeKeys.list({ filter, search }),
    queryFn: () =>
      getEmployees(buildEmployeeParams(filter, search)) as Promise<
        PaginatedResponse<EmployeeWithCompany>
      >,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEmployeeDetail(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployee(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}
