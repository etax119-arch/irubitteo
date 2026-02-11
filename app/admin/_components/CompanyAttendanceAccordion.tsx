'use client';

import { useState } from 'react';
import { Building2, ChevronDown, ChevronRight, AlertCircle, Calendar, Search, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '@/lib/status';
import { offsetDateString } from '@/lib/kst';
import type { AdminDailyCompany } from '@/types/adminDashboard';

interface CompanyAttendanceAccordionProps {
  dailyAttendance: AdminDailyCompany[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  isFetching?: boolean;
}

export function CompanyAttendanceAccordion({
  dailyAttendance,
  selectedDate,
  onDateChange,
  isFetching,
}: CompanyAttendanceAccordionProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCompanies = dailyAttendance.filter((company) =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* 날짜 네비게이션 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-duru-orange-600" />
            출퇴근 현황 (회사별)
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="이전 날짜"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-duru-orange-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 border-2 border-duru-orange-500 rounded-lg bg-duru-orange-50 text-duru-orange-600 font-bold focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
              />
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="다음 날짜"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>

        {/* 회사 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="회사명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
          />
        </div>
      </div>

      {/* 회사별 아코디언 */}
      {isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-duru-orange-500 animate-spin" />
        </div>
      )}
      {filteredCompanies.map((company) => {
        const employees = company.employees;

        const statusCounts = employees.reduce(
          (acc, emp) => {
            const label = getEmployeeStatusLabel(emp.status, true);
            acc[label] = (acc[label] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1 hover:bg-gray-200 rounded transition-colors">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-duru-orange-600" />
                    {company.companyName}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({checkedInCount}/{totalEmployees}명 출근)
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {Object.entries(statusCounts).map(([label, count]) => {
                    const statusKey = label === '퇴근' ? 'checkout'
                      : label === '근무중' ? 'checkin'
                      : label === '결근' ? 'absent'
                      : label === '휴가' ? 'leave'
                      : label === '휴무' ? 'dayoff'
                      : 'pending';
                    return (
                      <span
                        key={label}
                        className={cn('px-3 py-1 rounded-full text-xs font-semibold', getEmployeeStatusStyle(statusKey as 'checkin' | 'checkout' | 'absent' | 'leave' | 'pending' | 'dayoff', true))}
                      >
                        {label}: {count}명
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">출근 시간</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">퇴근 시간</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">업무 내용</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.map((employee) => {
                      const needsAttention = employee.status === 'absent' || employee.isLate;
                      return (
                        <tr
                          key={employee.employeeId}
                          className={cn('hover:bg-gray-50', needsAttention && 'bg-yellow-50')}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{employee.name}</span>
                              {needsAttention && (
                                <span title={employee.isLate ? '지각' : '결근'}>
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{employee.phone || '-'}</td>
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
                          <td className="px-6 py-4">
                            <span
                              className={
                                !employee.clockIn ? 'text-red-600 font-semibold' : 'text-gray-900'
                              }
                            >
                              {employee.clockIn ?? '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900">
                              {employee.clockOut ?? '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn('text-gray-600', !employee.workContent && 'italic')}>
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
    </div>
  );
}
