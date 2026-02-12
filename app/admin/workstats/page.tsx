'use client';

import { useState } from 'react';
import { BarChart3, Calendar, Search, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
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

export default function AdminWorkstatsPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [searchQuery, setSearchQuery] = useState('');
  const [printPreview, setPrintPreview] = useState<MonthlyWorkStatsCompany | null>(null);
  const toast = useToast();

  const year = Number(selectedMonth.split('-')[0]);
  const month = Number(selectedMonth.split('-')[1]);

  const statsQuery = useAdminMonthlyStats(year, month);
  const calculateMutation = useCalculateMonthlyStats();
  const updateMutation = useUpdateMonthlyStats(year, month);

  const companies = statsQuery.data ?? [];

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
        onError: () => {
          toast.error('통계 수정에 실패했습니다.');
        },
      }
    );
  };

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-duru-orange-600" />
          근무 통계
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="회사명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-duru-orange-600" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border-2 border-duru-orange-500 rounded-lg bg-duru-orange-50 text-duru-orange-600 font-bold focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            disabled={calculateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-duru-orange-500 text-white rounded-lg hover:bg-duru-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
        <WorkStatsTable
          companies={filteredCompanies}
          selectedMonth={selectedMonth}
          onPrintPreview={handlePrintPreview}
          onWorkStatsUpdate={handleWorkStatsUpdate}
        />
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
