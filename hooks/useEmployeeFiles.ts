import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployeeFiles, uploadEmployeeFile, deleteEmployeeFile } from '@/lib/api/employeeFiles';
import { employeeKeys } from '@/lib/query/keys';
import type { EmployeeFile } from '@/types/employee';

export function useEmployeeFilesQuery(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.files(employeeId),
    queryFn: () => getEmployeeFiles(employeeId),
    enabled: !!employeeId,
  });
}

export function useUploadEmployeeFile(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, documentType }: { file: File; documentType: string }) =>
      uploadEmployeeFile(employeeId, file, documentType),
    onSuccess: (newFile) => {
      queryClient.setQueryData<EmployeeFile[]>(employeeKeys.files(employeeId), (old) =>
        old ? [newFile, ...old] : [newFile]
      );
    },
  });
}

export function useDeleteEmployeeFile(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => deleteEmployeeFile(employeeId, fileId),
    onSuccess: (_data, fileId) => {
      queryClient.setQueryData<EmployeeFile[]>(employeeKeys.files(employeeId), (old) =>
        old?.filter((f) => f.id !== fileId)
      );
    },
  });
}
