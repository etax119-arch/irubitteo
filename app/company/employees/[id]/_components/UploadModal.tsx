import { Modal } from '@/components/ui/Modal';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="파일 업로드">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">문서 종류</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500">
            <option>근로계약서</option>
            <option>동의서</option>
            <option>건강검진</option>
            <option>자격증</option>
            <option>장애인등록증</option>
            <option>이력서</option>
            <option>기타</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">파일 선택</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
          />
          <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG 파일만 업로드 가능 (최대 10MB)</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors"
          >
            업로드
          </button>
        </div>
      </div>
    </Modal>
  );
}
