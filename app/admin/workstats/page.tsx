'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Calendar, Search, Loader2, RefreshCw } from 'lucide-react';
import { WorkStatsTable } from '../_components/WorkStatsTable';
import { PrintPreviewModal } from '../_components/PrintPreviewModal';
import {
  getAdminMonthlyStats,
  calculateAdminMonthlyStats,
  updateAdminMonthlyStats,
} from '@/lib/api/admin';
import { useToast } from '@/components/ui/Toast';
import type { MonthlyWorkStatsCompany } from '@/types/adminDashboard';

function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default function AdminWorkstatsPage() {
  const [companies, setCompanies] = useState<MonthlyWorkStatsCompany[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [printPreview, setPrintPreview] = useState<MonthlyWorkStatsCompany | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [year, monthStr] = selectedMonth.split('-');
      const data = await getAdminMonthlyStats(Number(year), Number(monthStr));
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch monthly stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const [year, monthStr] = selectedMonth.split('-');
      const result = await calculateAdminMonthlyStats(Number(year), Number(monthStr));
      toast.success(`${result.updatedCount}명의 통계가 재계산되었습니다.`);
      await fetchData();
    } catch (error) {
      console.error('Failed to calculate monthly stats:', error);
      toast.error('통계 재계산에 실패했습니다.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePrintPreview = (company: MonthlyWorkStatsCompany) => {
    setPrintPreview(company);
  };

  const handleWorkStatsUpdate = async (
    companyId: string,
    employeeId: string,
    field: 'workDays' | 'totalHours',
    value: number
  ) => {
    // Save previous state for rollback
    const prevCompanies = companies;

    // Optimistic update
    setCompanies((prev) =>
      prev.map((company) =>
        company.companyId === companyId
          ? {
              ...company,
              employees: company.employees.map((employee) =>
                employee.id === employeeId ? { ...employee, [field]: value } : employee
              ),
            }
          : company
      )
    );

    try {
      const [year, monthStr] = selectedMonth.split('-');
      await updateAdminMonthlyStats({
        employeeId,
        year: Number(year),
        month: Number(monthStr),
        ...(field === 'workDays' ? { workDays: value } : { totalWorkHours: value }),
      });
    } catch (error) {
      console.error('Failed to update monthly stats:', error);
      toast.error('통계 수정에 실패했습니다.');
      // Rollback
      setCompanies(prevCompanies);
    }
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
            disabled={isCalculating}
            className="flex items-center gap-2 px-4 py-2 bg-duru-orange-500 text-white rounded-lg hover:bg-duru-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? '계산 중...' : '재계산'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-duru-orange-500" />
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
