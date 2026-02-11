'use client';

import { useState, useCallback } from 'react';
import { getEmployeeFiles, uploadEmployeeFile, deleteEmployeeFile } from '@/lib/api/employeeFiles';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { EmployeeFile, DocumentType } from '@/types/employee';

export function useAdminEmployeeFiles(employeeId: string) {
  const toast = useToast();

  const [documents, setDocuments] = useState<EmployeeFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<DocumentType>('근로계약서');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      const files = await getEmployeeFiles(employeeId);
      setDocuments(files);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  }, [employeeId]);

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('파일을 선택해주세요.');
      return;
    }
    try {
      setUploading(true);
      await uploadEmployeeFile(employeeId, uploadFile, uploadDocType);
      setShowUploadModal(false);
      setUploadFile(null);
      toast.success('파일이 업로드되었습니다.');
      fetchFiles();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('파일을 삭제하시겠습니까?')) return;
    try {
      await deleteEmployeeFile(employeeId, fileId);
      toast.success('파일이 삭제되었습니다.');
      fetchFiles();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    documents,
    fetchFiles,
    showUploadModal,
    setShowUploadModal,
    uploadDocType,
    setUploadDocType,
    uploadFile,
    setUploadFile,
    uploading,
    handleUpload,
    handleDeleteFile,
  };
}
