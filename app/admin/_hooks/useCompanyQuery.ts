import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCompanies, getCompany } from '@/lib/api/companies';
import { getEmployees } from '@/lib/api/employees';
import { companyKeys } from '@/lib/query/keys';
import type { CompanyFilter } from '@/types/adminDashboard';
import type { CompanyQueryParams } from '@/types/company';

function buildCompanyParams(filter: CompanyFilter, search: string, page: number, limit: number): CompanyQueryParams {
  const params: CompanyQueryParams = { page, limit };
  if (filter === 'active') {
    params.isActive = true;
  } else if (filter === 'inactive') {
    params.isActive = false;
  }
  if (search) {
    params.search = search;
  }
  return params;
}

export function useCompanies(filter: CompanyFilter = 'active', search: string = '', page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: companyKeys.list({ filter, search, page, limit }),
    queryFn: () => getCompanies(buildCompanyParams(filter, search, page, limit)),
    select: (data) => ({ companies: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useCompanyDetail(id: string) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => getCompany(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useCompanyEmployees(companyId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: companyKeys.employees(companyId, { page, limit }),
    queryFn: () => getEmployees({ companyId, page, limit }),
    select: (data) => ({ employees: data.data, pagination: data.pagination }),
    enabled: !!companyId,
    placeholderData: keepPreviousData,
  });
}
