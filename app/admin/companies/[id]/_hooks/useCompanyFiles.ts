'use client';

import { useState, useRef, useCallback } from 'react';
import { uploadCompanyFile, deleteCompanyFile } from '@/lib/api/companyFiles';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { CompanyFile } from '@/types/company';

export function useCompanyFiles(companyId: string) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<CompanyFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const newFile = await uploadCompanyFile(companyId, file);
      setFiles((prev) => [newFile, ...prev]);
      toast.success('파일이 업로드되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      await deleteCompanyFile(companyId, fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.success('파일이 삭제되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const setFilesCallback = useCallback((newFiles: CompanyFile[]) => {
    setFiles(newFiles);
  }, []);

  return {
    files,
    setFiles: setFilesCallback,
    isUploading,
    fileInputRef,
    handleFileUpload,
    handleFileDelete,
  };
}
