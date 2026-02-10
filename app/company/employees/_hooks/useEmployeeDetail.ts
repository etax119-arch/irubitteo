import { useState, useEffect, useCallback } from 'react';
import { getEmployee, updateEmployee } from '@/lib/api/employees';
import { useToast } from '@/components/ui/Toast';
import type { Employee, WorkDay } from '@/types/employee';
import { NUM_TO_LABEL, LABEL_TO_NUM } from '../../_utils/workDays';

export function useEmployeeDetail(employeeId: string) {
  const toast = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isSavingWorkInfo, setIsSavingWorkInfo] = useState(false);
  const [isSavingDisability, setIsSavingDisability] = useState(false);

  // Notes state
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  // Work info state
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [workStartTime, setWorkStartTime] = useState('');
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');

  // Disability edit state
  const [isEditingDisability, setIsEditingDisability] = useState(false);
  const [tempDisabilitySeverity, setTempDisabilitySeverity] = useState('');
  const [tempDisabilityRecognitionDate, setTempDisabilityRecognitionDate] = useState('');

  const fetchEmployee = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEmployee(employeeId);
      setEmployee(response.data);
      setNotes(response.data.companyNote || '');
      if (Array.isArray(response.data.workDays)) {
        setWorkDays(response.data.workDays.map((n: number) => NUM_TO_LABEL[n] ?? ''));
      }
      if (response.data.workStartTime) {
        setWorkStartTime(response.data.workStartTime);
      }
    } catch {
      setError('근로자 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  // --- Notes handlers ---
  const handleEditNotes = () => {
    setTempNotes(notes);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const result = await updateEmployee(employeeId, { companyNote: tempNotes });
      setNotes(result.data.companyNote || '');
      setEmployee(result.data);
      setIsEditingNotes(false);
      toast.success('비고란이 수정되었습니다.');
    } catch {
      toast.error('비고란 수정에 실패했습니다.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setIsEditingNotes(false);
    setTempNotes('');
  };

  // --- Work info handlers ---
  const handleEditWorkInfo = () => {
    setTempWorkDays([...workDays]);
    setTempWorkStartTime(workStartTime);
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = async () => {
    setIsSavingWorkInfo(true);
    try {
      const workDayNums = tempWorkDays.map((d) => LABEL_TO_NUM[d]).filter((n): n is WorkDay => n !== undefined);
      const result = await updateEmployee(employeeId, {
        workDays: workDayNums,
        workStartTime: tempWorkStartTime,
      });
      setEmployee(result.data);
      if (result.data.workDays) {
        setWorkDays(result.data.workDays.map((n: number) => NUM_TO_LABEL[n] ?? ''));
      }
      if (result.data.workStartTime) {
        setWorkStartTime(result.data.workStartTime);
      }
      setIsEditingWorkInfo(false);
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

  // --- Disability edit handlers ---
  const handleEditDisability = () => {
    setTempDisabilitySeverity(employee?.disabilitySeverity || '');
    setTempDisabilityRecognitionDate(employee?.disabilityRecognitionDate || '');
    setIsEditingDisability(true);
  };

  const handleSaveDisability = async () => {
    setIsSavingDisability(true);
    try {
      const result = await updateEmployee(employeeId, {
        disabilitySeverity: tempDisabilitySeverity === '중증' || tempDisabilitySeverity === '경증'
          ? tempDisabilitySeverity : null,
        disabilityRecognitionDate: tempDisabilityRecognitionDate || null,
      });
      setEmployee(result.data);
      setIsEditingDisability(false);
      toast.success('장애 정보가 수정되었습니다.');
    } catch {
      toast.error('장애 정보 수정에 실패했습니다.');
    } finally {
      setIsSavingDisability(false);
    }
  };

  const handleCancelDisability = () => {
    setIsEditingDisability(false);
    setTempDisabilitySeverity('');
    setTempDisabilityRecognitionDate('');
  };

  return {
    employee,
    isLoading,
    error,
    isSavingNotes,
    isSavingWorkInfo,
    isSavingDisability,
    fetchEmployee,
    notes,
    isEditingNotes,
    tempNotes,
    setTempNotes,
    handleEditNotes,
    handleSaveNotes,
    handleCancelNotes,
    workDays,
    workStartTime,
    isEditingWorkInfo,
    tempWorkDays,
    tempWorkStartTime,
    setTempWorkStartTime,
    handleEditWorkInfo,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
    toggleTempWorkDay,
    isEditingDisability,
    tempDisabilitySeverity,
    setTempDisabilitySeverity,
    tempDisabilityRecognitionDate,
    setTempDisabilityRecognitionDate,
    handleEditDisability,
    handleSaveDisability,
    handleCancelDisability,
  };
}
