import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getEmployees, getEmployee } from '@/lib/api/employees';
import { employeeKeys } from '@/lib/query/keys';
import type { Employee, EmployeeQueryParams, EmployeeWithCompany } from '@/types/employee';
import type { WorkerFilter } from '@/types/adminDashboard';
import type { PaginatedResponse } from '@/types/api';

/** 검색 모드에서 한 번에 가져올 최대 건수. 서버 search 대신 클라이언트 필터링 사용 시 적용.
 *  500명 이상인 경우 검색 결과가 잘릴 수 있음 — 서버 search 지원 시 제거 가능 */
const CLIENT_SEARCH_LIMIT = 500;
const CLIENT_PAGE_SIZE = 20;

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
  const isSearchMode = !!search.trim();

  if (filter === 'current') {
    params.isActive = true;
    params.standby = false;
  } else if (filter === 'resigned') {
    params.isActive = false;
  } else if (filter === 'waiting') {
    params.standby = true;
  }

  if (isSearchMode) {
    // 클라이언트에서 이름+회사명 필터링 — 서버 search 대신 큰 limit으로 가져옴
    params.page = 1;
    params.limit = CLIENT_SEARCH_LIMIT;
  }

  return params;
}

export function useAdminEmployees(filter: WorkerFilter, search: string, page: number = 1, limit: number = 20) {
  const isSearchMode = !!search.trim();

  return useQuery({
    queryKey: isSearchMode
      ? employeeKeys.searchList({ filter, search: search.trim() })
      : employeeKeys.list({ filter, search: '', page, limit }),
    queryFn: () =>
      getEmployees(buildEmployeeParams(filter, search, page, limit)) as Promise<
        PaginatedResponse<EmployeeWithCompany>
      >,
    select: (data) => {
      if (!isSearchMode) {
        return { employees: data.data, pagination: data.pagination };
      }
      // 클라이언트 필터링: 이름 + 회사명
      const normalized = search.trim().toLowerCase();
      const filtered = (data.data as EmployeeWithCompany[]).filter(emp =>
        emp.name.toLowerCase().includes(normalized) ||
        emp.companyName?.toLowerCase().includes(normalized)
      );
      const start = (page - 1) * CLIENT_PAGE_SIZE;
      const paged = filtered.slice(start, start + CLIENT_PAGE_SIZE);
      return {
        employees: paged,
        pagination: {
          page,
          limit: CLIENT_PAGE_SIZE,
          total: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / CLIENT_PAGE_SIZE)),
        },
      };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useEmployeeDetail(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployee(id),
    enabled: !!id,
  });
}
