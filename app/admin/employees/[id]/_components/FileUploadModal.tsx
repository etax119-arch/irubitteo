'use client';

import { useState, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { DocumentType } from '@/types/employee';
import { validateUploadFile, FILE_CONSTRAINTS } from '@/lib/file';

type FileUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  uploadDocType: DocumentType;
  setUploadDocType: (value: DocumentType) => void;
  uploadFile: File | null;
  setUploadFile: (file: File | null) => void;
  uploading: boolean;
  onUpload: () => void;
};

export function FileUploadModal({
  isOpen,
  onClose,
  uploadDocType,
  setUploadDocType,
  uploadFile,
  setUploadFile,
  uploading,
  onUpload,
}: FileUploadModalProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValidationError(null);
    if (file) {
      const error = validateUploadFile(file, FILE_CONSTRAINTS.DOCUMENT);
      if (error) {
        setValidationError(error);
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }
    setUploadFile(file);
  };

  const handleClose = () => {
    onClose();
    setUploadFile(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">파일 업로드</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">문서 종류</label>
            <select
              value={uploadDocType}
              onChange={(e) => setUploadDocType(e.target.value as DocumentType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
            >
              <option value="근로계약서">근로계약서</option>
              <option value="동의서">동의서</option>
              <option value="건강검진">건강검진</option>
              <option value="자격증">자격증</option>
              <option value="장애인등록증">장애인등록증</option>
              <option value="이력서">이력서</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">파일 선택</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={FILE_CONSTRAINTS.DOCUMENT.accept}
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
            <button
              onClick={handleClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onUpload}
              disabled={uploading || !uploadFile || !!validationError}
              className="flex-1 py-3 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              업로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
