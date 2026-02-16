import { Clock, Edit3 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getDisplayStatusColor as getStatusColor } from '@/lib/status';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import type { AttendanceRecord } from '../../_hooks/useAttendanceHistory';
import type { Pagination } from '@/types/api';

interface AttendanceHistoryTableProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
  error?: string | null;
  onEditWorkTime: (record: AttendanceRecord) => void;
  onOpenWorkDone: (date: string, workDone: string, photoUrls: string[]) => void;
  currentPage: number;
  pagination?: Pagination;
  onNextPage: () => void;
  onPrevPage: () => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearDates: () => void;
}

export function AttendanceHistoryTable({ records, isLoading, error, onEditWorkTime, onOpenWorkDone, currentPage, pagination, onNextPage, onPrevPage, startDate, endDate, onStartDateChange, onEndDateChange, onClearDates }: AttendanceHistoryTableProps) {
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
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-8">출퇴근 기록을 불러오는 중...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-400 py-8">출퇴근 기록이 없습니다.</p>
      ) : (
      <>
      <div className="overflow-x-auto">
        <table className="w-full">
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
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{record.date}</td>
                <td className="px-4 py-3 text-gray-900">
                  {record.checkin}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {record.checkout}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      getStatusColor(record.status)
                    )}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {record.workDone !== '-' ? (
                    <button
                      onClick={() => onOpenWorkDone(record.date, record.workDone, record.photoUrls)}
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
                    aria-label="수정"
                  >
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
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
      </>
      )}
    </div>
  );
}
