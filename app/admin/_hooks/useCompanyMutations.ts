import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany, updateCompany, deleteCompany } from '@/lib/api/companies';
import { companyKeys, adminKeys } from '@/lib/query/keys';
import type { CompanyCreateInput, CompanyUpdateInput } from '@/types/company';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CompanyCreateInput) => createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}
