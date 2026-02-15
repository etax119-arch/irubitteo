'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateUploadFile, FILE_CONSTRAINTS } from '@/lib/file';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, name: string, description?: string) => Promise<boolean>;
  isUploading: boolean;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError(null);
    if (file) {
      const error = validateUploadFile(file, FILE_CONSTRAINTS.REPORT);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !name.trim()) return;
    const success = await onUpload(selectedFile, name.trim(), description.trim() || undefined);
    if (success) {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setSelectedFile(null);
    setName('');
    setDescription('');
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="파일 업로드" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">파일 선택</label>
          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_CONSTRAINTS.REPORT.accept}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {validationError ? (
            <p className="mt-1 text-xs text-red-500">{validationError}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">PDF, JPEG, PNG, DOCX, XLSX (최대 10MB)</p>
          )}
        </div>

        <Input
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="파일 표시 이름"
        />

        <Input
          label="설명 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="파일 설명"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={resetAndClose} disabled={isUploading}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedFile || !name.trim() || isUploading}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {isUploading ? '업로드 중...' : '업로드'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
