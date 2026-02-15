import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee, updateEmployee, uploadProfileImage, deleteProfileImage } from '@/lib/api/employees';
import { employeeKeys } from '@/lib/query/keys';
import type { EmployeeCreateInput, EmployeeUpdateInput } from '@/types/employee';

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeCreateInput) => createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useUpdateEmployee(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeUpdateInput) => updateEmployee(employeeId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useUploadProfileImage(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageBlob: Blob) => uploadProfileImage(employeeId, imageBlob),
    onSuccess: (response) => {
      queryClient.setQueryData(employeeKeys.detail(employeeId), response);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useDeleteProfileImage(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProfileImage(employeeId),
    onSuccess: (response) => {
      queryClient.setQueryData(employeeKeys.detail(employeeId), response);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}
