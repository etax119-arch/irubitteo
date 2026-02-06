'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateNavigatorProps {
  year: number;
  month: number;
  onYearChange: (direction: 'prev' | 'next') => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

export function DateNavigator({
  year,
  month,
  onYearChange,
  onMonthChange,
}: DateNavigatorProps) {
  return (
    <div className="mb-4 space-y-3">
      {/* 연도 선택 */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
        <button
          onClick={() => onYearChange('prev')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-base font-bold text-gray-900">{year}년</span>
        </div>
        <button
          onClick={() => onYearChange('next')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* 월 선택 */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
        <button
          onClick={() => onMonthChange('prev')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-base font-bold text-gray-900">{month}월</span>
        <button
          onClick={() => onMonthChange('next')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
