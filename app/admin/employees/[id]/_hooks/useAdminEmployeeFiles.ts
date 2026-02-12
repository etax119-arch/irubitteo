'use client';

import { useState } from 'react';
import { useEmployeeFilesQuery, useUploadEmployeeFile, useDeleteEmployeeFile } from '@/hooks/useEmployeeFiles';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { DocumentType } from '@/types/employee';

export function useAdminEmployeeFiles(employeeId: string) {
  const toast = useToast();
  const { data: documents = [] } = useEmployeeFilesQuery(employeeId);
  const uploadMutation = useUploadEmployeeFile(employeeId);
  const deleteMutation = useDeleteEmployeeFile(employeeId);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<DocumentType>('근로계약서');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('파일을 선택해주세요.');
      return;
    }
    try {
      await uploadMutation.mutateAsync({ file: uploadFile, documentType: uploadDocType });
      setShowUploadModal(false);
      setUploadFile(null);
      toast.success('파일이 업로드되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('파일을 삭제하시겠습니까?')) return;
    try {
      await deleteMutation.mutateAsync(fileId);
      toast.success('파일이 삭제되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    documents,
    showUploadModal,
    setShowUploadModal,
    uploadDocType,
    setUploadDocType,
    uploadFile,
    setUploadFile,
    uploading: uploadMutation.isPending,
    handleUpload,
    handleDeleteFile,
  };
}
