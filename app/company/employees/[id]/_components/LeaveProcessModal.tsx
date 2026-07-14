'use client';

import { CalendarCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { AttendanceRecord } from '../_hooks/useAttendanceHistory';

interface LeaveProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  remaining: number;
  isSubmitting?: boolean;
  onConfirm: () => void;
}

export function LeaveProcessModal({
  isOpen,
  onClose,
  record,
  remaining,
  isSubmitting = false,
  onConfirm,
}: LeaveProcessModalProps) {
  if (!record) return null;

  const isAnnualLeave = record.status === 'annual_leave';
  // 이미 연차인 기록은 취소(복원)만 하므로 항상 가능. 신규 처리는 남은 연차가 있어야 함.
  const canConfirm = isAnnualLeave || remaining > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="연차 처리" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-duru-orange-50 border border-duru-orange-200 p-4">
          <CalendarCheck className="w-6 h-6 text-duru-orange-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">남은 연차</p>
            <p className="text-lg font-bold text-duru-orange-600">{remaining}개</p>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          <p className="mb-2">
            <span className="font-semibold text-gray-900">{record.date}</span> 기록
          </p>
          {isAnnualLeave ? (
            <p>
              이 기록의 연차 처리를 취소하시겠습니까?
              <br />
              연차 1개가 복원됩니다.
            </p>
          ) : canConfirm ? (
            <p>연차 1개를 사용하여 이 기록을 연차 처리하시겠습니까?</p>
          ) : (
            <p className="text-red-500 font-medium">남은 연차가 없습니다.</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isSubmitting || !canConfirm}
            className="flex-1"
          >
            {isSubmitting ? '처리 중...' : isAnnualLeave ? '연차 취소' : '연차 처리'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
