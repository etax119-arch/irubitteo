'use client';

import { useState, useCallback } from 'react';
import { getEmployee, updateEmployee } from '@/lib/api/employees';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import { NUM_TO_LABEL, LABEL_TO_NUM } from '@/lib/workDays';
import type { Employee, WorkDay } from '@/types/employee';

export function useAdminEmployeeDetail(employeeId: string) {
  const toast = useToast();

  const [worker, setWorker] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Notes editing state
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Work info editing state
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');
  const [savingWorkInfo, setSavingWorkInfo] = useState(false);

  const fetchEmployee = useCallback(async () => {
    try {
      const result = await getEmployee(employeeId);
      const emp = result.data;
      setWorker(emp);
      setNotes(emp.adminNote || '');
      const dayNames = (emp.workDays ?? []).map((d) => NUM_TO_LABEL[d]).filter(Boolean);
      setWorkDays(dayNames);
      setWorkStartTime(emp.workStartTime ? emp.workStartTime.slice(0, 5) : '09:00');
    } catch (err) {
      console.error('Failed to fetch employee:', err);
      toast.error(extractErrorMessage(err));
    }
  }, [employeeId, toast]);

  // Notes handlers
  const handleEditNotes = () => {
    setTempNotes(notes);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await updateEmployee(employeeId, { adminNote: tempNotes || null });
      setNotes(tempNotes);
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

  // Work info handlers
  const handleEditWorkInfo = () => {
    setTempWorkDays([...workDays]);
    setTempWorkStartTime(workStartTime);
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = async () => {
    try {
      setSavingWorkInfo(true);
      const dayNums = tempWorkDays
        .map((d) => LABEL_TO_NUM[d])
        .filter(Boolean)
        .sort() as WorkDay[];
      await updateEmployee(employeeId, {
        workDays: dayNums,
        workStartTime: tempWorkStartTime,
      });
      setWorkDays([...tempWorkDays]);
      setWorkStartTime(tempWorkStartTime);
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
  };

  const toggleTempWorkDay = (day: string) => {
    if (tempWorkDays.includes(day)) {
      setTempWorkDays(tempWorkDays.filter((d) => d !== day));
    } else {
      setTempWorkDays([...tempWorkDays, day]);
    }
  };

  return {
    worker,
    loading,
    setLoading,
    fetchEmployee,
    // Notes
    notes,
    isEditingNotes,
    tempNotes,
    setTempNotes,
    savingNotes,
    handleEditNotes,
    handleSaveNotes,
    handleCancelNotes,
    // Work info
    workDays,
    workStartTime,
    isEditingWorkInfo,
    tempWorkDays,
    tempWorkStartTime,
    setTempWorkStartTime,
    savingWorkInfo,
    handleEditWorkInfo,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
    toggleTempWorkDay,
  };
}
