'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Search, RefreshCw, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { MonthPicker } from '../_components/MonthPicker';
import { WorkStatsTable } from '../_components/WorkStatsTable';
import { PrintPreviewModal } from '../_components/PrintPreviewModal';
import {
  useAdminMonthlyStats,
  useCalculateMonthlyStats,
  useUpdateMonthlyStats,
} from '../_hooks/useAdminWorkstats';
import { useToast } from '@/components/ui/Toast';
import { formatDateAsKST } from '@/lib/kst';
import type { MonthlyWorkStatsCompany } from '@/types/adminDashboard';

function getCurrentMonth(): string {
  return formatDateAsKST(new Date()).substring(0, 7);
}

function offsetMonthString(monthStr: string, offset: number): string {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + offset);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${nextYear}-${nextMonth}`;
}

export default function AdminWorkstatsPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [printPreview, setPrintPreview] = useState<MonthlyWorkStatsCompany | null>(null);
  const toast = useToast();

  // 검색 디바운스 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const year = Number(selectedMonth.split('-')[0]);
  const month = Number(selectedMonth.split('-')[1]);

  const statsQuery = useAdminMonthlyStats(year, month, page, 10, debouncedSearch || undefined);
  const calculateMutation = useCalculateMonthlyStats();
  const updateMutation = useUpdateMonthlyStats(year, month, page, debouncedSearch || undefined);

  const companies = statsQuery.data?.data ?? [];
  const pagination = statsQuery.data?.pagination ?? null;

  const handleCalculate = () => {
    calculateMutation.mutate(
      { year, month },
      {
        onSuccess: (result) => {
          toast.success(`${result.updatedCount}명의 통계가 재계산되었습니다.`);
        },
        onError: () => {
          toast.error('통계 재계산에 실패했습니다.');
        },
      }
    );
  };

  const handlePrintPreview = (company: MonthlyWorkStatsCompany) => {
    setPrintPreview(company);
  };

  const handleWorkStatsUpdate = (
    _companyId: string,
    employeeId: string,
    field: 'workDays' | 'totalHours',
    value: number
  ) => {
    updateMutation.mutate(
      {
        employeeId,
        year,
        month,
        ...(field === 'workDays' ? { workDays: value } : { totalWorkHours: value }),
      },
      {
        onSuccess: () => {
          toast.success('통계가 수정되었습니다.');
        },
        onError: () => {
          toast.error('통계 수정에 실패했습니다.');
        },
      }
    );
  };

  const changeMonth = (offset: number) => {
    setSelectedMonth((prev) => offsetMonthString(prev, offset));
    setPage(1);
  };

  const handleMonthChange = (monthValue: string) => {
    setSelectedMonth(monthValue);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-duru-orange-600" />
          근무 통계
        </h2>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="회사명 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="sm"
            leftIcon={<Search className="w-5 h-5" />}
            className="w-64"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="이전 월"
              aria-label="이전 월"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <MonthPicker
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-[150px]"
              inputClassName="border-2 border-duru-orange-500 bg-duru-orange-50 text-duru-orange-600 font-bold hover:border-duru-orange-500"
            />
            <button
              onClick={() => changeMonth(1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="다음 월"
              aria-label="다음 월"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
          <button
            onClick={handleCalculate}
            disabled={calculateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-duru-orange-500 text-white rounded-lg hover:bg-duru-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${calculateMutation.isPending ? 'animate-spin' : ''}`} />
            {calculateMutation.isPending ? '계산 중...' : '재계산'}
          </button>
        </div>
      </div>

      {statsQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-20 h-8 rounded-lg" />
              </div>
              <div className="px-6 py-3 border-b border-gray-100">
                <Skeleton className="h-6 rounded" />
              </div>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="px-6 py-3 border-b border-gray-100 flex items-center gap-4">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="flex-1 h-4" />
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <WorkStatsTable
            companies={companies}
            selectedMonth={selectedMonth}
            onPrintPreview={handlePrintPreview}
            onWorkStatsUpdate={handleWorkStatsUpdate}
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

      <PrintPreviewModal
        isOpen={!!printPreview}
        onClose={() => setPrintPreview(null)}
        companyName={printPreview?.companyName || ''}
        workers={printPreview?.employees || []}
        pmContactName={printPreview?.pmContactName || null}
        pmContactPhone={printPreview?.pmContactPhone || null}
        pmContactEmail={printPreview?.pmContactEmail || null}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
