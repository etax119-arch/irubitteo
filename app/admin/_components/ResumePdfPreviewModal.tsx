'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import { downloadExternalFile } from '@/lib/api/download';
import type { Resume } from '@/types/resume';

interface ResumePdfPreviewModalProps {
  resume: Resume | null;
  onClose: () => void;
}

export function ResumePdfPreviewModal({ resume, onClose }: ResumePdfPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!resume?.pdfPath) {
      setBlobUrl(null);
      setError(false);
      return;
    }

    let revoke = '';
    setError(false);

    fetch(resume.pdfPath)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        revoke = url;
        setBlobUrl(url);
      })
      .catch(() => setError(true));

    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
      setBlobUrl(null);
    };
  }, [resume?.pdfPath]);

  if (!resume) return null;

  return (
    <Modal
      isOpen={!!resume}
      onClose={onClose}
      title={`${resume.name} 이력서`}
      className="max-w-4xl"
      contentClassName="p-0"
    >
      {error ? (
        <div className="flex items-center justify-center h-[70vh] text-gray-400 text-sm">
          PDF를 불러올 수 없습니다.
        </div>
      ) : blobUrl ? (
        <iframe
          src={blobUrl}
          className="w-full h-[70vh]"
          title={`${resume.name} 이력서 미리보기`}
        />
      ) : (
        <div className="flex items-center justify-center h-[70vh] text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => downloadExternalFile(resume.pdfPath!, `${resume.name}_이력서.pdf`)}
        >
          다운로드
        </Button>
      </div>
    </Modal>
  );
}
