'use client';

import { RefObject } from 'react';
import { FileText, Upload, Download, Trash2, Paperclip, Eye, Loader2 } from 'lucide-react';
import { formatFileSize } from '@/lib/file';
import { openExternalFile, downloadExternalFile } from '@/lib/api/download';
import type { CompanyFile } from '@/types/company';

interface FileSectionProps {
  files: CompanyFile[];
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (file: File) => void;
  onDelete: (fileId: string) => void;
}

export function FileSection({
  files,
  isUploading,
  fileInputRef,
  onFileChange,
  onDelete,
}: FileSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Paperclip className="w-5 h-5 text-duru-orange-600" />
          계약서 및 첨부 파일
        </h3>
        <p className="text-xs text-gray-500 mt-1 ml-7">
          해당 기업과 관련된 계약서 및 내부 자료를 관리합니다
        </p>
      </div>

      {/* 업로드 영역 */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileChange(file);
            e.target.value = '';
          }
        }}
      />
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-duru-orange-400 transition-colors cursor-pointer mb-6"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin mx-auto mb-3" />
        ) : (
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        )}
        <p className="text-sm text-gray-600 mb-3">
          {isUploading ? '업로드 중...' : '파일을 드래그하거나 클릭하여 업로드'}
        </p>
        <button
          className="px-4 py-2 bg-duru-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-duru-orange-600 transition-colors disabled:opacity-50"
          disabled={isUploading}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          파일 선택
        </button>
      </div>

      {/* 업로드된 파일 리스트 */}
      <div className="space-y-2">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(file.createdAt).toLocaleDateString('ko-KR')} · {formatFileSize(file.fileSize)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="보기"
                  onClick={() => openExternalFile(file.filePath)}
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="다운로드"
                  onClick={() => downloadExternalFile(file.filePath, file.fileName)}
                >
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="삭제"
                  onClick={() => onDelete(file.id)}
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4 text-sm">업로드된 파일이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
