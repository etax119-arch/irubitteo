import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { updateEmployee } from '@/lib/api/employees';
import { formatDateAsKST } from '@/lib/kst';

export interface ResignForm {
  date: string;
  reason: string;
  includeInWaitlist: boolean;
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
    date: formatDateAsKST(new Date()),
    reason: '',
    includeInWaitlist: false,
  });

  const openResignModal = () => {
    setResignForm({ date: formatDateAsKST(new Date()), reason: '', includeInWaitlist: false });
    setShowResignModal(true);
  };

  const closeResignModal = () => {
    setShowResignModal(false);
    setResignForm({ date: formatDateAsKST(new Date()), reason: '', includeInWaitlist: false });
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
        standby: resignForm.includeInWaitlist,
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
