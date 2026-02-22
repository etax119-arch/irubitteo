'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Search, RefreshCw, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { useToast } from '@/components/ui/Toast';
import { WorkerTable } from '../_components/WorkerTable';
import { useAdminEmployees } from '@/hooks/useEmployeeQuery';
import { useDeleteEmployee } from '@/hooks/useEmployeeMutations';
import { extractErrorMessage } from '@/lib/api/error';
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
  const toast = useToast();
  const [filter, setFilter] = useState<WorkerFilter>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeWithCompany | null>(null);
  const deleteMutation = useDeleteEmployee();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const employeesQuery = useAdminEmployees(filter, debouncedSearch, page);
  const employees = employeesQuery.data?.employees ?? [];
  const pagination = employeesQuery.data?.pagination;

  const handleViewDetail = (employee: EmployeeWithCompany) => {
    router.push(`/admin/employees/${employee.id}`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`${deleteTarget.name} 근로자가 영구 삭제되었습니다.`);
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(extractErrorMessage(error));
      },
    });
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
              onClick={() => { setFilter(f.id); setPage(1); }}
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

        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="이름, 회사명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
      </div>

      {employeesQuery.isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <Skeleton className="h-8 rounded" />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-4" />
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
          ))}
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
        <>
          <WorkerTable
            workers={employees}
            onViewDetail={handleViewDetail}
            onDelete={setDeleteTarget}
          />
          {pagination && (
            <PaginationBar
              currentPage={page}
              pagination={pagination}
              onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
              onNextPage={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            />
          )}
        </>
      )}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="근로자 영구 삭제"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              이 작업은 되돌릴 수 없습니다. 해당 근로자의 모든 데이터(출퇴근 기록, 첨부파일 등)가 영구적으로 삭제됩니다.
            </p>
          </div>
          <p className="text-gray-700">
            <span className="font-semibold">{deleteTarget?.name}</span> 근로자를 영구 삭제하시겠습니까?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              취소
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '삭제 중...' : '영구 삭제'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
