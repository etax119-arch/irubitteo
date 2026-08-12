'use client';

import { Briefcase, Clock, Edit2, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { TimePicker } from '@/components/ui/TimePicker';
import { Checkbox } from '@/components/ui/Checkbox';
import { WorkTimeByDayEditor } from '@/components/WorkTimeByDayEditor';
import {
  DAY_LABELS,
  NUM_TO_LABEL,
  groupWorkTimes,
  labelsToSortedNums,
} from '@/lib/workDays';
import type { WorkInfoFormState } from '@/hooks/useWorkInfoForm';
import type { WorkTimesMap } from '@/types/employee';

export type WorkInfoSectionProps = {
  /** 근무 요일 (한글 라벨) */
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  /** 요일별 시간. null이면 단일 시간으로 표시 */
  workTimes: WorkTimesMap | null;
  /** 편집 상태 — useWorkInfoForm() 반환값을 그대로 넘긴다 */
  form: WorkInfoFormState;
  /** employee 인자가 필요해 호출부가 바인딩한다 */
  onEdit: () => void;
};

export function WorkInfoSection({
  workDays,
  workStartTime,
  workEndTime,
  workTimes,
  form,
  onEdit,
}: WorkInfoSectionProps) {
  const {
    isEditingWorkInfo: isEditing,
    savingWorkInfo: isSaving,
    tempWorkDays,
    tempWorkStartTime,
    tempWorkEndTime,
    tempPerDayEnabled,
    tempWorkTimes,
    setTempWorkStartTime,
    setTempWorkEndTime,
    setTempPerDayEnabled,
    setTempWorkTime,
    toggleTempWorkDay,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
  } = form;

  // 조회는 반드시 workTimes 우선. 단일 시간 컬럼은 서버가 도출한 대표 범위라
  // 특정 요일의 시간으로 표시하면 실제로 일하지 않는 시간대가 나온다.
  const groups = workTimes
    ? groupWorkTimes(labelsToSortedNums(workDays), workTimes)
    : [];

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-duru-orange-600" />
          근무 정보
        </h3>
        {!isEditing ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            수정
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancelEditWorkInfo}>
              취소
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveWorkInfo}
              disabled={isSaving}
              leftIcon={
                isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )
              }
            >
              저장
            </Button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              근무 요일
            </label>
            <div className="flex gap-1">
              {DAY_LABELS.map((day) => (
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

          {groups.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                요일별 근무 시간
              </label>
              <div className="flex flex-col gap-1.5">
                {groups.map((group) => (
                  <div
                    key={group.days.join('-')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 shrink-0">
                      {group.days.map((d) => NUM_TO_LABEL[d]).join('·')}
                    </span>
                    <span className="text-sm font-bold text-gray-900 ml-auto">
                      {group.time.start} ~ {group.time.end}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex-1 sm:w-32">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  출근 시간
                </label>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">
                    {workStartTime}
                  </span>
                </div>
              </div>
              <div className="flex-1 sm:w-32">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  퇴근 시간
                </label>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">
                    {workEndTime}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              근무 요일
            </label>
            <div className="grid grid-cols-7 gap-1">
              {DAY_LABELS.map((day) => {
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

          <Checkbox
            size="sm"
            label="요일별로 출퇴근 시간 다르게 설정"
            checked={tempPerDayEnabled}
            onChange={(e) => setTempPerDayEnabled(e.target.checked)}
            className="text-sm"
          />

          {tempPerDayEnabled ? (
            <WorkTimeByDayEditor
              workDays={labelsToSortedNums(tempWorkDays)}
              workTimes={tempWorkTimes}
              onChange={setTempWorkTime}
              disabled={isSaving}
            />
          ) : (
            <div className="flex gap-4">
              <div className="flex-1 sm:w-40">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  출근 시간
                </label>
                <TimePicker
                  value={tempWorkStartTime}
                  onChange={setTempWorkStartTime}
                  inputClassName="py-1"
                />
              </div>
              <div className="flex-1 sm:w-40">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  퇴근 시간
                </label>
                <TimePicker
                  value={tempWorkEndTime}
                  onChange={setTempWorkEndTime}
                  inputClassName="py-1"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
