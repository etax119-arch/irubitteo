'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, Search, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '@/lib/status';
import { offsetDateString } from '@/lib/kst';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/Input';
import { PaginationBar } from '@/components/ui/PaginationBar';
import type { AdminDailyCompany } from '@/types/adminDashboard';
import type { EmployeeDailyStatus } from '@/types/attendance';
import type { Pagination } from '@/types/api';

interface CompanyAttendanceAccordionProps {
  dailyAttendance: AdminDailyCompany[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  isFetching?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pagination: Pagination | null;
  currentPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function CompanyAttendanceAccordion({
  dailyAttendance,
  selectedDate,
  onDateChange,
  isFetching,
  searchQuery,
  onSearchChange,
  pagination,
  currentPage,
  onPrevPage,
  onNextPage,
}: CompanyAttendanceAccordionProps) {
  const router = useRouter();
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const changeDate = (offset: number) => {
    onDateChange(offsetDateString(selectedDate, offset));
  };

  const handleDateChange = (dateStr: string) => {
    onDateChange(dateStr);
  };

  return (
    <div className="space-y-4">
      {/* 날짜 네비게이션 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
            <Clock className="w-6 h-6 text-duru-orange-600 shrink-0" />
            출퇴근 현황 (회사별)
          </h2>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
              title="이전 날짜"
              aria-label="이전 날짜"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              className="w-auto"
              inputClassName="border-0 bg-transparent text-gray-900 font-semibold hover:bg-gray-100 px-2 whitespace-nowrap"
            />
            <button
              onClick={() => changeDate(1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
              title="다음 날짜"
              aria-label="다음 날짜"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 회사 검색 */}
        <Input
          type="text"
          placeholder="회사명 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="sm"
          leftIcon={<Search className="w-5 h-5" />}
        />
      </div>

      {/* 회사별 아코디언 */}
      {isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-duru-orange-500 animate-spin" />
        </div>
      )}
      {dailyAttendance.map((company) => {
        const employees = company.employees;

        // 라벨로 묶어 개수를 센다 (leave/dayoff처럼 라벨이 같은 상태는 한 칩으로 합쳐진다).
        // 색상용 상태값을 함께 들고 있어야 라벨→상태 역매핑이 필요 없다 —
        // 역매핑은 새 상태를 추가할 때 조용히 엉뚱한 색으로 새기 쉽다.
        const statusCounts = employees.reduce(
          (acc, emp) => {
            const label = getEmployeeStatusLabel(emp.status, true);
            const prev = acc[label];
            acc[label] = {
              count: (prev?.count ?? 0) + 1,
              status: prev?.status ?? emp.status,
            };
            return acc;
          },
          {} as Record<string, { count: number; status: EmployeeDailyStatus }>
        );

        const isExpanded = expandedCompanies[company.companyId];
        const totalEmployees = employees.length;
        const checkedInCount = employees.filter(
          (emp) => emp.status === 'checkin' || emp.status === 'checkout'
        ).length;

        return (
          <div key={company.companyId} className="bg-white rounded-xl border border-gray-200">
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleCompany(company.companyId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCompany(company.companyId);
                }
              }}
              className="w-full bg-gray-50 px-6 py-4 border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1 hover:bg-gray-200 rounded transition-colors shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 min-w-0">
                    <Building2 className="w-5 h-5 text-duru-orange-600 shrink-0" />
                    <span className="truncate">{company.companyName}</span>
                    <span className="text-sm font-normal text-gray-600 shrink-0 whitespace-nowrap">
                      ({checkedInCount}/{totalEmployees}명 출근)
                    </span>
                  </h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                  {Object.entries(statusCounts).map(([label, { count, status }]) => (
                    <span
                      key={label}
                      className={cn('px-3 py-1 rounded-full text-xs font-semibold', getEmployeeStatusStyle(status, true))}
                    >
                      {label}: {count}명
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full sm:min-w-[720px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">출근 시간</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">퇴근 시간</th>
                      <th className="hidden sm:table-cell w-[280px] px-6 py-3 text-left text-sm font-semibold text-gray-900">업무 내용</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.map((employee) => {
                      const needsAttention = employee.status === 'absent' || employee.isLate;
                      return (
                        <tr
                          key={employee.employeeId}
                          role="button"
                          tabIndex={0}
                          onClick={() => router.push(`/admin/employees/${employee.employeeId}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              router.push(`/admin/employees/${employee.employeeId}`);
                            }
                          }}
                          className={cn('hover:bg-gray-50 cursor-pointer', needsAttention && 'bg-yellow-50')}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {employee.name}
                              </span>
                              {needsAttention && (
                                <span title={employee.isLate ? '지각' : '결근'}>
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 text-gray-700">{employee.phone || '-'}</td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                'px-3 py-1 rounded-full text-xs font-semibold',
                                getEmployeeStatusStyle(employee.status, true)
                              )}
                            >
                              {getEmployeeStatusLabel(employee.status, true)}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4">
                            <span
                              className={
                                !employee.clockIn ? 'text-red-600 font-semibold' : 'text-gray-900'
                              }
                            >
                              {employee.clockIn ?? '-'}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4">
                            <span className="text-gray-900">
                              {employee.clockOut ?? '-'}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 max-w-[280px]">
                            <span
                              className={cn('block truncate text-gray-600', !employee.workContent && 'italic')}
                              title={employee.workContent || undefined}
                            >
                              {employee.workContent || '업무 내용 없음'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* 페이지네이션 */}
      {pagination && (
        <PaginationBar
          currentPage={currentPage}
          pagination={pagination}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
        />
      )}
    </div>
  );
}
