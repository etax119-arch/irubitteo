import { useState, useEffect, useCallback } from 'react';
import { getAdminFiles, uploadAdminFile, deleteAdminFile } from '@/lib/api/admin';
import { useToast } from '@/components/ui/Toast';
import type { AdminFile, AdminFileCategory } from '@/types/adminFile';

export function useAdminFiles(category: AdminFileCategory) {
  const toast = useToast();
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAdminFiles(category);
      setFiles(data);
    } catch {
      toast.error('파일 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [category, toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const upload = async (
    file: File,
    name: string,
    description?: string
  ): Promise<boolean> => {
    setIsUploading(true);
    try {
      const newFile = await uploadAdminFile(file, category, name, description);
      setFiles((prev) => [newFile, ...prev]);
      toast.success('파일이 업로드되었습니다.');
      return true;
    } catch {
      toast.error('파일 업로드에 실패했습니다.');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (fileId: string) => {
    try {
      await deleteAdminFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.success('파일이 삭제되었습니다.');
    } catch {
      toast.error('파일 삭제에 실패했습니다.');
    }
  };

  return { files, isLoading, isUploading, upload, remove };
}
