import { useEmployeeFilesQuery, useUploadEmployeeFile, useDeleteEmployeeFile } from '@/hooks/useEmployeeFiles';
import { useToast } from '@/components/ui/Toast';

export function useEmployeeFiles(employeeId: string) {
  const toast = useToast();
  const { data: files = [], isLoading, error: queryError } = useEmployeeFilesQuery(employeeId);
  const uploadMutation = useUploadEmployeeFile(employeeId);
  const deleteMutation = useDeleteEmployeeFile(employeeId);

  const error = queryError ? '파일 목록을 불러오는데 실패했습니다.' : null;

  const upload = async (file: File, documentType: string): Promise<boolean> => {
    try {
      await uploadMutation.mutateAsync({ file, documentType });
      toast.success('파일이 업로드되었습니다.');
      return true;
    } catch {
      toast.error('파일 업로드에 실패했습니다.');
      return false;
    }
  };

  const remove = async (fileId: string) => {
    try {
      await deleteMutation.mutateAsync(fileId);
      toast.success('파일이 삭제되었습니다.');
    } catch {
      toast.error('파일 삭제에 실패했습니다.');
    }
  };

  return { files, isLoading, error, isUploading: uploadMutation.isPending, upload, remove };
}
