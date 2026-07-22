'use client';

import { Clock, Edit3, FileSpreadsheet, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatUtcTimestampAsKST, formatDateAsKST } from '@/lib/kst';
import {
  getAttendanceRecordStatusColor,
  getAttendanceRecordStatusLabel,
} from '@/lib/status';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import type { AttendanceWithEmployee } from '@/types/attendance';
import type { Pagination } from '@/types/api';

type AttendanceHistoryTableProps = {
  records: AttendanceWithEmployee[];
  onEditWorkTime: (record: AttendanceWithEmployee) => void;
  onOpenWorkDone: (date: string, workDone: string, photoUrls: string[]) => void;
  onStatusClick: (record: AttendanceWithEmployee) => void;
  currentPage: number;
  pagination?: Pagination;
  onNextPage: () => void;
  onPrevPage: () => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearDates: () => void;
  onExportExcel: () => void;
  isExporting?: boolean;
};

export function AttendanceHistoryTable({
  records,
  onEditWorkTime,
  onOpenWorkDone,
  onStatusClick,
  currentPage,
  pagination,
  onNextPage,
  onPrevPage,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates,
  onExportExcel,
  isExporting,
}: AttendanceHistoryTableProps) {
  const renderStatusButton = (record: AttendanceWithEmployee) => (
    <button
      type="button"
      onClick={() => onStatusClick(record)}
      title="연차 처리"
      className={cn(
        'px-2 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 cursor-pointer',
        getAttendanceRecordStatusColor(record.status)
      )}
    >
      {getAttendanceRecordStatusLabel(record.status)}
    </button>
  );

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-duru-orange-600" />
        최근 출퇴근 기록
      </h3>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onClear={onClearDates}
        />
        <button
          type="button"
          onClick={onExportExcel}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-4 h-4" />
          )}
          엑셀
        </button>
      </div>

      {/* 모바일: 카드 리스트 */}
      <div className="sm:hidden space-y-3">
        {records.length > 0 ? (
          records.map((record) => {
            const isAbsentOrLeave = record.status === 'absent' || record.status === 'leave';
            const checkinDisplay = isAbsentOrLeave ? '-' : (record.clockIn ? formatUtcTimestampAsKST(record.clockIn) : '-');
            const checkoutDisplay = isAbsentOrLeave ? '-' : (record.clockOut ? formatUtcTimestampAsKST(record.clockOut) : '-');
            const dateDisplay = formatDateAsKST(new Date(record.date));

            return (
              <div key={record.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{dateDisplay}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {renderStatusButton(record)}
                    <button
                      onClick={() => onEditWorkTime(record)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="수정"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">출근</span>
                    <span className="text-gray-900">{checkinDisplay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">퇴근</span>
                    <span className="text-gray-900">{checkoutDisplay}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">업무 내용</span>
                  {record.workContent ? (
                    <button
                      onClick={() => onOpenWorkDone(dateDisplay, record.workContent!, record.photoUrls)}
                      className="text-duru-orange-600 underline hover:text-duru-orange-700"
                    >
                      확인하기
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 py-8">출퇴근 기록이 없습니다.</p>
        )}
      </div>

      {/* 데스크톱: 테이블 */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">날짜</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">출근</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">퇴근</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">업무 내용</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">수정</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.length > 0 ? (
              records.map((record) => {
                const isAbsentOrLeave = record.status === 'absent' || record.status === 'leave';
                const checkinDisplay = isAbsentOrLeave ? '-' : (record.clockIn ? formatUtcTimestampAsKST(record.clockIn) : '-');
                const checkoutDisplay = isAbsentOrLeave ? '-' : (record.clockOut ? formatUtcTimestampAsKST(record.clockOut) : '-');
                const dateDisplay = formatDateAsKST(new Date(record.date));

                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{dateDisplay}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {checkinDisplay}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{checkoutDisplay}</td>
                    <td className="px-4 py-3">
                      {renderStatusButton(record)}
                    </td>
                    <td className="px-4 py-3">
                      {record.workContent ? (
                        <button
                          onClick={() => onOpenWorkDone(dateDisplay, record.workContent!, record.photoUrls)}
                          className="text-sm text-duru-orange-600 underline hover:text-duru-orange-700"
                        >
                          확인하기
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEditWorkTime(record)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  출퇴근 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <span className="text-sm text-gray-600">{currentPage} / {pagination.totalPages}</span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
