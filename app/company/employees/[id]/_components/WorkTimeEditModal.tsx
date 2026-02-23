import { Save, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TimePicker } from '@/components/ui/TimePicker';
import { Textarea } from '@/components/ui/Textarea';
import type { AttendanceStatus } from '@/types/attendance';

interface EditedWorkTime {
  date: string;
  checkin: string;
  checkout: string;
  workDone: string;
  status: AttendanceStatus | '__reset__';
}

interface WorkTimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedWorkTime: EditedWorkTime;
  setEditedWorkTime: (v: EditedWorkTime) => void;
  onSave: () => void;
  isSaving: boolean;
}

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'checkin', label: '출근(근무중)' },
  { value: 'checkout', label: '퇴근' },
  { value: 'absent', label: '결근' },
  { value: 'leave', label: '휴가' },
];

export function WorkTimeEditModal({
  isOpen,
  onClose,
  editedWorkTime,
  setEditedWorkTime,
  onSave,
  isSaving,
}: WorkTimeEditModalProps) {
  const isReset = editedWorkTime.status === '__reset__';
  const isAbsentOrLeave = editedWorkTime.status === 'absent' || editedWorkTime.status === 'leave';
  const isCheckinDisabled = isReset || isAbsentOrLeave || editedWorkTime.status === 'checkout';
  const isCheckoutDisabled = isReset || isAbsentOrLeave || editedWorkTime.status === 'checkin';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as AttendanceStatus | '__reset__';
    if (newStatus === '__reset__') {
      setEditedWorkTime({ ...editedWorkTime, status: '__reset__' });
      return;
    }
    const clearTime = newStatus === 'absent' || newStatus === 'leave';
    const clearCheckout = newStatus === 'checkin';
    setEditedWorkTime({
      ...editedWorkTime,
      status: newStatus,
      ...(clearTime ? { checkin: '', checkout: '' } : {}),
      ...(clearCheckout ? { checkout: '' } : {}),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="근무시간 수정">
      <div className="space-y-4">
        <Input
          label="날짜"
          type="text"
          size="sm"
          value={editedWorkTime.date}
          disabled
        />

        <TimePicker
          label="출근 시간"
          value={editedWorkTime.checkin}
          onChange={(v) => setEditedWorkTime({ ...editedWorkTime, checkin: v })}
          disabled={isCheckinDisabled || isSaving}
        />

        <TimePicker
          label="퇴근 시간"
          value={editedWorkTime.checkout}
          onChange={(v) => setEditedWorkTime({ ...editedWorkTime, checkout: v })}
          disabled={isCheckoutDisabled || isSaving}
        />

        <Textarea
          label="업무 내용"
          value={editedWorkTime.workDone}
          onChange={(e) => setEditedWorkTime({ ...editedWorkTime, workDone: e.target.value })}
          disabled={isReset || isSaving}
          rows={3}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">상태</label>
          <select
            value={editedWorkTime.status}
            onChange={handleStatusChange}
            disabled={isSaving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            <option disabled>──────────</option>
            <option value="__reset__">초기화 (기록 삭제)</option>
          </select>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            취소
          </Button>
          <Button
            variant={isReset ? 'danger' : 'primary'}
            onClick={onSave}
            disabled={isSaving}
            leftIcon={isReset ? <Trash2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          >
            {isSaving ? '처리 중...' : isReset ? '초기화' : '저장'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
