'use client';

import { FileText, Upload, Eye, Download, Trash2 } from 'lucide-react';
import { formatFileSize } from '@/lib/file';
import { openExternalFile, downloadExternalFile } from '@/lib/api/download';
import type { EmployeeFile } from '@/types/employee';

type DocumentSectionProps = {
  documents: EmployeeFile[];
  onOpenUploadModal: () => void;
  onDeleteFile: (fileId: string) => void;
};

export function DocumentSection({
  documents,
  onOpenUploadModal,
  onDeleteFile,
}: DocumentSectionProps) {
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

      <div className="space-y-3">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-600">
                    {doc.documentType} · {doc.createdAt?.substring(0, 10)} · {formatFileSize(doc.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="미리보기"
                  onClick={() => openExternalFile(doc.filePath)}
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="다운로드"
                  onClick={() => downloadExternalFile(doc.filePath, doc.fileName)}
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onDeleteFile(doc.id)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">등록된 문서가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
