'use client';

import { Download, Trash2, FileText, FileSpreadsheet, Image } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import type { AdminFile } from '@/types/adminFile';
import { formatFileSize } from '@/lib/file';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return <FileText className="w-5 h-5 text-gray-400" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
    return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
  if (mimeType.startsWith('image/'))
    return <Image className="w-5 h-5 text-blue-500" />;
  return <FileText className="w-5 h-5 text-red-500" />;
}

interface FileListItemProps {
  file: AdminFile;
  onDelete: (fileId: string) => void;
}

export default function FileListItem({ file, onDelete }: FileListItemProps) {
  const handleDownload = () => {
    window.open(file.filePath, '_blank');
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {getFileIcon(file.mimeType)}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">
          {file.fileName}
          {file.fileSize ? ` · ${formatFileSize(file.fileSize)}` : ''}
          {' · '}
          {formatDate(file.createdAt)}
        </p>
        {file.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{file.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <IconButton
          icon={<Download className="w-4 h-4" />}
          variant="ghost"
          size="sm"
          label="다운로드"
          onClick={handleDownload}
        />
        <IconButton
          icon={<Trash2 className="w-4 h-4" />}
          variant="ghost"
          size="sm"
          label="삭제"
          onClick={() => onDelete(file.id)}
        />
      </div>
    </div>
  );
}
