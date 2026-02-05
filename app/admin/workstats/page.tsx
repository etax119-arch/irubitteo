'use client';

import { useState } from 'react';
import { BarChart3, Calendar, Search } from 'lucide-react';
import { WorkStatsTable } from '../_components/WorkStatsTable';
import { PrintPreviewModal } from '../_components/PrintPreviewModal';
import { monthlyWorkStats as initialWorkStats, companiesData } from '../_data/dummyData';
import type { MonthlyWorkStats, WorkStatWorker, PMInfo } from '@/types/adminDashboard';

export default function AdminWorkstatsPage() {
  const [monthlyWorkStats, setMonthlyWorkStats] = useState<MonthlyWorkStats>(initialWorkStats);
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [printPreview, setPrintPreview] = useState<{
    companyName: string;
    workers: WorkStatWorker[];
    pm: PMInfo | null;
  } | null>(null);

  const handlePrintPreview = (companyName: string, workers: WorkStatWorker[], pm: PMInfo | null) => {
    setPrintPreview({ companyName, workers, pm });
  };

  const handleWorkStatsUpdate = (
    companyName: string,
    workerId: number,
    field: 'workDays' | 'totalHours',
    value: number
  ) => {
    setMonthlyWorkStats((prev) => ({
      ...prev,
      [companyName]: prev[companyName].map((worker) =>
        worker.id === workerId ? { ...worker, [field]: value } : worker
      ),
    }));
  };

  const filteredWorkStats = Object.entries(monthlyWorkStats)
    .filter(([companyName]) => companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as MonthlyWorkStats);

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
        </div>
      </div>

      <WorkStatsTable
        monthlyWorkStats={filteredWorkStats}
        companies={companiesData}
        selectedMonth={selectedMonth}
        onPrintPreview={handlePrintPreview}
        onWorkStatsUpdate={handleWorkStatsUpdate}
      />

      <PrintPreviewModal
        isOpen={!!printPreview}
        onClose={() => setPrintPreview(null)}
        companyName={printPreview?.companyName || ''}
        workers={printPreview?.workers || []}
        pm={printPreview?.pm || null}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
