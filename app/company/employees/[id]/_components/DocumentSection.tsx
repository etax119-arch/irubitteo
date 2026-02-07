import { FileText, Upload, Eye, Download } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

interface DocumentSectionProps {
  documents: Document[];
  onOpenUploadModal: () => void;
}

export function DocumentSection({ documents, onOpenUploadModal }: DocumentSectionProps) {
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
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-600">
                  {doc.type} · {doc.uploadDate} · {doc.size}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="미리보기"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="다운로드"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
