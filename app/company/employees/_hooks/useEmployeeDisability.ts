import { useState } from 'react';
import { updateEmployee } from '@/lib/api/employees';
import { useToast } from '@/components/ui/Toast';
import type { Employee } from '@/types/employee';

export function useEmployeeDisability(employeeId: string, employee: Employee | null) {
  const toast = useToast();
  const [isEditingDisability, setIsEditingDisability] = useState(false);
  const [tempDisabilityType, setTempDisabilityType] = useState('');
  const [tempDisabilitySeverity, setTempDisabilitySeverity] = useState('');
  const [tempDisabilityRecognitionDate, setTempDisabilityRecognitionDate] = useState('');
  const [isSavingDisability, setIsSavingDisability] = useState(false);

  const handleEditDisability = () => {
    setTempDisabilityType(employee?.disabilityType || '');
    setTempDisabilitySeverity(employee?.disabilitySeverity || '');
    setTempDisabilityRecognitionDate(employee?.disabilityRecognitionDate || '');
    setIsEditingDisability(true);
  };

  const handleSaveDisability = async (onSuccess?: (emp: Employee) => void) => {
    setIsSavingDisability(true);
    try {
      const result = await updateEmployee(employeeId, {
        disabilityType: tempDisabilityType || null,
        disabilitySeverity: tempDisabilitySeverity === '중증' || tempDisabilitySeverity === '경증'
          ? tempDisabilitySeverity : null,
        disabilityRecognitionDate: tempDisabilityRecognitionDate || null,
      });
      setIsEditingDisability(false);
      onSuccess?.(result.data);
      toast.success('장애 정보가 수정되었습니다.');
    } catch {
      toast.error('장애 정보 수정에 실패했습니다.');
    } finally {
      setIsSavingDisability(false);
    }
  };

  const handleCancelDisability = () => {
    setIsEditingDisability(false);
    setTempDisabilityType('');
    setTempDisabilitySeverity('');
    setTempDisabilityRecognitionDate('');
  };

  return {
    isEditingDisability,
    tempDisabilityType,
    setTempDisabilityType,
    tempDisabilitySeverity,
    setTempDisabilitySeverity,
    tempDisabilityRecognitionDate,
    setTempDisabilityRecognitionDate,
    isSavingDisability,
    handleEditDisability,
    handleSaveDisability,
    handleCancelDisability,
  };
}
