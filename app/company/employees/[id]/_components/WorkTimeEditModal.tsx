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

        {/* 버튼 영역: [취소] 좌측 / [휴가][저장] 우측 그룹 */}
        <div className="flex justify-between gap-3 pt-4">
          {/* 좌측: 취소 (Secondary) */}
          <Button variant="outline" onClick={onClose} className="flex-1 max-w-[100px]">
            취소
          </Button>

          {/* 우측 그룹: 휴가 + 저장 */}
          <div className="flex gap-3 flex-1 justify-end">
            {/*
              휴가 버튼 - 시안 A (기본 적용): 오렌지 아웃라인 + 연한 틴트 배경
              - 저장보다 시각적으로 약함 (Primary 우선 유지)
              - 취소와 구분됨 (오렌지 계열로 의미 있는 액션 표현)
            */}
            <Button
              variant="outline"
              onClick={onVacation}
              disabled={isSaving}
              leftIcon={<CalendarOff className="w-4 h-4" />}
              className="flex-1 max-w-[120px] border-duru-orange-300 bg-duru-orange-50/50 text-duru-orange-600 hover:bg-duru-orange-100 hover:border-duru-orange-400 focus:ring-2 focus:ring-duru-orange-300"
            >
              휴가
            </Button>

            {/*
              시안 B (대안): 중립 아웃라인 + 라인 아이콘
              아래 주석을 해제하고 위 버튼을 주석 처리하면 시안 B 적용

              <Button
                variant="outline"
                onClick={onVacation}
                disabled={isSaving}
                leftIcon={<CalendarOff className="w-4 h-4" />}
                className="flex-1 max-w-[120px] focus:ring-2 focus:ring-duru-orange-300 focus:border-duru-orange-400"
              >
                휴가
              </Button>
            */}

            {/* 저장 (Primary) - 가장 중요한 행동 요소 */}
            <Button
              variant="primary"
              onClick={onSave}
              disabled={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="flex-1 max-w-[120px]"
            >
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
