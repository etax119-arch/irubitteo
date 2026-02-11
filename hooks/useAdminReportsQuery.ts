import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminFiles, uploadAdminFile, deleteAdminFile } from '@/lib/api/admin';
import { adminKeys } from '@/lib/query/keys';
import type { AdminFile, AdminFileCategory } from '@/types/adminFile';

export function useAdminFiles(category: AdminFileCategory) {
  return useQuery({
    queryKey: adminKeys.files(category),
    queryFn: () => getAdminFiles(category),
  });
}

export function useUploadAdminFile(category: AdminFileCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, name, description }: { file: File; name: string; description?: string }) =>
      uploadAdminFile(file, category, name, description),
    onSuccess: (newFile) => {
      queryClient.setQueryData<AdminFile[]>(adminKeys.files(category), (old) =>
        old ? [newFile, ...old] : [newFile]
      );
    },
  });
}

export function useDeleteAdminFile(category: AdminFileCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => deleteAdminFile(fileId),
    onSuccess: (_data, fileId) => {
      queryClient.setQueryData<AdminFile[]>(adminKeys.files(category), (old) =>
        old?.filter((f) => f.id !== fileId)
      );
    },
  });
}
