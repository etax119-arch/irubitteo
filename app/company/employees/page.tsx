'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyEmployee, AddWorkerForm } from '@/types/companyDashboard';
import { EmployeeTable } from '../_components/EmployeeTable';
import { AddWorkerModal } from '../_components/AddWorkerModal';
import { INITIAL_ADD_WORKER_FORM } from '../_data/dummyData';
import { getEmployees } from '@/lib/api/employees';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [addWorkerForm, setAddWorkerForm] = useState<AddWorkerForm>(INITIAL_ADD_WORKER_FORM);
  const [addWorkerComplete, setAddWorkerComplete] = useState<Record<string, boolean>>({});

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEmployees();
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
    setAddWorkerForm((prev) => ({ ...prev, [field]: value }));

    const newComplete = { ...addWorkerComplete };
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
    setAddWorkerComplete(newComplete);
  };

  const handleAddWorkerSubmit = () => {
    setShowAddWorkerModal(false);
    setAddWorkerForm(INITIAL_ADD_WORKER_FORM);
    setAddWorkerComplete({});
  };

  const handleEmployeeClick = (emp: CompanyEmployee) => {
    router.push(`/company/employees/${emp.id}`);
  };

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
        onClose={() => setShowAddWorkerModal(false)}
        onUpdateForm={updateAddWorkerForm}
        onSubmit={handleAddWorkerSubmit}
      />
    </>
  );
}
