'use client';

import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { validateUploadFile, FILE_CONSTRAINTS } from '@/lib/file';
import type { DocumentType } from '@/types/employee';

const DOCUMENT_TYPES: DocumentType[] = [
  '근로계약서', '동의서', '건강검진', '자격증', '장애인등록증', '이력서', '기타',
];

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, documentType: string) => Promise<boolean>;
  isUploading: boolean;
}

export function UploadModal({ isOpen, onClose, onUpload, isUploading }: UploadModalProps) {
  const [documentType, setDocumentType] = useState<DocumentType>('근로계약서');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValidationError(null);
    if (file) {
      const error = validateUploadFile(file, FILE_CONSTRAINTS.DOCUMENT);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }
    setSelectedFile(file);
  };

  const resetForm = () => {
    setDocumentType('근로계약서');
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    const success = await onUpload(selectedFile, documentType);
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="파일 업로드">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">문서 종류</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">파일 선택</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
          />
          {validationError ? (
            <p className="text-xs text-red-500 mt-2">{validationError}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG 파일만 업로드 가능 (최대 10MB)</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" fullWidth onClick={handleClose} disabled={isUploading}>
            취소
          </Button>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!selectedFile || !!validationError || isUploading}
          >
            {isUploading ? '업로드 중...' : '업로드'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
