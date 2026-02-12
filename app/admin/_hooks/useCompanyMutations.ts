import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany, updateCompany } from '@/lib/api/companies';
import { companyKeys } from '@/lib/query/keys';
import type { CompanyCreateInput, CompanyUpdateInput } from '@/types/company';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CompanyCreateInput) => createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CompanyUpdateInput & { isActive?: boolean; resignDate?: string | null; resignReason?: string | null }) =>
      updateCompany(companyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
