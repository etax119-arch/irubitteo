import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee, updateEmployee, uploadProfileImage, deleteProfileImage } from '@/lib/api/employees';
import { employeeKeys } from '@/lib/query/keys';
import type { EmployeeCreateInput, EmployeeUpdateInput } from '@/types/employee';

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeCreateInput) => createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}

export function useUpdateEmployee(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeUpdateInput) => updateEmployee(employeeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}

export function useUploadProfileImage(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (base64Image: string) => uploadProfileImage(employeeId, base64Image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}

export function useDeleteProfileImage(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProfileImage(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}
