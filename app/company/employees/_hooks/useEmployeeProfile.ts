import { useState, useCallback } from 'react';
import { updateEmployee } from '@/lib/api/employees';
import { useToast } from '@/components/ui/Toast';
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
};

export function useEmployeeProfile(employeeId: string) {
  const toast = useToast();
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
  });

  const syncFromEmployee = useCallback((emp: Employee) => {
    // no-op in read mode; form is populated on edit start
  }, []);

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
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (onSuccess?: (emp: Employee) => void) => {
    setIsSavingProfile(true);
    try {
      const result = await updateEmployee(employeeId, {
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
      });
      setIsEditingProfile(false);
      onSuccess?.(result.data);
      toast.success('프로필 정보가 수정되었습니다.');
    } catch {
      toast.error('프로필 수정에 실패했습니다.');
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

  return {
    isEditingProfile,
    isSavingProfile,
    profileForm,
    syncFromEmployee,
    handleEditProfile,
    handleSaveProfile,
    handleCancelProfile,
    updateProfileForm,
  };
}
