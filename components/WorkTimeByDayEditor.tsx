'use client';

import { TimePicker } from '@/components/ui/TimePicker';
import { NUM_TO_LABEL } from '@/lib/workDays';
import type { WorkDay, WorkTimesMap } from '@/types/employee';

type WorkTimeByDayEditorProps = {
  /** 편집 대상 근무요일 (요일 번호, 정렬된 상태 — labelsToSortedNums 사용) */
  workDays: WorkDay[];
  workTimes: WorkTimesMap;
  onChange: (day: WorkDay, field: 'start' | 'end', value: string) => void;
  disabled?: boolean;
};

/**
 * 선택된 근무요일마다 [요일] [출근] ~ [퇴근] 행을 렌더한다.
 * 근로자 상세(근무 정보)와 근로자 등록 모달에서 공유한다.
 */
export function WorkTimeByDayEditor({
  workDays,
  workTimes,
  onChange,
  disabled = false,
}: WorkTimeByDayEditorProps) {
  if (workDays.length === 0) {
    return (
      <p className="text-xs text-gray-500 py-2">
        근무 요일을 먼저 선택해주세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {workDays.map((day) => {
        const entry = workTimes[`${day}`];
        return (
          <div key={day} className="flex items-center gap-2 flex-wrap">
            <span className="w-8 shrink-0 py-1 rounded text-xs font-semibold text-center bg-duru-orange-500 text-white">
              {NUM_TO_LABEL[day]}
            </span>
            <div className="flex-1 min-w-[100px]">
              <TimePicker
                value={entry?.start ?? ''}
                onChange={(v) => onChange(day, 'start', v)}
                disabled={disabled}
                inputClassName="py-1"
                allowManualInput
              />
            </div>
            <span className="text-xs text-gray-400 shrink-0">~</span>
            <div className="flex-1 min-w-[100px]">
              <TimePicker
                value={entry?.end ?? ''}
                onChange={(v) => onChange(day, 'end', v)}
                disabled={disabled}
                inputClassName="py-1"
                allowManualInput
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
