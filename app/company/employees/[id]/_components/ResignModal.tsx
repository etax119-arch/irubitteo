import { AlertTriangle, Check, UserX } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { Textarea } from '@/components/ui/Textarea';
import type { ResignForm } from '../_hooks/useEmployeeEditForm';

interface ResignModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  resignForm: ResignForm;
  isSubmitting: boolean;
  onUpdateForm: (patch: Partial<ResignForm>) => void;
  onSubmit: () => void;
}

export function ResignModal({
  isOpen,
  onClose,
  employeeName,
  resignForm,
  isSubmitting,
  onUpdateForm,
  onSubmit,
}: ResignModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
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
          <DatePicker
            value={resignForm.date}
            onChange={(v) => onUpdateForm({ date: v })}
            disabled={isSubmitting}
          />
        </div>

        <Textarea
          label="비고 (퇴사 사유 등)"
          value={resignForm.reason}
          onChange={(e) => onUpdateForm({ reason: e.target.value })}
          placeholder="퇴사 사유나 특이사항을 입력해주세요..."
          rows={4}
          disabled={isSubmitting}
        />

        <label
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onUpdateForm({ includeInWaitlist: !resignForm.includeInWaitlist })}
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              resignForm.includeInWaitlist
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300 bg-white'
            }`}
          >
            {resignForm.includeInWaitlist && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className="text-sm text-gray-700">대기자에 포함</span>
        </label>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 py-3" disabled={isSubmitting}>
            취소
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!resignForm.date || isSubmitting}
            leftIcon={<UserX className="w-4 h-4" />}
            className="flex-1 py-3 bg-red-500 text-white hover:bg-red-600"
          >
            {isSubmitting ? '처리 중...' : '퇴사 등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
