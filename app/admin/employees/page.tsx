'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Search, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { WorkerTable } from '../_components/WorkerTable';
import { useAdminEmployees } from '@/hooks/useEmployeeQuery';
import { employeeKeys } from '@/lib/query/keys';
import type { EmployeeWithCompany } from '@/types/employee';
import type { WorkerFilter } from '@/types/adminDashboard';

const filters: { id: WorkerFilter; label: string }[] = [
  { id: 'current', label: '현재 근로자' },
  { id: 'resigned', label: '퇴사자' },
  { id: 'waiting', label: '대기자' },
  { id: 'all', label: '전체' },
];

export default function AdminEmployeesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<WorkerFilter>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const employeesQuery = useAdminEmployees(filter, debouncedSearch);
  const employees = employeesQuery.data ?? [];

  const handleViewDetail = (employee: EmployeeWithCompany) => {
    router.push(`/admin/employees/${employee.id}`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: employeeKeys.all });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">근로자 관리</h2>
        <button
          onClick={handleRefresh}
          disabled={employeesQuery.isFetching}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={cn('w-4 h-4', employeesQuery.isFetching && 'animate-spin')}
          />
          새로고침
        </button>
      </div>

      <div className="flex items-center justify-between gap-6">
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

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 회사명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 text-sm"
          />
        </div>
      </div>

      {employeesQuery.isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
        </div>
      ) : employeesQuery.isError ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-gray-600">근로자 목록을 불러오지 못했습니다.</p>
          <button
            onClick={() => employeesQuery.refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-duru-orange-500 rounded-lg hover:bg-duru-orange-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <WorkerTable
          workers={employees}
          onViewDetail={handleViewDetail}
        />
      )}
    </div>
  );
}
