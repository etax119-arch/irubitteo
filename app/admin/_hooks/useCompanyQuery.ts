import { useQuery } from '@tanstack/react-query';
import { getCompanies, getCompany } from '@/lib/api/companies';
import { getEmployees } from '@/lib/api/employees';
import { companyKeys } from '@/lib/query/keys';

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: () => getCompanies(),
    select: (data) => data.data,
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

export function useCompanyEmployees(companyId: string) {
  return useQuery({
    queryKey: companyKeys.employees(companyId),
    queryFn: () => getEmployees({ companyId, limit: 100 }),
    select: (data) => data.data,
    enabled: !!companyId,
  });
}
