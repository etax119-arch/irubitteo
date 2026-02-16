import { Save } from 'lucide-react';
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
  status: AttendanceStatus;
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
  { value: 'checkin', label: '정상' },
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
  const isTimeDisabled = editedWorkTime.status === 'absent' || editedWorkTime.status === 'leave';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as AttendanceStatus;
    const clearTime = newStatus === 'absent' || newStatus === 'leave';
    setEditedWorkTime({
      ...editedWorkTime,
      status: newStatus,
      ...(clearTime ? { checkin: '', checkout: '' } : {}),
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
          disabled={isTimeDisabled || isSaving}
        />

        <TimePicker
          label="퇴근 시간"
          value={editedWorkTime.checkout}
          onChange={(v) => setEditedWorkTime({ ...editedWorkTime, checkout: v })}
          disabled={isTimeDisabled || isSaving}
        />

        <Textarea
          label="업무 내용"
          value={editedWorkTime.workDone}
          onChange={(e) => setEditedWorkTime({ ...editedWorkTime, workDone: e.target.value })}
          disabled={isSaving}
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
          </select>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            취소
          </Button>
          <Button variant="primary" onClick={onSave} disabled={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
