'use client';

import {
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { PaginationBar } from '@/components/ui/PaginationBar';
import type { AttendanceWithEmployee, DisplayPhoto } from '@/types/attendance';
import type { Pagination } from '@/types/api';
import { DateNavigator } from './DateNavigator';
import { WorkRecordCard } from './WorkRecordCard';

interface WorkRecordsSectionProps {
  workRecords: AttendanceWithEmployee[];
  isOpen: boolean;
  onToggle: () => void;
  year: number;
  month: number;
  onYearChange: (direction: 'prev' | 'next') => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onPhotoClick: (photo: DisplayPhoto) => void;
  onAddPhoto: (recordId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onSavePhoto: (url: string, fileName: string) => void;
  onDeletePhoto: (recordId: string, photoUrl: string) => void;
  isLoading?: boolean;
  currentPage?: number;
  pagination?: Pagination;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

export function WorkRecordsSection({
  workRecords,
  isOpen,
  onToggle,
  year,
  month,
  onYearChange,
  onMonthChange,
  onPhotoClick,
  onAddPhoto,
  onSavePhoto,
  onDeletePhoto,
  isLoading = false,
  currentPage,
  pagination,
  onPrevPage,
  onNextPage,
}: WorkRecordsSectionProps) {
  return (
    <div className="mt-6">
      {/* 트리거 카드 */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full bg-gradient-to-b from-[#F7F7F8] to-[#F1F1F3] rounded-2xl px-5 py-3.5 border border-[#E2E2E6] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between hover:from-[#F3F3F5] hover:to-[#EDEDEF] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-duru-orange-100 rounded-full flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-duru-orange-600" />
          </div>
          <span className="text-sm text-gray-500 font-normal">나의 활동 기록</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          {isOpen ? '접기' : '모두 보기'}
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </span>
      </button>

      {/* 펼쳐지는 활동 기록 리스트 */}
      {isOpen && (
        <div className="mt-2 bg-gradient-to-b from-gray-50 to-white rounded-2xl px-5 py-5 border border-gray-100">
          {/* 연도/월 선택 네비게이션 */}
          <DateNavigator
            year={year}
            month={month}
            onYearChange={onYearChange}
            onMonthChange={onMonthChange}
          />

          {/* 기록 카드들 */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                  <Skeleton className="h-12 rounded-lg" />
                </div>
              ))}
            </div>
          ) : workRecords.length > 0 ? (
            <div className="space-y-3">
              {workRecords.map((record) => (
                <WorkRecordCard
                  key={record.id}
                  record={record}
                  onPhotoClick={onPhotoClick}
                  onAddPhoto={onAddPhoto}
                  onSavePhoto={onSavePhoto}
                  onDeletePhoto={onDeletePhoto}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-400">
                {year}년 {month}월에
                <br />
                등록된 활동 기록이 없습니다.
              </p>
            </div>
          )}

          {/* 페이지네이션 */}
          {currentPage != null && pagination && onPrevPage && onNextPage && (
            <PaginationBar
              currentPage={currentPage}
              pagination={pagination}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
