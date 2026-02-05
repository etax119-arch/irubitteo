'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyEmployee, AddWorkerForm } from '@/types/companyDashboard';
import { EmployeeTable } from '../_components/EmployeeTable';
import { AddWorkerModal } from '../_components/AddWorkerModal';
import { initialEmployees, INITIAL_ADD_WORKER_FORM } from '../_data/dummyData';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees] = useState<CompanyEmployee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [addWorkerForm, setAddWorkerForm] = useState<AddWorkerForm>(INITIAL_ADD_WORKER_FORM);
  const [addWorkerComplete, setAddWorkerComplete] = useState<Record<string, boolean>>({});

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
