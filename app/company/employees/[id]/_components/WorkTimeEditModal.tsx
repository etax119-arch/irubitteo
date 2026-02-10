import { Save, CalendarOff } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface EditedWorkTime {
  date: string;
  checkin: string;
  checkout: string;
  workDone: string;
}

interface WorkTimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedWorkTime: EditedWorkTime;
  setEditedWorkTime: (v: EditedWorkTime) => void;
  onSave: () => void;
  onVacation?: () => void;
  isSaving: boolean;
}

export function WorkTimeEditModal({
  isOpen,
  onClose,
  editedWorkTime,
  setEditedWorkTime,
  onSave,
  onVacation,
  isSaving,
}: WorkTimeEditModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="근무시간 수정">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">날짜</label>
          <input
            type="text"
            value={editedWorkTime.date}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">출근 시간</label>
          <input
            type="time"
            value={editedWorkTime.checkin}
            onChange={(e) => setEditedWorkTime({ ...editedWorkTime, checkin: e.target.value })}
            disabled={isSaving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">퇴근 시간</label>
          <input
            type="time"
            value={editedWorkTime.checkout}
            onChange={(e) => setEditedWorkTime({ ...editedWorkTime, checkout: e.target.value })}
            disabled={isSaving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">업무 내용</label>
          <textarea
            value={editedWorkTime.workDone}
            onChange={(e) => setEditedWorkTime({ ...editedWorkTime, workDone: e.target.value })}
            disabled={isSaving}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            취소
          </Button>
          <div className="flex gap-3">
            {onVacation && (
              <Button
                variant="outline"
                onClick={onVacation}
                disabled={isSaving}
                leftIcon={<CalendarOff className="w-4 h-4" />}
                className="border-duru-orange-300 bg-duru-orange-50/50 text-duru-orange-600 hover:bg-duru-orange-100"
              >
                휴가
              </Button>
            )}
            <Button variant="primary" onClick={onSave} disabled={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
