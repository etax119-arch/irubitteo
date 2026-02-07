import { AlertTriangle, Calendar as CalendarIcon, UserX } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { ResignForm } from '../../_hooks/useResign';

interface ResignModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  resignForm: ResignForm;
  onUpdateForm: (patch: Partial<ResignForm>) => void;
  onSubmit: () => void;
}

export function ResignModal({
  isOpen,
  onClose,
  employeeName,
  resignForm,
  onUpdateForm,
  onSubmit,
}: ResignModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-bold text-gray-900">퇴사 등록</h3>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-700">
          <strong>{employeeName}</strong> 근로자를 퇴사 처리합니다.
          <br />
          퇴사 처리 후 해당 근로자는 출퇴근 서비스에 접속할 수 없습니다.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            퇴사일 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={resignForm.date}
              onChange={(e) => onUpdateForm({ date: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            비고 (퇴사 사유 등)
          </label>
          <textarea
            value={resignForm.reason}
            onChange={(e) => onUpdateForm({ reason: e.target.value })}
            placeholder="퇴사 사유나 특이사항을 입력해주세요..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} fullWidth>
            취소
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!resignForm.date}
            leftIcon={<UserX className="w-4 h-4" />}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
            fullWidth
          >
            퇴사 등록
          </Button>
        </div>
      </div>
    </Modal>
  );
}
