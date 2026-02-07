import { useState, useEffect } from 'react';
import { getEmployee, updateEmployee } from '@/lib/api/employees';
import type { CompanyEmployee } from '@/types/companyDashboard';

const DAY_NUM_TO_LABEL: Record<number, string> = {
  1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 7: '일',
};

const LABEL_TO_DAY_NUM: Record<string, number> = {
  '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7,
};

export function getEmployeeStatusLabel(status: string, isActive: boolean) {
  if (!isActive) return '퇴사';
  switch (status) {
    case 'checkin':
      return '근무중';
    case 'checkout':
      return '퇴근';
    case 'absent':
      return '결근';
    default:
      return status;
  }
}

export function getEmployeeStatusStyle(status: string, isActive: boolean) {
  if (!isActive) return 'bg-gray-200 text-gray-600';
  switch (status) {
    case 'checkin':
      return 'bg-green-100 text-green-700';
    case 'checkout':
      return 'bg-blue-100 text-blue-700';
    case 'absent':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}

export function useEmployeeDetail(employeeId: string) {
  const [employee, setEmployee] = useState<CompanyEmployee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const result = await updateEmployee(employeeId, { companyNote: tempNotes });
      setNotes(result.data.companyNote || '');
      setEmployee(result.data);
      setIsEditingNotes(false);
    } catch {
      alert('비고란 수정에 실패했습니다.');
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
    try {
      const workDayNums = tempWorkDays.map((d) => LABEL_TO_DAY_NUM[d]).filter(Boolean);
      const result = await updateEmployee(employeeId, {
        workDays: workDayNums,
        workStartTime: tempWorkStartTime,
      });
      setWorkDays(tempWorkDays);
      setWorkStartTime(tempWorkStartTime);
      setEmployee(result.data);
      setIsEditingWorkInfo(false);
    } catch {
      alert('근무 정보 수정에 실패했습니다.');
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
    try {
      const result = await updateEmployee(employeeId, {
        disabilitySeverity: tempDisabilitySeverity || null,
        disabilityRecognitionDate: tempDisabilityRecognitionDate || null,
      });
      setEmployee(result.data);
      setIsEditingDisability(false);
    } catch {
      alert('장애 정보 수정에 실패했습니다.');
    }
  };

  const handleCancelDisability = () => {
    setIsEditingDisability(false);
  };

  return {
    employee,
    isLoading,
    error,
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
