import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { updateEmployee } from '@/lib/api/employees';

export interface ResignForm {
  date: string;
  reason: string;
}

interface UseResignOptions {
  employeeId: string;
  onSuccess: () => void;
}

export function useResign({ employeeId, onSuccess }: UseResignOptions) {
  const toast = useToast();
  const [showResignModal, setShowResignModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resignForm, setResignForm] = useState<ResignForm>({
    date: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const openResignModal = () => {
    setShowResignModal(true);
  };

  const closeResignModal = () => {
    setShowResignModal(false);
    setResignForm({ date: new Date().toISOString().split('T')[0], reason: '' });
  };

  const updateResignForm = (patch: Partial<ResignForm>) => {
    setResignForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmitResign = async () => {
    if (!resignForm.date) return;

    try {
      setIsSubmitting(true);
      await updateEmployee(employeeId, {
        isActive: false,
        resignDate: resignForm.date,
        resignReason: resignForm.reason || null,
      });
      toast.success('퇴사 등록이 완료되었습니다.');
      closeResignModal();
      onSuccess();
    } catch {
      toast.error('퇴사 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showResignModal,
    resignForm,
    isSubmitting,
    openResignModal,
    closeResignModal,
    updateResignForm,
    handleSubmitResign,
  };
}
