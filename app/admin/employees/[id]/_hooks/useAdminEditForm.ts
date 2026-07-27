'use client';

import { useState } from 'react';
import { useUpdateEmployee } from '@/hooks/useEmployeeMutations';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { NUM_TO_LABEL, LABEL_TO_NUM } from '@/lib/workDays';
import type { Employee, WorkDay } from '@/types/employee';

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

  // --- Work Info ---
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');
  const [tempWorkEndTime, setTempWorkEndTime] = useState('');
  const [savingWorkInfo, setSavingWorkInfo] = useState(false);

  const handleEditWorkInfo = (employee: Employee) => {
    const dayLabels = (employee.workDays ?? []).map((d) => NUM_TO_LABEL[d]).filter(Boolean);
    setTempWorkDays([...dayLabels]);
    setTempWorkStartTime(employee.workStartTime ? employee.workStartTime.slice(0, 5) : '09:00');
    setTempWorkEndTime(employee.workEndTime ? employee.workEndTime.slice(0, 5) : '18:00');
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = async () => {
    try {
      setSavingWorkInfo(true);
      const dayNums = tempWorkDays
        .map((d) => LABEL_TO_NUM[d])
        .filter(Boolean)
        .sort() as WorkDay[];
      await updateMutation.mutateAsync({
        workDays: dayNums,
        workStartTime: tempWorkStartTime,
        workEndTime: tempWorkEndTime,
      });
      setIsEditingWorkInfo(false);
      toast.success('근무 정보가 저장되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingWorkInfo(false);
    }
  };

  const handleCancelEditWorkInfo = () => {
    setIsEditingWorkInfo(false);
    setTempWorkDays([]);
    setTempWorkStartTime('');
    setTempWorkEndTime('');
  };

  const toggleTempWorkDay = (day: string) => {
    if (tempWorkDays.includes(day)) {
      setTempWorkDays(tempWorkDays.filter((d) => d !== day));
    } else {
      setTempWorkDays([...tempWorkDays, day]);
    }
  };

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
    isEditingWorkInfo,
    tempWorkDays,
    tempWorkStartTime,
    setTempWorkStartTime,
    tempWorkEndTime,
    setTempWorkEndTime,
    savingWorkInfo,
    handleEditWorkInfo,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
    toggleTempWorkDay,
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
