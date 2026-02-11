import { useState, useCallback } from 'react';
import { updateEmployee } from '@/lib/api/employees';
import { useToast } from '@/components/ui/Toast';
import type { Employee } from '@/types/employee';

export function useEmployeeNotes(employeeId: string) {
  const toast = useToast();
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const syncFromEmployee = useCallback((emp: Employee) => {
    setNotes(emp.companyNote || '');
  }, []);

  const handleEditNotes = () => {
    setTempNotes(notes);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async (onSuccess?: (emp: Employee) => void) => {
    setIsSavingNotes(true);
    try {
      const result = await updateEmployee(employeeId, { companyNote: tempNotes });
      setNotes(result.data.companyNote || '');
      setIsEditingNotes(false);
      onSuccess?.(result.data);
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

  return {
    notes,
    isEditingNotes,
    tempNotes,
    setTempNotes,
    isSavingNotes,
    syncFromEmployee,
    handleEditNotes,
    handleSaveNotes,
    handleCancelNotes,
  };
}
