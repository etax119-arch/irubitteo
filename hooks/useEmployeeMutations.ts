import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee } from '@/lib/api/employees';
import { employeeKeys } from '@/lib/query/keys';
import type { EmployeeCreateInput } from '@/types/employee';

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeCreateInput) => createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}
