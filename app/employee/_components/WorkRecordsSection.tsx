'use client';

import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
} from 'lucide-react';
import type { AttendanceWithEmployee, DisplayPhoto } from '@/types/attendance';
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
}: WorkRecordsSectionProps) {
  // 퇴근 기록만 필터링 (clockOut이 있는 기록)
  // 날짜 필터링은 API 호출 시 이미 적용됨
  const filteredRecords = workRecords.filter((record) => record.clockOut !== null);

  return (
    <div className="mt-6">
      {/* 트리거 카드 */}
      <button
        onClick={onToggle}
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
            <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
              <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-base font-medium text-gray-400">
                활동 기록을 불러오는 중...
              </p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
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
        </div>
      )}
    </div>
  );
}
