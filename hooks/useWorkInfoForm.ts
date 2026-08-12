import { useState } from 'react';
import { useUpdateEmployee } from '@/hooks/useEmployeeMutations';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import {
  DEFAULT_WORK_END,
  DEFAULT_WORK_START,
  buildWorkTimesPayload,
  fillMissingWorkTimes,
  labelsToSortedNums,
  numsToLabels,
  patchWorkTime,
} from '@/lib/workDays';
import type { Employee, WorkDay, WorkTimesMap } from '@/types/employee';

/**
 * 근로자 상세페이지 "근무 정보" 섹션의 편집 상태.
 *
 * admin/company 두 상세페이지가 공유한다.
 * 요일은 UI 계약상 한글 라벨 문자열로 다루고, 저장 직전에만 숫자로 변환한다.
 */
export function useWorkInfoForm(employeeId: string) {
  const toast = useToast();
  const updateMutation = useUpdateEmployee(employeeId);

  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');
  const [tempWorkEndTime, setTempWorkEndTime] = useState('');
  const [tempPerDayEnabled, setPerDayEnabled] = useState(false);
  const [tempWorkTimes, setTempWorkTimes] = useState<WorkTimesMap>({});
  const [savingWorkInfo, setSavingWorkInfo] = useState(false);

  const fallback = () => ({
    start: tempWorkStartTime || DEFAULT_WORK_START,
    end: tempWorkEndTime || DEFAULT_WORK_END,
  });

  const handleEditWorkInfo = (employee: Employee) => {
    setTempWorkDays(numsToLabels(employee.workDays ?? []));
    setTempWorkStartTime(employee.workStartTime || DEFAULT_WORK_START);
    setTempWorkEndTime(employee.workEndTime || DEFAULT_WORK_END);
    setTempWorkTimes(employee.workTimes ? { ...employee.workTimes } : {});
    setPerDayEnabled(employee.workTimes !== null);
    setIsEditingWorkInfo(true);
  };

  const handleCancelEditWorkInfo = () => {
    setIsEditingWorkInfo(false);
    setTempWorkDays([]);
    setTempWorkStartTime('');
    setTempWorkEndTime('');
    setTempWorkTimes({});
    setPerDayEnabled(false);
  };

  const toggleTempWorkDay = (day: string) => {
    setTempWorkDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  /**
   * 요일별 모드로 켜는 순간 선택된 모든 근무요일을 현재 단일 시간으로 채운다.
   * 빈 칸에서 시작하면 요일 수만큼 직접 입력해야 해서 사용성이 나쁘다.
   */
  const setTempPerDayEnabled = (enabled: boolean) => {
    if (enabled) {
      setTempWorkTimes((prev) =>
        fillMissingWorkTimes(prev, labelsToSortedNums(tempWorkDays), fallback())
      );
    }
    setPerDayEnabled(enabled);
  };

  const setTempWorkTime = (
    day: WorkDay,
    field: 'start' | 'end',
    value: string
  ) => {
    setTempWorkTimes((prev) => patchWorkTime(prev, day, field, value, fallback()));
  };

  const handleSaveWorkInfo = async () => {
    const days = labelsToSortedNums(tempWorkDays);
    const payload = buildWorkTimesPayload({
      days,
      perDayEnabled: tempPerDayEnabled,
      workTimes: tempWorkTimes,
      start: tempWorkStartTime,
      end: tempWorkEndTime,
    });

    if (!payload.ok) {
      toast.error(payload.message);
      return;
    }

    setSavingWorkInfo(true);
    try {
      await updateMutation.mutateAsync({
        workDays: days,
        workStartTime: payload.start,
        workEndTime: payload.end,
        workTimes: payload.workTimes,
      });
      setIsEditingWorkInfo(false);
      toast.success('근무 정보가 수정되었습니다.');
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setSavingWorkInfo(false);
    }
  };

  return {
    isEditingWorkInfo,
    tempWorkDays,
    tempWorkStartTime,
    tempWorkEndTime,
    tempPerDayEnabled,
    tempWorkTimes,
    savingWorkInfo,
    setTempWorkStartTime,
    setTempWorkEndTime,
    setTempPerDayEnabled,
    setTempWorkTime,
    toggleTempWorkDay,
    handleEditWorkInfo,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
  };
}

export type WorkInfoFormState = ReturnType<typeof useWorkInfoForm>;
