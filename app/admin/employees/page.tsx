'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { WorkerTable } from '../_components/WorkerTable';
import { getEmployees } from '@/lib/api/employees';
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
  const [employees, setEmployees] = useState<EmployeeWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WorkerFilter>('current');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = { limit: 100 };
      if (filter === 'current') {
        params.isActive = true;
        params.standby = false;
      } else if (filter === 'resigned') {
        params.isActive = false;
      } else if (filter === 'waiting') {
        params.standby = true;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const result = await getEmployees(params as Parameters<typeof getEmployees>[0]);
      setEmployees(result.data as EmployeeWithCompany[]);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleViewDetail = (employee: EmployeeWithCompany) => {
    router.push(`/admin/employees/${employee.id}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">근로자 관리</h2>

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

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
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
