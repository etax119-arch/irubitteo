import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getEmployees, getEmployee } from '@/lib/api/employees';
import { employeeKeys } from '@/lib/query/keys';
import type { Employee, EmployeeQueryParams, EmployeeWithCompany } from '@/types/employee';
import type { WorkerFilter } from '@/types/adminDashboard';
import type { PaginatedResponse } from '@/types/api';

/** 서버 limit 상한 미확인 — 서버 확인 후 조정 가능 */
const ACTIVE_EMPLOYEE_PAGE_SIZE = 100;
const MAX_CONCURRENCY = 3;

async function fetchAllActiveEmployees(): Promise<Employee[]> {
  const limit = ACTIVE_EMPLOYEE_PAGE_SIZE;
  const first = await getEmployees({ isActive: true, page: 1, limit });
  const allEmployees = [...first.data];

  const totalPages = first.pagination?.totalPages ?? 1;
  if (totalPages <= 1) return allEmployees;

  const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

  for (let i = 0; i < remainingPages.length; i += MAX_CONCURRENCY) {
    const batch = remainingPages.slice(i, i + MAX_CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((page) => getEmployees({ isActive: true, page, limit })),
    );
    for (const res of results) {
      if (res.status === 'fulfilled') {
        allEmployees.push(...res.value.data);
      }
    }
  }

  return allEmployees;
}

export function useActiveEmployees(staleTime?: number) {
  return useQuery({
    queryKey: employeeKeys.active(),
    queryFn: fetchAllActiveEmployees,
    ...(staleTime !== undefined ? { staleTime } : {}),
  });
}

export function useCompanyPaginatedEmployees(
  search: string,
  page: number = 1,
  limit: number = 20,
) {
  return useQuery({
    queryKey: employeeKeys.companyList({ search, page, limit }),
    queryFn: () => getEmployees({ isActive: true, search: search || undefined, page, limit }),
    select: (data) => ({ employees: data.data, pagination: data.pagination }),
    placeholderData: keepPreviousData,
  });
}

function buildEmployeeParams(filter: WorkerFilter, search: string, page: number, limit: number): EmployeeQueryParams {
  const params: EmployeeQueryParams = { page, limit };
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

export function useAdminEmployees(filter: WorkerFilter, search: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: employeeKeys.list({ filter, search, page, limit }),
    queryFn: () =>
      getEmployees(buildEmployeeParams(filter, search, page, limit)) as Promise<
        PaginatedResponse<EmployeeWithCompany>
      >,
    select: (data) => ({ employees: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
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
