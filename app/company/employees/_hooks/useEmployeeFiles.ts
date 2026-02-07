import { useState, useEffect, useCallback } from 'react';
import { getEmployeeFiles, uploadEmployeeFile, deleteEmployeeFile } from '@/lib/api/employeeFiles';
import { useToast } from '@/components/ui/Toast';
import type { EmployeeFile } from '@/types/employee';

export function useEmployeeFiles(employeeId: string) {
  const toast = useToast();
  const [files, setFiles] = useState<EmployeeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEmployeeFiles(employeeId);
      setFiles(data);
    } catch {
      setError('파일 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const upload = async (file: File, documentType: string) => {
    setIsUploading(true);
    try {
      const newFile = await uploadEmployeeFile(employeeId, file, documentType);
      setFiles((prev) => [newFile, ...prev]);
      toast.success('파일이 업로드되었습니다.');
    } catch {
      toast.error('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (fileId: string) => {
    try {
      await deleteEmployeeFile(employeeId, fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.success('파일이 삭제되었습니다.');
    } catch {
      toast.error('파일 삭제에 실패했습니다.');
    }
  };

  return { files, isLoading, error, isUploading, upload, remove, refetch: fetchFiles };
}
