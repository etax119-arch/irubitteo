'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import type { Employee } from '@/types/employee';
import type { AddWorkerForm } from '@/types/companyDashboard';
import { EmployeeTable } from '../_components/EmployeeTable';
import { AddWorkerModal } from '../_components/AddWorkerModal';
import { INITIAL_ADD_WORKER_FORM } from '../_data/dummyData';
import { getEmployees, createEmployee } from '@/lib/api/employees';
import { useToast } from '@/components/ui/Toast';

const WORK_DAY_MAP: Record<string, number> = {
  '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7,
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
    setAddWorkerForm((prev) => {
      const updated = { ...prev, [field]: value };

      // ssn 또는 phone 변경 시 workerId 자동 생성
      if ((field === 'ssn' || field === 'phone') && !workerIdManuallyEdited) {
        const ssn = field === 'ssn' ? (value as string) : prev.ssn;
        const phone = field === 'phone' ? (value as string) : prev.phone;
        const autoId = generateWorkerId(ssn, phone);
        if (autoId) {
          updated.workerId = autoId;
        }
      }

      return updated;
    });

    // complete 상태 업데이트
    setAddWorkerComplete((prev) => {
      const newComplete = { ...prev };

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
      if ((field === 'ssn' || field === 'phone') && !workerIdManuallyEdited) {
        const ssn = field === 'ssn' ? (value as string) : addWorkerForm.ssn;
        const phone = field === 'phone' ? (value as string) : addWorkerForm.phone;
        const autoId = generateWorkerId(ssn, phone);
        if (autoId) {
          newComplete.workerId = true;
        }
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
    try {
      setIsSubmitting(true);
      await createEmployee({
        name: addWorkerForm.name,
        ssn: addWorkerForm.ssn,
        phone: addWorkerForm.phone,
        gender: addWorkerForm.gender,
        uniqueCode: addWorkerForm.workerId,
        hireDate: addWorkerForm.hireDate,
        workDays: addWorkerForm.workDays.map((day) => WORK_DAY_MAP[day]),
        workStartTime: addWorkerForm.workStartTime,
        disabilityType: addWorkerForm.disabilityType,
        disabilitySeverity: addWorkerForm.disabilitySeverity,
        disabilityRecognitionDate: addWorkerForm.recognitionDate,
        emergencyContactName: addWorkerForm.emergencyName,
        emergencyContactRelation: addWorkerForm.emergencyRelation,
        emergencyContactPhone: addWorkerForm.emergencyPhone,
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

  const workerIdAutoGenerated = !workerIdManuallyEdited && !!addWorkerForm.workerId;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchEmployees}
          className="text-duru-orange-600 hover:text-duru-orange-700 font-semibold"
        >
          다시 시도
        </button>
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
        onClose={() => setShowAddWorkerModal(false)}
        onUpdateForm={updateAddWorkerForm}
        onManualWorkerIdEdit={handleManualWorkerIdEdit}
        onSubmit={handleAddWorkerSubmit}
      />
    </>
  );
}
