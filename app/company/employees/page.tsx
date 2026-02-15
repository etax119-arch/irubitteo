'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import type { Employee, WorkDay } from '@/types/employee';
import type { AddWorkerForm } from '@/types/companyDashboard';
import { useQueryClient } from '@tanstack/react-query';
import { employeeKeys } from '@/lib/query/keys';
import { useCompanyPaginatedEmployees } from '@/hooks/useEmployeeQuery';
import { useCreateEmployee } from '@/hooks/useEmployeeMutations';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { EmployeeTable } from '../_components/EmployeeTable';
import { AddWorkerModal } from '../_components/AddWorkerModal';
import { LABEL_TO_NUM } from '@/lib/workDays';
import { formatDateAsKST } from '@/lib/kst';

function createInitialAddWorkerForm(): AddWorkerForm {
  return {
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
    hireDate: formatDateAsKST(new Date()),
    recognitionDate: '',
    workDays: [],
    workStartTime: '',
    workerId: '',
  };
}

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
  const queryClient = useQueryClient();
  const createMutation = useCreateEmployee();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [addWorkerForm, setAddWorkerForm] = useState<AddWorkerForm>(() => createInitialAddWorkerForm());
  const [addWorkerComplete, setAddWorkerComplete] = useState<Record<string, boolean>>({});
  const [workerIdManuallyEdited, setWorkerIdManuallyEdited] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const employeesQuery = useCompanyPaginatedEmployees(debouncedSearch, page);
  const employees = employeesQuery.data?.employees ?? [];
  const pagination = employeesQuery.data?.pagination;
  const isRefreshing = employeesQuery.isFetching && !employeesQuery.isLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
  };

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

    createMutation.mutate(
      {
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
      },
      {
        onSuccess: () => {
          toast.success('근로자가 추가되었습니다.');
          setShowAddWorkerModal(false);
          setAddWorkerForm(createInitialAddWorkerForm());
          setAddWorkerComplete({});
          setWorkerIdManuallyEdited(false);
        },
        onError: (err) => {
          if (err instanceof AxiosError && err.response?.status === 409) {
            toast.error('이미 사용 중인 고유번호입니다. 다른 번호를 입력해주세요.');
          } else {
            toast.error('근로자 추가에 실패했습니다.');
          }
        },
      }
    );
  };

  const handleEmployeeClick = (emp: Employee) => {
    router.push(`/company/employees/${emp.id}`);
  };

  const handleCloseAddWorkerModal = () => {
    setShowAddWorkerModal(false);
    setAddWorkerForm(createInitialAddWorkerForm());
    setAddWorkerComplete({});
    setWorkerIdManuallyEdited(false);
  };

  const workerIdAutoGenerated = !workerIdManuallyEdited && !!addWorkerForm.workerId;

  if (employeesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-40 h-10 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-64 h-10 rounded-lg" />
            <Skeleton className="w-32 h-10 rounded-lg" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <Skeleton className="h-8 rounded" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (employeesQuery.error) {
    return (
      <div className="text-center py-20" role="alert">
        <p className="text-red-500 mb-4">근로자 목록을 불러오는데 실패했습니다.</p>
        <Button variant="ghost" onClick={handleRefresh}>
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
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      {pagination && (
        <PaginationBar
          currentPage={page}
          pagination={pagination}
          onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
        />
      )}

      <AddWorkerModal
        isOpen={showAddWorkerModal}
        form={addWorkerForm}
        complete={addWorkerComplete}
        isSubmitting={createMutation.isPending}
        workerIdAutoGenerated={workerIdAutoGenerated}
        onClose={handleCloseAddWorkerModal}
        onUpdateForm={updateAddWorkerForm}
        onManualWorkerIdEdit={handleManualWorkerIdEdit}
        onSubmit={handleAddWorkerSubmit}
      />
    </>
  );
}
