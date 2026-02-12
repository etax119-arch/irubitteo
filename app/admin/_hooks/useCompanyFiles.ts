import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanyFiles, uploadCompanyFile, deleteCompanyFile } from '@/lib/api/companyFiles';
import { companyKeys } from '@/lib/query/keys';
import type { CompanyFile } from '@/types/company';

export function useCompanyFilesQuery(companyId: string) {
  return useQuery({
    queryKey: companyKeys.files(companyId),
    queryFn: () => getCompanyFiles(companyId),
    enabled: !!companyId,
  });
}

export function useUploadCompanyFile(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadCompanyFile(companyId, file),
    onSuccess: (newFile) => {
      queryClient.setQueryData<CompanyFile[]>(companyKeys.files(companyId), (old) =>
        old ? [newFile, ...old] : [newFile]
      );
    },
  });
}

export function useDeleteCompanyFile(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => deleteCompanyFile(companyId, fileId),
    onSuccess: (_data, fileId) => {
      queryClient.setQueryData<CompanyFile[]>(companyKeys.files(companyId), (old) =>
        old?.filter((f) => f.id !== fileId)
      );
    },
  });
}
