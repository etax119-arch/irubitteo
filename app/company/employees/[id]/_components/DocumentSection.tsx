'use client';

import { useState } from 'react';
import { FileText, Upload, Trash2 } from 'lucide-react';
import type { EmployeeFile } from '@/types/employee';
import { Badge } from '@/components/ui/Badge';

interface DocumentSectionProps {
  files: EmployeeFile[];
  isLoading: boolean;
  onOpenUploadModal: () => void;
  onDelete: (fileId: string) => void;
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '-';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function DocumentSection({ files, isLoading, onOpenUploadModal, onDelete }: DocumentSectionProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-duru-orange-600" />
          문서 관리
        </h3>
        <button
          onClick={onOpenUploadModal}
          className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          파일 업로드
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">파일 목록을 불러오는 중...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">등록된 문서가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-1">파일 업로드 버튼을 눌러 문서를 등록하세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              role="button"
              tabIndex={0}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => {
                try {
                  const url = new URL(file.filePath, window.location.origin);
                  if (url.origin !== window.location.origin) return;
                  window.open(url.href, '_blank', 'noopener,noreferrer');
                } catch {
                  // 잘못된 URL은 무시
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{file.fileName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" size="sm">{file.documentType}</Badge>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.fileSize)} · {file.createdAt.slice(0, 10)}
                    </span>
                  </div>
                </div>
              </div>
              {confirmDeleteId === file.id ? (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { onDelete(file.id); setConfirmDeleteId(null); }}
                    className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(file.id);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
