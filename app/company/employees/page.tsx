'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import type { Employee, WorkDay } from '@/types/employee';
import type { AddWorkerForm } from '@/types/companyDashboard';
import { getEmployees, createEmployee } from '@/lib/api/employees';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { EmployeeTable } from '../_components/EmployeeTable';
import { AddWorkerModal } from '../_components/AddWorkerModal';
import { LABEL_TO_NUM } from '../_utils/workDays';

const INITIAL_ADD_WORKER_FORM: AddWorkerForm = {
  name: '',
  ssn: '',
  phone: '',
  gender: '',
  addressCity: '',
  addressDistrict: '',
  addressDetail: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
  disabilityType: '',
  disabilitySeverity: '',
  hireDate: '',
  recognitionDate: '',
  workDays: [],
  workStartTime: '',
  workerId: '',
};

function generateWorkerId(ssn: string, phone: string): string | null {
  const ssnDigits = ssn.replace(/\D/g, '');
  const phoneDigits = phone.replace(/\D/g, '');
  if (ssnDigits.length < 6 || phoneDigits.length < 4) return null;
  const mmdd = ssnDigits.slice(2, 6);
  const last4 = phoneDigits.slice(-4);
  return mmdd + last4;
}

export default function EmployeesPage() {
  const router = useRouter();
  const toast = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [addWorkerForm, setAddWorkerForm] = useState<AddWorkerForm>(INITIAL_ADD_WORKER_FORM);
  const [addWorkerComplete, setAddWorkerComplete] = useState<Record<string, boolean>>({});
  const [workerIdManuallyEdited, setWorkerIdManuallyEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEmployees({ isActive: true });
      setEmployees(response.data);
    } catch {
      setError('근로자 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateAddWorkerForm = (field: keyof AddWorkerForm, value: string | string[]) => {
    let autoId: string | null = null;

    setAddWorkerForm((prev) => {
      const updated = { ...prev, [field]: value };

      // 시/도 변경 시 군/구 리셋
      if (field === 'addressCity') {
        updated.addressDistrict = '';
      }

      // ssn 또는 phone 변경 시 workerId 자동 생성
      if ((field === 'ssn' || field === 'phone') && !workerIdManuallyEdited) {
        const ssn = field === 'ssn' ? (value as string) : prev.ssn;
        const phone = field === 'phone' ? (value as string) : prev.phone;
        autoId = generateWorkerId(ssn, phone);
        if (autoId) {
          updated.workerId = autoId;
        }
      }

      return updated;
    });

    // complete 상태 업데이트
    setAddWorkerComplete((prev) => {
      const newComplete = { ...prev };

      // 시/도 변경 시 군/구 complete 상태도 삭제
      if (field === 'addressCity') {
        delete newComplete.addressDistrict;
      }

      // 현재 필드 처리
      if (field === 'workDays') {
        if (Array.isArray(value) && value.length > 0) {
          newComplete[field] = true;
        } else {
          delete newComplete[field];
        }
      } else if (value && value.toString().trim()) {
        newComplete[field] = true;
      } else {
        delete newComplete[field];
      }

      // ssn/phone 변경으로 workerId가 자동 생성된 경우 complete 상태도 업데이트
      if ((field === 'ssn' || field === 'phone') && !workerIdManuallyEdited && autoId) {
        newComplete.workerId = true;
      }

      return newComplete;
    });
  };

  const handleManualWorkerIdEdit = (value: string) => {
    setWorkerIdManuallyEdited(true);
    setAddWorkerForm((prev) => ({ ...prev, workerId: value }));
    setAddWorkerComplete((prev) => {
      const newComplete = { ...prev };
      if (value.trim()) {
        newComplete.workerId = true;
      } else {
        delete newComplete.workerId;
      }
      return newComplete;
    });
  };

  const handleAddWorkerSubmit = async () => {
    if (!addWorkerForm.name.trim() || !addWorkerForm.hireDate) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }
    const gender = addWorkerForm.gender;
    if (gender !== '남' && gender !== '여') {
      toast.error('성별을 선택해주세요.');
      return;
    }
    const severity = addWorkerForm.disabilitySeverity;
    if (severity && severity !== '중증' && severity !== '경증') {
      toast.error('장애 정도를 올바르게 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createEmployee({
        name: addWorkerForm.name,
        ssn: addWorkerForm.ssn,
        phone: addWorkerForm.phone,
        gender,
        uniqueCode: addWorkerForm.workerId,
        hireDate: addWorkerForm.hireDate,
        workDays: addWorkerForm.workDays.map((day) => LABEL_TO_NUM[day]).filter((n): n is WorkDay => n !== undefined),
        workStartTime: addWorkerForm.workStartTime,
        disabilityType: addWorkerForm.disabilityType,
        disabilitySeverity: severity === '중증' || severity === '경증' ? severity : '경증',
        disabilityRecognitionDate: addWorkerForm.recognitionDate,
        emergencyContactName: addWorkerForm.emergencyName,
        emergencyContactRelation: addWorkerForm.emergencyRelation,
        emergencyContactPhone: addWorkerForm.emergencyPhone,
        addressCity: addWorkerForm.addressCity,
        addressDistrict: addWorkerForm.addressDistrict,
        addressDetail: addWorkerForm.addressDetail || undefined,
      });

      toast.success('근로자가 추가되었습니다.');
      setShowAddWorkerModal(false);
      setAddWorkerForm(INITIAL_ADD_WORKER_FORM);
      setAddWorkerComplete({});
      setWorkerIdManuallyEdited(false);
      fetchEmployees();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 409) {
        toast.error('이미 사용 중인 고유번호입니다. 다른 번호를 입력해주세요.');
      } else {
        toast.error('근로자 추가에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmployeeClick = (emp: Employee) => {
    router.push(`/company/employees/${emp.id}`);
  };

  const handleCloseAddWorkerModal = () => {
    setShowAddWorkerModal(false);
    setAddWorkerForm(INITIAL_ADD_WORKER_FORM);
    setAddWorkerComplete({});
    setWorkerIdManuallyEdited(false);
  };

  const workerIdAutoGenerated = !workerIdManuallyEdited && !!addWorkerForm.workerId;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20" role="status">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20" role="alert">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="ghost" onClick={fetchEmployees}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <>
      <EmployeeTable
        employees={employees}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddWorker={() => setShowAddWorkerModal(true)}
        onEmployeeClick={handleEmployeeClick}
      />

      <AddWorkerModal
        isOpen={showAddWorkerModal}
        form={addWorkerForm}
        complete={addWorkerComplete}
        isSubmitting={isSubmitting}
        workerIdAutoGenerated={workerIdAutoGenerated}
        onClose={handleCloseAddWorkerModal}
        onUpdateForm={updateAddWorkerForm}
        onManualWorkerIdEdit={handleManualWorkerIdEdit}
        onSubmit={handleAddWorkerSubmit}
      />
    </>
  );
}
