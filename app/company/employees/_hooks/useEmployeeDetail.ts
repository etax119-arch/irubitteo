import { useState, useEffect } from 'react';
import { getEmployee, updateEmployee } from '@/lib/api/employees';
import { useToast } from '@/components/ui/Toast';
import type { CompanyEmployee } from '@/types/companyDashboard';

const DAY_NUM_TO_LABEL: Record<number, string> = {
  1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 7: '일',
};

const LABEL_TO_DAY_NUM: Record<string, number> = {
  '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7,
};

export function useEmployeeDetail(employeeId: string) {
  const toast = useToast();
  const [employee, setEmployee] = useState<CompanyEmployee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    async function fetchEmployee() {
      try {
        setIsLoading(true);
        const response = await getEmployee(employeeId);
        setEmployee(response.data);
        setNotes(response.data.companyNote || '');
        if (response.data.workDays) {
          setWorkDays(response.data.workDays.map((n: number) => DAY_NUM_TO_LABEL[n] ?? ''));
        }
        if (response.data.workStartTime) {
          setWorkStartTime(response.data.workStartTime);
        }
      } catch {
        setError('근로자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployee();
  }, [employeeId]);

  // --- Notes handlers ---
  const handleEditNotes = () => {
    setTempNotes(notes);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const result = await updateEmployee(employeeId, { companyNote: tempNotes });
      setNotes(result.data.companyNote || '');
      setEmployee(result.data);
      setIsEditingNotes(false);
      toast.success('비고란이 수정되었습니다.');
    } catch {
      toast.error('비고란 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
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
    setIsSaving(true);
    try {
      const workDayNums = tempWorkDays.map((d) => LABEL_TO_DAY_NUM[d]).filter(Boolean);
      const result = await updateEmployee(employeeId, {
        workDays: workDayNums,
        workStartTime: tempWorkStartTime,
      });
      setEmployee(result.data);
      if (result.data.workDays) {
        setWorkDays(result.data.workDays.map((n: number) => DAY_NUM_TO_LABEL[n] ?? ''));
      }
      if (result.data.workStartTime) {
        setWorkStartTime(result.data.workStartTime);
      }
      setIsEditingWorkInfo(false);
      toast.success('근무 정보가 수정되었습니다.');
    } catch {
      toast.error('근무 정보 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
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

  // --- Disability edit handlers ---
  const handleEditDisability = () => {
    setTempDisabilitySeverity(employee?.disabilitySeverity || '');
    setTempDisabilityRecognitionDate(employee?.disabilityRecognitionDate || '');
    setIsEditingDisability(true);
  };

  const handleSaveDisability = async () => {
    setIsSaving(true);
    try {
      const result = await updateEmployee(employeeId, {
        disabilitySeverity: tempDisabilitySeverity || null,
        disabilityRecognitionDate: tempDisabilityRecognitionDate || null,
      });
      setEmployee(result.data);
      setIsEditingDisability(false);
      toast.success('장애 정보가 수정되었습니다.');
    } catch {
      toast.error('장애 정보 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelDisability = () => {
    setIsEditingDisability(false);
  };

  return {
    employee,
    isLoading,
    error,
    isSaving,
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
