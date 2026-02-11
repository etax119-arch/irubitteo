'use client';

import { Clock, Edit3 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatUtcTimestampAsKST, formatDateAsKST } from '@/lib/kst';
import { getAttendanceDisplayStatus, getDisplayStatusColor } from '@/lib/status';
import type { AttendanceWithEmployee } from '@/types/attendance';

type AttendanceHistoryTableProps = {
  records: AttendanceWithEmployee[];
  onEditWorkTime: (record: AttendanceWithEmployee) => void;
  onOpenWorkDone: (date: string, workDone: string) => void;
};

export function AttendanceHistoryTable({
  records,
  onEditWorkTime,
  onOpenWorkDone,
}: AttendanceHistoryTableProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-duru-orange-600" />
        최근 출퇴근 기록
      </h3>

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
            {records.length > 0 ? (
              records.slice(0, 7).map((record) => {
                const displayStatus = getAttendanceDisplayStatus(record);
                const checkinDisplay = record.clockIn
                  ? formatUtcTimestampAsKST(record.clockIn)
                  : displayStatus === '결근'
                  ? '결근'
                  : '-';
                const checkoutDisplay = record.clockOut
                  ? formatUtcTimestampAsKST(record.clockOut)
                  : '-';
                const dateDisplay = formatDateAsKST(new Date(record.date));

                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{dateDisplay}</td>
                    <td
                      className={cn(
                        'px-4 py-3',
                        checkinDisplay === '결근' ? 'text-red-600 font-semibold' : 'text-gray-900'
                      )}
                    >
                      {checkinDisplay}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{checkoutDisplay}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          getDisplayStatusColor(displayStatus)
                        )}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.workContent ? (
                        <button
                          onClick={() => onOpenWorkDone(dateDisplay, record.workContent!)}
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
    </div>
  );
}
