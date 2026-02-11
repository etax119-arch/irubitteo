import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '@/lib/api/companies';
import { companyKeys } from '@/lib/query/keys';

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: () => getCompanies(),
    select: (data) => data.data,
  });
}
