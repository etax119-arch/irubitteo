'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { WorkerTable } from '../_components/WorkerTable';
import { workersData } from '../_data/dummyData';
import type { Worker, WorkerFilter } from '@/types/adminDashboard';

const filters: { id: WorkerFilter; label: string }[] = [
  { id: 'current', label: '현재 근로자' },
  { id: 'resigned', label: '퇴사자' },
  { id: 'waiting', label: '대기자' },
  { id: 'all', label: '전체' },
];

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
      {/* 타이틀 */}
      <h2 className="text-2xl font-bold text-gray-900">근로자 관리</h2>

      {/* 필터 버튼 + 검색창 (한 줄 배치) */}
      <div className="flex items-center justify-between gap-6">
        {/* 좌측: 필터 버튼 그룹 */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap',
                filter === f.id
                  ? 'bg-white text-duru-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 우측: 검색창 (확대) */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 회사명, 지역 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 text-sm"
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
