import { useState } from 'react';
import { useUpdateEmployee } from '@/hooks/useEmployeeMutations';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { formatDateAsKST } from '@/lib/kst';
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
};

export interface ResignForm {
  date: string;
  reason: string;
  includeInWaitlist: boolean;
}

export function useEmployeeEditForm(employeeId: string) {
  const toast = useToast();
  const updateMutation = useUpdateEmployee(employeeId);

  // --- Notes ---
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleEditNotes = (employee: Employee) => {
    setTempNotes(employee.companyNote || '');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await updateMutation.mutateAsync({ companyNote: tempNotes });
      setIsEditingNotes(false);
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

  // --- Work Info ---
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');
  const [isSavingWorkInfo, setIsSavingWorkInfo] = useState(false);

  const handleEditWorkInfo = (employee: Employee) => {
    const dayLabels = (employee.workDays ?? []).map((n: number) => NUM_TO_LABEL[n] ?? '');
    setTempWorkDays([...dayLabels]);
    setTempWorkStartTime(employee.workStartTime || '');
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = async () => {
    setIsSavingWorkInfo(true);
    try {
      const workDayNums = tempWorkDays
        .map((d) => LABEL_TO_NUM[d])
        .filter((n): n is WorkDay => n !== undefined);
      await updateMutation.mutateAsync({
        workDays: workDayNums,
        workStartTime: tempWorkStartTime,
      });
      setIsEditingWorkInfo(false);
      toast.success('근무 정보가 수정되었습니다.');
    } catch {
      toast.error('근무 정보 수정에 실패했습니다.');
    } finally {
      setIsSavingWorkInfo(false);
    }
  };

  const handleCancelEditWorkInfo = () => {
    setIsEditingWorkInfo(false);
    setTempWorkDays([]);
    setTempWorkStartTime('');
  };

  const toggleTempWorkDay = (day: string) => {
    setTempWorkDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
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
    setTempDisabilityRecognitionDate(employee.disabilityRecognitionDate || '');
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
  });

  const handleEditProfile = (employee: Employee) => {
    setProfileForm({
      name: employee.name || '',
      phone: employee.phone || '',
      gender: employee.gender || '',
      ssn: employee.ssn || '',
      hireDate: employee.hireDate || '',
      addressCity: employee.addressCity || '',
      addressDistrict: employee.addressDistrict || '',
      addressDetail: employee.addressDetail || '',
      emergencyContactName: employee.emergencyContactName || '',
      emergencyContactRelation: employee.emergencyContactRelation || '',
      emergencyContactPhone: employee.emergencyContactPhone || '',
      uniqueCode: employee.uniqueCode || '',
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

  // --- Resign ---
  const [showResignModal, setShowResignModal] = useState(false);
  const [isSubmittingResign, setIsSubmittingResign] = useState(false);
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
      setIsSubmittingResign(true);
      await updateMutation.mutateAsync({
        isActive: false,
        resignDate: resignForm.date,
        resignReason: resignForm.reason || null,
        standby: resignForm.includeInWaitlist,
      });
      toast.success('퇴사 등록이 완료되었습니다.');
      closeResignModal();
    } catch {
      toast.error('퇴사 등록에 실패했습니다.');
    } finally {
      setIsSubmittingResign(false);
    }
  };

  return {
    // Notes
    isEditingNotes,
    tempNotes,
    setTempNotes,
    isSavingNotes,
    handleEditNotes,
    handleSaveNotes,
    handleCancelNotes,
    // Work Info
    isEditingWorkInfo,
    tempWorkDays,
    tempWorkStartTime,
    setTempWorkStartTime,
    isSavingWorkInfo,
    handleEditWorkInfo,
    handleSaveWorkInfo,
    handleCancelEditWorkInfo,
    toggleTempWorkDay,
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
    // Profile
    isEditingProfile,
    isSavingProfile,
    profileForm,
    handleEditProfile,
    handleSaveProfile,
    handleCancelProfile,
    updateProfileForm,
    // Resign
    showResignModal,
    resignForm,
    isSubmittingResign,
    openResignModal,
    closeResignModal,
    updateResignForm,
    handleSubmitResign,
  };
}
