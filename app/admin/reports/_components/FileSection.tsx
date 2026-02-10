'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAdminFiles } from '../_hooks/useAdminFiles';
import FileListItem from './FileListItem';
import FileUploadModal from './FileUploadModal';
import type { AdminFileCategory } from '@/types/adminFile';

interface FileSectionProps {
  title: string;
  category: AdminFileCategory;
}

export default function FileSection({ title, category }: FileSectionProps) {
  const { files, isLoading, isUploading, upload, remove } = useAdminFiles(category);
  const [showUpload, setShowUpload] = useState(false);

  const handleDelete = (fileId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      remove(fileId);
    }
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

      {isLoading ? (
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
        onUpload={upload}
        isUploading={isUploading}
      />
    </div>
  );
}
