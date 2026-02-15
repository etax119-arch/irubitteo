'use client';

import { useState } from 'react';
import { useUpdateCompany } from '../../../_hooks/useCompanyMutations';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { CompanyWithEmployeeCount } from '@/types/company';

interface EditedInfo {
  hrContactName: string;
  hrContactPhone: string;
  hrContactEmail: string;
  address: string;
}

interface PMInfo {
  name: string;
  phone: string;
  email: string;
}

export function useCompanyDetailUI(companyId: string) {
  const toast = useToast();
  const updateMutation = useUpdateCompany(companyId);

  // HR info editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<EditedInfo>({
    hrContactName: '',
    hrContactPhone: '',
    hrContactEmail: '',
    address: '',
  });

  // PM info editing
  const [isEditingPm, setIsEditingPm] = useState(false);
  const [editedPm, setEditedPm] = useState<PMInfo>({ name: '', phone: '', email: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Resign modal
  const [showResignModal, setShowResignModal] = useState(false);
  const [resignForm, setResignForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const handleStartEdit = (company: CompanyWithEmployeeCount) => {
    setEditedInfo({
      hrContactName: company.hrContactName || '',
      hrContactPhone: company.hrContactPhone || '',
      hrContactEmail: company.hrContactEmail || '',
      address: company.address || '',
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateMutation.mutateAsync({
        hrContactName: editedInfo.hrContactName || null,
        hrContactPhone: editedInfo.hrContactPhone || null,
        hrContactEmail: editedInfo.hrContactEmail || null,
        address: editedInfo.address || null,
      });
      setIsEditing(false);
      toast.success('회원사 정보가 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleEditPm = (company: CompanyWithEmployeeCount) => {
    setEditedPm({
      name: company.pmContactName || '',
      phone: company.pmContactPhone || '',
      email: company.pmContactEmail || '',
    });
    setIsEditingPm(true);
  };

  const handleSavePm = async () => {
    try {
      await updateMutation.mutateAsync({
        pmContactName: editedPm.name || null,
        pmContactPhone: editedPm.phone || null,
        pmContactEmail: editedPm.email || null,
      });
      setIsEditingPm(false);
      setEditedPm({ name: '', phone: '', email: '' });
      toast.success('영업 담당자 정보가 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleCancelPmEdit = () => {
    setIsEditingPm(false);
    setEditedPm({ name: '', phone: '', email: '' });
  };

  const handleCopyEmail = (email: string | null) => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleResign = async () => {
    if (!resignForm.date) return;
    try {
      await updateMutation.mutateAsync({
        isActive: false,
        resignDate: resignForm.date,
        resignReason: resignForm.reason || null,
      });
      setShowResignModal(false);
      setResignForm({ date: new Date().toISOString().split('T')[0], reason: '' });
      toast.success('탈퇴 처리되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleRestore = async () => {
    try {
      await updateMutation.mutateAsync({
        isActive: true,
        resignDate: null,
        resignReason: null,
      });
      toast.success('회원사가 복구되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    // HR info edit
    isEditing,
    editedInfo,
    setEditedInfo,
    setIsEditing,
    handleStartEdit,
    handleSaveEdit,
    // PM edit
    isEditingPm,
    editedPm,
    setEditedPm,
    copiedEmail,
    handleEditPm,
    handleSavePm,
    handleCancelPmEdit,
    handleCopyEmail,
    // Resign
    showResignModal,
    setShowResignModal,
    resignForm,
    setResignForm,
    handleResign,
    handleRestore,
  };
}
