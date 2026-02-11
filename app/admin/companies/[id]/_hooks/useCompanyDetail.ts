'use client';

import { useState, useCallback } from 'react';
import { getCompany, updateCompany } from '@/lib/api/companies';
import { getEmployees } from '@/lib/api/employees';
import { getCompanyFiles } from '@/lib/api/companyFiles';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { CompanyWithEmployeeCount, CompanyFile } from '@/types/company';
import type { Employee } from '@/types/employee';

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

export function useCompanyDetail(id: string, setFiles: (files: CompanyFile[]) => void) {
  const toast = useToast();

  const [company, setCompany] = useState<CompanyWithEmployeeCount | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<EditedInfo>({
    hrContactName: '',
    hrContactPhone: '',
    hrContactEmail: '',
    address: '',
  });

  const [pmInfo, setPmInfo] = useState<PMInfo>({ name: '', phone: '', email: '' });
  const [isEditingPm, setIsEditingPm] = useState(false);
  const [editedPm, setEditedPm] = useState<PMInfo>({ name: '', phone: '', email: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);
  const [resignForm, setResignForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // 회사 정보 (필수) - 실패 시 catch로
      const companyRes = await getCompany(id);
      const c = companyRes.data;
      setCompany(c);
      setEditedInfo({
        hrContactName: c.hrContactName || '',
        hrContactPhone: c.hrContactPhone || '',
        hrContactEmail: c.hrContactEmail || '',
        address: c.address || '',
      });
      setPmInfo({
        name: c.pmContactName || '',
        phone: c.pmContactPhone || '',
        email: c.pmContactEmail || '',
      });

      // 부가 데이터 (개별 실패 허용)
      const [employeesResult, filesResult] = await Promise.allSettled([
        getEmployees({ companyId: id, limit: 100 }),
        getCompanyFiles(id),
      ]);
      if (employeesResult.status === 'fulfilled') {
        setEmployees(employeesResult.value.data);
      }
      if (filesResult.status === 'fulfilled') {
        setFiles(filesResult.value);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, toast, setFiles]);

  const handleEditPm = () => {
    setEditedPm({ name: pmInfo.name, phone: pmInfo.phone, email: pmInfo.email });
    setIsEditingPm(true);
  };

  const handleSavePm = async () => {
    try {
      const result = await updateCompany(id, {
        pmContactName: editedPm.name || null,
        pmContactPhone: editedPm.phone || null,
        pmContactEmail: editedPm.email || null,
      });
      setCompany(result.data);
      setPmInfo({ ...editedPm });
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

  const handleStartEdit = () => {
    if (company) {
      setEditedInfo({
        hrContactName: company.hrContactName || '',
        hrContactPhone: company.hrContactPhone || '',
        hrContactEmail: company.hrContactEmail || '',
        address: company.address || '',
      });
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const result = await updateCompany(id, {
        hrContactName: editedInfo.hrContactName || null,
        hrContactPhone: editedInfo.hrContactPhone || null,
        hrContactEmail: editedInfo.hrContactEmail || null,
        address: editedInfo.address || null,
      });
      setCompany(result.data);
      setIsEditing(false);
      toast.success('회원사 정보가 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleResign = async () => {
    if (!resignForm.date) return;
    try {
      const result = await updateCompany(id, {
        isActive: false,
        resignDate: resignForm.date,
        resignReason: resignForm.reason || null,
      });
      setCompany(result.data);
      setShowResignModal(false);
      setResignForm({ date: new Date().toISOString().split('T')[0], reason: '' });
      toast.success('탈퇴 처리되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleCopyEmail = () => {
    if (pmInfo.email) {
      navigator.clipboard.writeText(pmInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return {
    company,
    employees,
    loading,
    isEditing,
    editedInfo,
    setEditedInfo,
    setIsEditing,
    pmInfo,
    isEditingPm,
    editedPm,
    setEditedPm,
    copiedEmail,
    showResignModal,
    setShowResignModal,
    resignForm,
    setResignForm,
    fetchData,
    handleStartEdit,
    handleSaveEdit,
    handleEditPm,
    handleSavePm,
    handleCancelPmEdit,
    handleCopyEmail,
    handleResign,
  };
}
