import { X } from 'lucide-react';
import type { ScheduleForm } from '@/types/companyDashboard';

interface ScheduleModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  form: ScheduleForm;
  onClose: () => void;
  onFormChange: (form: ScheduleForm) => void;
  onSave: () => void;
}

export function ScheduleModal({
  isOpen,
  selectedDate,
  form,
  onClose,
  onFormChange,
  onSave,
}: ScheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">근무 일정 등록</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {selectedDate && (
          <p className="text-gray-600 mb-6">
            {selectedDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              근무 내용
            </label>
            <textarea
              value={form.workType}
              onChange={(e) => onFormChange({ ...form, workType: e.target.value })}
              placeholder="해당 날짜의 근무 내용을 입력하세요..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onSave}
            disabled={!form.workType.trim()}
            className="flex-1 py-3 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
