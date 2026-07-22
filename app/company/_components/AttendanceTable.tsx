'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText, RefreshCw } from 'lucide-react';
import type { DailyAttendanceRecord } from '@/types/attendance';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { DatePicker } from '@/components/ui/DatePicker';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { cn } from '@/lib/cn';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '@/lib/status';

const PAGE_SIZE = 20;

interface AttendanceTableProps {
  selectedDate: string;
  dailyAttendance: DailyAttendanceRecord[];
  onPrevDay: () => void;
  onNextDay: () => void;
  onDateChange: (date: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AttendanceTable({
  selectedDate,
  dailyAttendance,
  onPrevDay,
  onNextDay,
  onDateChange,
  onRefresh,
  isRefreshing,
}: AttendanceTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(dailyAttendance.length / PAGE_SIZE);
  const paginatedRecords = dailyAttendance.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-duru-orange-600" />
            출퇴근 기록
          </h2>
          {onRefresh && (
            <IconButton
              icon={<RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              variant="ghost"
              size="sm"
              label="새로고침"
              onClick={onRefresh}
            />
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onPrevDay}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="이전 날"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <DatePicker
            value={selectedDate}
            onChange={onDateChange}
            className="w-auto"
            inputClassName="border-0 bg-transparent text-gray-900 font-semibold hover:bg-gray-100 px-2 whitespace-nowrap"
          />
          <button
            onClick={onNextDay}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="다음 날"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">출근</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">퇴근</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">업무 내용</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  출퇴근 기록이 없습니다.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => (
                <tr key={record.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={record.profileImage ?? undefined} name={record.name} size="sm" className="text-xs font-bold" />
                      <Link
                        href={`/company/employees/${record.employeeId}`}
                        className="font-semibold text-gray-900 hover:text-duru-orange-600 hover:underline"
                      >
                        {record.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{record.phone}</td>
                  <td className="px-6 py-4 text-gray-900">{record.clockIn || '-'}</td>
                  <td className="px-6 py-4 text-gray-900">{record.clockOut || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', getEmployeeStatusStyle(record.status, true))}>
                      {getEmployeeStatusLabel(record.status, true)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                    {record.workContent || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <PaginationBar
          currentPage={page}
          pagination={{
            page,
            limit: PAGE_SIZE,
            total: dailyAttendance.length,
            totalPages,
          }}
          onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </div>
  );
}
