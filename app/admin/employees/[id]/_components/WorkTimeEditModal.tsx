'use client';

import { X, Save, Loader2 } from 'lucide-react';
import { TimePicker } from '@/components/ui/TimePicker';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import type { AttendanceStatus } from '@/types/attendance';

type EditedWorkTime = {
  date: string;
  checkin: string;
  checkout: string;
  workDone: string;
  status: AttendanceStatus;
};

type WorkTimeEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editedWorkTime: EditedWorkTime;
  setEditedWorkTime: (value: EditedWorkTime) => void;
  savingWorkTime: boolean;
  onSave: () => void;
};

export function WorkTimeEditModal({
  isOpen,
  onClose,
  editedWorkTime,
  setEditedWorkTime,
  savingWorkTime,
  onSave,
}: WorkTimeEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">근무시간 수정</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label="날짜"
            type="text"
            value={editedWorkTime.date}
            disabled
            size="sm"
            className="bg-gray-50"
          />

          <TimePicker
            label="출근 시간"
            value={editedWorkTime.checkin}
            onChange={(v) => setEditedWorkTime({ ...editedWorkTime, checkin: v })}
          />

          <TimePicker
            label="퇴근 시간"
            value={editedWorkTime.checkout}
            onChange={(v) => setEditedWorkTime({ ...editedWorkTime, checkout: v })}
          />

          <Textarea
            label="업무 내용"
            value={editedWorkTime.workDone}
            onChange={(e) => setEditedWorkTime({ ...editedWorkTime, workDone: e.target.value })}
            rows={3}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">상태</label>
            <select
              value={editedWorkTime.status}
              onChange={(e) => setEditedWorkTime({ ...editedWorkTime, status: e.target.value as AttendanceStatus })}
              disabled={savingWorkTime}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="checkin">출근</option>
              <option value="checkout">퇴근</option>
              <option value="absent">결근</option>
              <option value="leave">휴가</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={onClose}
              disabled={savingWorkTime}
              className="py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={onSave}
              disabled={savingWorkTime}
              className="py-3 px-6 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {savingWorkTime ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
