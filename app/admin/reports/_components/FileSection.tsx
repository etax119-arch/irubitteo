'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAdminFiles, useUploadAdminFile, useDeleteAdminFile } from '../../_hooks/useAdminReports';
import FileListItem from './FileListItem';
import FileUploadModal from './FileUploadModal';
import type { AdminFileCategory } from '@/types/adminFile';

interface FileSectionProps {
  title: string;
  category: AdminFileCategory;
}

export default function FileSection({ title, category }: FileSectionProps) {
  const toast = useToast();
  const filesQuery = useAdminFiles(category);
  const uploadMutation = useUploadAdminFile(category);
  const deleteMutation = useDeleteAdminFile(category);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const files = filesQuery.data ?? [];

  const handleUpload = async (
    file: File,
    name: string,
    description?: string
  ): Promise<boolean> => {
    try {
      await uploadMutation.mutateAsync({ file, name, description });
      toast.success('파일이 업로드되었습니다.');
      return true;
    } catch {
      toast.error('파일 업로드에 실패했습니다.');
      return false;
    }
  };

  const handleDelete = (fileId: string) => {
    setDeleteTargetId(fileId);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId, {
        onSuccess: () => toast.success('파일이 삭제되었습니다.'),
        onError: () => toast.error('파일 삭제에 실패했습니다.'),
      });
    }
    setDeleteTargetId(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowUpload(true)}
        >
          업로드
        </Button>
      </div>

      {filesQuery.isLoading ? (
        <div className="text-center py-8 text-gray-400">불러오는 중...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-400">등록된 파일이 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <FileListItem key={file.id} file={file} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <FileUploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
      />

      {/* 삭제 확인 모달 */}
      <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="삭제 확인" size="sm">
        <p className="text-gray-600 mb-6">정말 삭제하시겠습니까?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>취소</Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>삭제</Button>
        </div>
      </Modal>
    </div>
  );
}
