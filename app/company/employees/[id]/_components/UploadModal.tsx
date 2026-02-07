import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { DocumentType } from '@/types/employee';

const DOCUMENT_TYPES: DocumentType[] = [
  '근로계약서', '동의서', '건강검진', '자격증', '장애인등록증', '이력서', '기타',
];

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, documentType: string) => Promise<void>;
  isUploading: boolean;
}

export function UploadModal({ isOpen, onClose, onUpload, isUploading }: UploadModalProps) {
  const [documentType, setDocumentType] = useState<DocumentType>('근로계약서');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'PDF, JPG, PNG 파일만 업로드 가능합니다.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '파일 크기는 10MB 이하만 가능합니다.';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValidationError(null);
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
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
    try {
      await onUpload(selectedFile, documentType);
      resetForm();
      onClose();
    } catch {
      alert('파일 업로드에 실패했습니다.');
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
