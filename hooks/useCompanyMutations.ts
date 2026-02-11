import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany } from '@/lib/api/companies';
import { companyKeys } from '@/lib/query/keys';
import type { CompanyCreateInput } from '@/types/company';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CompanyCreateInput) => createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
