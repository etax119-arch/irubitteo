'use client';

import { useState } from 'react';
import { FileText, Download, Eye, X } from 'lucide-react';
import type { Resume } from '@/types/resume';
import { downloadExternalFile } from '@/lib/api/download';
import { ResumePdfPreviewModal } from './ResumePdfPreviewModal';

interface ResumeListProps {
  resumes: Resume[];
  onReview: (resumeId: string) => void;
}

export function ResumeList({ resumes, onReview }: ResumeListProps) {
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[480px] flex flex-col">
      <div className="h-1 bg-gradient-to-r from-duru-orange-400 to-duru-orange-500 shrink-0" />
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          이력서 접수 알림
        </h3>
        <p className="text-sm text-gray-400 mt-1">홈페이지를 통해 접수된 이력서입니다.</p>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 scrollbar-light">
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <div key={resume.id} className="px-6 py-3.5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{resume.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                    이력서 접수
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {resume.disabilityTypes.length > 0
                    ? resume.disabilityTypes.join(', ')
                    : '장애유형 미입력'}{' '}
                  · {new Date(resume.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {resume.pdfPath && (
                  <>
                    <button
                      onClick={() => setPreviewResume(resume)}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      title="PDF 미리보기"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => downloadExternalFile(resume.pdfPath!, `${resume.name}_이력서.pdf`)}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      title="PDF 다운로드"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onReview(resume.id)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="알림 삭제"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-400 text-sm">
            현재 확인할 이력서가 없습니다.
          </div>
        )}
      </div>
      <ResumePdfPreviewModal
        resume={previewResume}
        onClose={() => setPreviewResume(null)}
      />
    </div>
  );
}
