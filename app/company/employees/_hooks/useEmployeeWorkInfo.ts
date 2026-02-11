import { useState, useCallback } from 'react';
import { updateEmployee } from '@/lib/api/employees';
import { useToast } from '@/components/ui/Toast';
import { NUM_TO_LABEL, LABEL_TO_NUM } from '@/lib/workDays';
import type { Employee, WorkDay } from '@/types/employee';

export function useEmployeeWorkInfo(employeeId: string) {
  const toast = useToast();
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [workStartTime, setWorkStartTime] = useState('');
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');
  const [isSavingWorkInfo, setIsSavingWorkInfo] = useState(false);

  const syncFromEmployee = useCallback((emp: Employee) => {
    if (Array.isArray(emp.workDays)) {
      setWorkDays(emp.workDays.map((n: number) => NUM_TO_LABEL[n] ?? ''));
    }
    if (emp.workStartTime) {
      setWorkStartTime(emp.workStartTime);
    }
  }, []);

  const handleEditWorkInfo = () => {
    setTempWorkDays([...workDays]);
    setTempWorkStartTime(workStartTime);
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = async (onSuccess?: (emp: Employee) => void) => {
    setIsSavingWorkInfo(true);
    try {
      const workDayNums = tempWorkDays.map((d) => LABEL_TO_NUM[d]).filter((n): n is WorkDay => n !== undefined);
      const result = await updateEmployee(employeeId, {
        workDays: workDayNums,
        workStartTime: tempWorkStartTime,
      });
      if (result.data.workDays) {
        setWorkDays(result.data.workDays.map((n: number) => NUM_TO_LABEL[n] ?? ''));
      }
      if (result.data.workStartTime) {
        setWorkStartTime(result.data.workStartTime);
      }
      setIsEditingWorkInfo(false);
      onSuccess?.(result.data);
      toast.success('근무 정보가 수정되었습니다.');
    } catch {
      toast.error('근무 정보 수정에 실패했습니다.');
    } finally {
      setIsSavingWorkInfo(false);
    }
  };

  const handleCancelEditWorkInfo = () => {
    setIsEditingWorkInfo(false);
    setTempWorkDays([]);
    setTempWorkStartTime('');
  };

  const toggleTempWorkDay = (day: string) => {
    setTempWorkDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return {
    workDays,
    workStartTime,
    isEditingWorkInfo,
    tempWorkDays,
    tempWorkStartTime,
    setTempWorkStartTime,
    isSavingWorkInfo,
    syncFromEmployee,
    handleEditWorkInfo,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
    toggleTempWorkDay,
  };
}
