'use client';

import { X } from 'lucide-react';
import type { ScheduleForm } from '@/types/companyDashboard';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="-m-6 p-8">
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

        <Textarea
          label="근무 내용"
          value={form.workType}
          onChange={(e) => onFormChange({ ...form, workType: e.target.value })}
          placeholder="해당 날짜의 근무 내용을 입력하세요..."
          rows={8}
          className="border-gray-300 rounded-lg"
        />

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1 py-3">
            취소
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={!form.workType.trim()}
            className="flex-1 py-3"
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
