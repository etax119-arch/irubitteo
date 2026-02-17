'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Schedule } from '@/types/schedule';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';

interface ScheduleModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  existingSchedule: Schedule | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (content: string, isHoliday: boolean) => void;
  onDelete: () => void;
}

export function ScheduleModal({
  isOpen,
  selectedDate,
  existingSchedule,
  isSaving,
  onClose,
  onSave,
  onDelete,
}: ScheduleModalProps) {
  const [content, setContent] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 모달 열릴 때 기존 데이터로 폼 초기화
      setContent(existingSchedule?.content ?? '');
      setIsHoliday(existingSchedule?.isHoliday ?? false);
    }
  }, [isOpen, existingSchedule]);

  const canSave = isHoliday || content.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="-m-6 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {existingSchedule ? '근무 일정 수정' : '근무 일정 등록'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
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

        <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Checkbox
            checked={isHoliday}
            onChange={(e) => setIsHoliday(e.target.checked)}
            label={<span className="text-lg font-semibold text-gray-800">휴일로 설정</span>}
            size="md"
          />
          {isHoliday && (
            <p className="mt-2 ml-8 text-sm text-gray-500">
              휴일에는 출근이 필요하지 않으며, 결근 처리되지 않습니다.
            </p>
          )}
        </div>

        <Textarea
          label={isHoliday ? '메모 (선택사항)' : '근무 내용'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isHoliday ? '휴일 사유 등을 입력할 수 있습니다...' : '해당 날짜의 근무 내용을 입력하세요...'}
          rows={isHoliday ? 4 : 8}
          className="border-gray-300 rounded-lg"
        />

        <div className="flex gap-3 mt-8">
          {existingSchedule && (
            <Button
              variant="outline"
              onClick={onDelete}
              disabled={isSaving}
              className="flex-1 py-3 text-red-600 border-red-300 hover:bg-red-50"
            >
              삭제
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="flex-1 py-3">
            취소
          </Button>
          <Button
            variant="primary"
            onClick={() => onSave(content, isHoliday)}
            disabled={!canSave || isSaving}
            className="flex-1 py-3"
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
