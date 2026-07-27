'use client';

import { useState } from 'react';
import { useUpdateEmployee } from '@/hooks/useEmployeeMutations';
import { useWorkInfoForm } from '@/hooks/useWorkInfoForm';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import type { Employee } from '@/types/employee';

export type ProfileFormState = {
  name: string;
  phone: string;
  gender: string;
  ssn: string;
  hireDate: string;
  addressCity: string;
  addressDistrict: string;
  addressDetail: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  uniqueCode: string;
  annualLeaveTotal: number;
};

export function useAdminEditForm(employeeId: string) {
  const toast = useToast();
  const updateMutation = useUpdateEmployee(employeeId);

  // --- Admin Notes ---
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const handleEditNotes = (employee: Employee) => {
    setTempNotes(employee.adminNote || '');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await updateMutation.mutateAsync({ adminNote: tempNotes || null });
      setIsEditingNotes(false);
      toast.success('비고란이 저장되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setIsEditingNotes(false);
    setTempNotes('');
  };

  // --- Work Info (company 상세와 공유) ---
  const workInfo = useWorkInfoForm(employeeId);

  // --- Profile ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: '',
    phone: '',
    gender: '',
    ssn: '',
    hireDate: '',
    addressCity: '',
    addressDistrict: '',
    addressDetail: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    uniqueCode: '',
    annualLeaveTotal: 0,
  });

  const handleEditProfile = (employee: Employee) => {
    setProfileForm({
      name: employee.name || '',
      phone: employee.phone || '',
      gender: employee.gender || '',
      ssn: employee.ssn || '',
      hireDate: employee.hireDate ? employee.hireDate.slice(0, 10) : '',
      addressCity: employee.addressCity || '',
      addressDistrict: employee.addressDistrict || '',
      addressDetail: employee.addressDetail || '',
      emergencyContactName: employee.emergencyContactName || '',
      emergencyContactRelation: employee.emergencyContactRelation || '',
      emergencyContactPhone: employee.emergencyContactPhone || '',
      uniqueCode: employee.uniqueCode || '',
      annualLeaveTotal: employee.annualLeaveTotal ?? 0,
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (employee: Employee) => {
    setIsSavingProfile(true);
    try {
      const payload: Parameters<typeof updateMutation.mutateAsync>[0] = {
        name: profileForm.name,
        phone: profileForm.phone,
        gender: profileForm.gender as '남' | '여',
        ssn: profileForm.ssn,
        hireDate: profileForm.hireDate,
        addressCity: profileForm.addressCity || null,
        addressDistrict: profileForm.addressDistrict || null,
        addressDetail: profileForm.addressDetail || null,
        emergencyContactName: profileForm.emergencyContactName || null,
        emergencyContactRelation: profileForm.emergencyContactRelation || null,
        emergencyContactPhone: profileForm.emergencyContactPhone || null,
        annualLeaveTotal: profileForm.annualLeaveTotal,
      };
      if (profileForm.uniqueCode !== employee.uniqueCode) {
        payload.uniqueCode = profileForm.uniqueCode;
      }
      await updateMutation.mutateAsync(payload);
      setIsEditingProfile(false);
      toast.success('프로필 정보가 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
  };

  const updateProfileForm = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  // --- Disability ---
  const [isEditingDisability, setIsEditingDisability] = useState(false);
  const [tempDisabilityType, setTempDisabilityType] = useState('');
  const [tempDisabilitySeverity, setTempDisabilitySeverity] = useState('');
  const [tempDisabilityRecognitionDate, setTempDisabilityRecognitionDate] = useState('');
  const [isSavingDisability, setIsSavingDisability] = useState(false);

  const handleEditDisability = (employee: Employee) => {
    setTempDisabilityType(employee.disabilityType || '');
    setTempDisabilitySeverity(employee.disabilitySeverity || '');
    setTempDisabilityRecognitionDate(
      employee.disabilityRecognitionDate ? employee.disabilityRecognitionDate.slice(0, 10) : '',
    );
    setIsEditingDisability(true);
  };

  const handleSaveDisability = async () => {
    setIsSavingDisability(true);
    try {
      await updateMutation.mutateAsync({
        disabilityType: tempDisabilityType || null,
        disabilitySeverity:
          tempDisabilitySeverity === '중증' || tempDisabilitySeverity === '경증'
            ? tempDisabilitySeverity
            : null,
        disabilityRecognitionDate: tempDisabilityRecognitionDate || null,
      });
      setIsEditingDisability(false);
      toast.success('장애 정보가 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
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

  // --- Company Note (기업 비고란) ---
  const [isEditingCompanyNote, setIsEditingCompanyNote] = useState(false);
  const [tempCompanyNote, setTempCompanyNote] = useState('');
  const [isSavingCompanyNote, setIsSavingCompanyNote] = useState(false);

  const handleEditCompanyNote = (employee: Employee) => {
    setTempCompanyNote(employee.companyNote || '');
    setIsEditingCompanyNote(true);
  };

  const handleSaveCompanyNote = async () => {
    setIsSavingCompanyNote(true);
    try {
      await updateMutation.mutateAsync({ companyNote: tempCompanyNote || null });
      setIsEditingCompanyNote(false);
      toast.success('기업 비고란이 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingCompanyNote(false);
    }
  };

  const handleCancelCompanyNote = () => {
    setIsEditingCompanyNote(false);
    setTempCompanyNote('');
  };

  return {
    // Notes
    isEditingNotes,
    tempNotes,
    setTempNotes,
    savingNotes,
    handleEditNotes,
    handleSaveNotes,
    handleCancelNotes,
    // Work Info
    ...workInfo,
    // Profile
    isEditingProfile,
    isSavingProfile,
    profileForm,
    handleEditProfile,
    handleSaveProfile,
    handleCancelProfile,
    updateProfileForm,
    // Disability
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
    // Company Note
    isEditingCompanyNote,
    tempCompanyNote,
    setTempCompanyNote,
    isSavingCompanyNote,
    handleEditCompanyNote,
    handleSaveCompanyNote,
    handleCancelCompanyNote,
  };
}
