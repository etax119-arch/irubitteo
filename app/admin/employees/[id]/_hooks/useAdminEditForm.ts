'use client';

import { useState } from 'react';
import { useUpdateEmployee } from '@/hooks/useEmployeeMutations';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { NUM_TO_LABEL, LABEL_TO_NUM } from '@/lib/workDays';
import type { Employee, WorkDay } from '@/types/employee';

export function useAdminEditForm(employeeId: string) {
  const toast = useToast();
  const updateMutation = useUpdateEmployee(employeeId);

  // --- Admin Notes ---
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const handleEditNotes = (employee: Employee) => {
    setTempNotes(employee.adminNote || '');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await updateMutation.mutateAsync({ adminNote: tempNotes || null });
      setIsEditingNotes(false);
      toast.success('비고란이 저장되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setIsEditingNotes(false);
    setTempNotes('');
  };

  // --- Work Info ---
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');
  const [tempWorkEndTime, setTempWorkEndTime] = useState('');
  const [savingWorkInfo, setSavingWorkInfo] = useState(false);

  const handleEditWorkInfo = (employee: Employee) => {
    const dayLabels = (employee.workDays ?? []).map((d) => NUM_TO_LABEL[d]).filter(Boolean);
    setTempWorkDays([...dayLabels]);
    setTempWorkStartTime(employee.workStartTime ? employee.workStartTime.slice(0, 5) : '09:00');
    setTempWorkEndTime(employee.workEndTime ? employee.workEndTime.slice(0, 5) : '18:00');
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = async () => {
    try {
      setSavingWorkInfo(true);
      const dayNums = tempWorkDays
        .map((d) => LABEL_TO_NUM[d])
        .filter(Boolean)
        .sort() as WorkDay[];
      await updateMutation.mutateAsync({
        workDays: dayNums,
        workStartTime: tempWorkStartTime,
        workEndTime: tempWorkEndTime,
      });
      setIsEditingWorkInfo(false);
      toast.success('근무 정보가 저장되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingWorkInfo(false);
    }
  };

  const handleCancelEditWorkInfo = () => {
    setIsEditingWorkInfo(false);
    setTempWorkDays([]);
    setTempWorkStartTime('');
    setTempWorkEndTime('');
  };

  const toggleTempWorkDay = (day: string) => {
    if (tempWorkDays.includes(day)) {
      setTempWorkDays(tempWorkDays.filter((d) => d !== day));
    } else {
      setTempWorkDays([...tempWorkDays, day]);
    }
  };

  return {
    // Notes
    isEditingNotes,
    tempNotes,
    setTempNotes,
    savingNotes,
    handleEditNotes,
    handleSaveNotes,
    handleCancelNotes,
    // Work Info
    isEditingWorkInfo,
    tempWorkDays,
    tempWorkStartTime,
    setTempWorkStartTime,
    tempWorkEndTime,
    setTempWorkEndTime,
    savingWorkInfo,
    handleEditWorkInfo,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
    toggleTempWorkDay,
  };
}
