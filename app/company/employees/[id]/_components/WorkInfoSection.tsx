import { Briefcase, Clock, Edit2, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

const ALL_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

interface WorkInfoSectionProps {
  workDays: string[];
  workStartTime: string;
  isEditing: boolean;
  tempWorkDays: string[];
  tempWorkStartTime: string;
  setTempWorkStartTime: (v: string) => void;
  toggleTempWorkDay: (day: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function WorkInfoSection({
  workDays,
  workStartTime,
  isEditing,
  tempWorkDays,
  tempWorkStartTime,
  setTempWorkStartTime,
  toggleTempWorkDay,
  onEdit,
  onSave,
  onCancel,
}: WorkInfoSectionProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-duru-orange-600" />
          근무 정보
        </h3>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            수정
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSave}
              className="px-3 py-1.5 bg-duru-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              저장
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-2">근무 요일</label>
            <div className="flex gap-1">
              {ALL_DAYS.map((day) => (
                <div
                  key={day}
                  className={cn(
                    'flex-1 py-1 rounded text-xs font-semibold text-center border',
                    workDays.includes(day)
                      ? 'bg-duru-orange-500 text-white border-duru-orange-500'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-gray-700 mb-2">출근 시간</label>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-bold text-gray-900">{workStartTime}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-2">근무 요일</label>
            <div className="grid grid-cols-7 gap-1">
              {ALL_DAYS.map((day) => {
                const isSelected = tempWorkDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleTempWorkDay(day)}
                    className={cn(
                      'py-1 rounded text-xs font-semibold transition-colors border',
                      isSelected
                        ? 'bg-duru-orange-500 text-white border-duru-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-gray-700 mb-2">출근 시간</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="time"
                value={tempWorkStartTime}
                onChange={(e) => setTempWorkStartTime(e.target.value)}
                className="w-full pl-9 pr-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent text-gray-700"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
