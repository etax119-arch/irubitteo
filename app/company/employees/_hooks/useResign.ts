import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export interface ResignForm {
  date: string;
  reason: string;
}

export function useResign() {
  const toast = useToast();
  const [showResignModal, setShowResignModal] = useState(false);
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

  const handleSubmitResign = () => {
    if (!resignForm.date) return;
    toast.success('퇴사 등록이 완료되었습니다.');
    closeResignModal();
  };

  return {
    showResignModal,
    resignForm,
    openResignModal,
    closeResignModal,
    updateResignForm,
    handleSubmitResign,
  };
}
