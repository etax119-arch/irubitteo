'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { WorkerTable } from '../_components/WorkerTable';
import { workersData } from '../_data/dummyData';
import type { Worker, WorkerFilter } from '@/types/adminDashboard';

export default function AdminEmployeesPage() {
  const router = useRouter();
  const [workers] = useState<Worker[]>(workersData);
  const [filter, setFilter] = useState<WorkerFilter>('current');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetail = (worker: Worker) => {
    router.push(`/admin/employees/${worker.id}`);
  };

  const searchedWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">근로자 관리</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 회사명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
          />
        </div>
      </div>

      <WorkerTable
        workers={searchedWorkers}
        filter={filter}
        onFilterChange={setFilter}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
}
