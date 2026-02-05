'use client';

import { useState } from 'react';
import { Building2, ChevronDown, ChevronRight, AlertCircle, Edit, Check, X, Calendar, Search, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DailyAttendanceData, DailyAttendanceWorker } from '@/types/adminDashboard';

interface CompanyAttendanceAccordionProps {
  dailyAttendance: DailyAttendanceData;
  onAttendanceUpdate?: (
    companyName: string,
    workerId: number,
    field: keyof DailyAttendanceWorker,
    value: string,
    timeSlot: 'morning' | 'afternoon'
  ) => void;
}

function getAttendanceStatus(worker: DailyAttendanceWorker) {
  if (worker.checkin === '-') return '출근 전';
  if (worker.checkout === '-') return '출근 중';
  if (worker.checkin > '09:00') return '지각';
  return '출근 완료';
}

function getStatusColor(status: string) {
  switch (status) {
    case '출근 완료':
      return 'bg-green-100 text-green-700';
    case '출근 중':
      return 'bg-blue-100 text-blue-700';
    case '지각':
      return 'bg-yellow-100 text-yellow-700';
    case '출근 전':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function CompanyAttendanceAccordion({
  dailyAttendance,
  onAttendanceUpdate,
}: CompanyAttendanceAccordionProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Record<string, 'morning' | 'afternoon'>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 28));
  const [editingCell, setEditingCell] = useState<{
    companyName: string;
    workerId: number;
    field: keyof DailyAttendanceWorker;
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggleCompany = (companyName: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyName]: !prev[companyName],
    }));
  };

  const changeDate = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  const startEdit = (
    companyName: string,
    workerId: number,
    field: keyof DailyAttendanceWorker,
    currentValue: string
  ) => {
    setEditingCell({ companyName, workerId, field });
    setEditValue(currentValue);
  };

  const saveEdit = (companyName: string, workerId: number, field: keyof DailyAttendanceWorker) => {
    const timeSlot = selectedTimeSlot[companyName] || 'morning';
    onAttendanceUpdate?.(companyName, workerId, field, editValue, timeSlot);
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const filteredCompanies = Object.entries(dailyAttendance).filter(([companyName]) =>
    companyName.toLowerCase().includes(searchQuery.toLowerCase())
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
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
      {filteredCompanies.map(([companyName, companyData]) => {
        const currentTimeSlot = selectedTimeSlot[companyName] || 'morning';
        const companyWorkers = companyData[currentTimeSlot];

        const statusCounts = companyWorkers.reduce(
          (acc, w) => {
            const status = getAttendanceStatus(w);
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const isExpanded = expandedCompanies[companyName];
        const totalWorkers = companyData.morning.length + companyData.afternoon.length;
        const totalCheckedIn = [...companyData.morning, ...companyData.afternoon].filter(
          (w) => w.checkin !== '-'
        ).length;

        return (
          <div key={companyName} className="bg-white rounded-xl border border-gray-200">
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleCompany(companyName)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCompany(companyName);
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
                    {companyName}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({totalCheckedIn}/{totalWorkers}명 출근)
                    </span>
                  </h3>
                  {/* 오전/오후 토글 버튼 */}
                  <div
                    className="flex items-center bg-white border-2 border-duru-orange-200 rounded-lg overflow-hidden ml-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setSelectedTimeSlot((prev) => ({ ...prev, [companyName]: 'morning' }))
                      }
                      className={cn(
                        'px-4 py-1.5 text-sm font-semibold transition-all',
                        currentTimeSlot === 'morning'
                          ? 'bg-duru-orange-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-duru-orange-50'
                      )}
                    >
                      오전 ({companyData.morning.length}명)
                    </button>
                    <button
                      onClick={() =>
                        setSelectedTimeSlot((prev) => ({ ...prev, [companyName]: 'afternoon' }))
                      }
                      className={cn(
                        'px-4 py-1.5 text-sm font-semibold transition-all',
                        currentTimeSlot === 'afternoon'
                          ? 'bg-duru-orange-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-duru-orange-50'
                      )}
                    >
                      오후 ({companyData.afternoon.length}명)
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <span
                      key={status}
                      className={cn('px-3 py-1 rounded-full text-xs font-semibold', getStatusColor(status))}
                    >
                      {status}: {count}명
                    </span>
                  ))}
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
                    {companyWorkers.map((worker) => {
                      const status = getAttendanceStatus(worker);
                      return (
                        <tr
                          key={worker.id}
                          className={cn('hover:bg-gray-50', worker.needsAttention && 'bg-yellow-50')}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{worker.name}</span>
                              {worker.needsAttention && (
                                <span title="관리자 확인 필요">
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{worker.phone || '-'}</td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                'px-3 py-1 rounded-full text-xs font-semibold',
                                getStatusColor(status)
                              )}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {editingCell?.companyName === companyName &&
                            editingCell?.workerId === worker.id &&
                            editingCell?.field === 'checkin' ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="px-2 py-1 border border-duru-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveEdit(companyName, worker.id, 'checkin')}
                                  className="p-1 hover:bg-green-100 rounded"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                                <button onClick={cancelEdit} className="p-1 hover:bg-red-100 rounded">
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => startEdit(companyName, worker.id, 'checkin', worker.checkin)}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-flex items-center gap-1"
                              >
                                <span
                                  className={
                                    worker.checkin === '-' ? 'text-red-600 font-semibold' : 'text-gray-900'
                                  }
                                >
                                  {worker.checkin}
                                </span>
                                <Edit className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingCell?.companyName === companyName &&
                            editingCell?.workerId === worker.id &&
                            editingCell?.field === 'checkout' ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="px-2 py-1 border border-duru-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveEdit(companyName, worker.id, 'checkout')}
                                  className="p-1 hover:bg-green-100 rounded"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                                <button onClick={cancelEdit} className="p-1 hover:bg-red-100 rounded">
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => startEdit(companyName, worker.id, 'checkout', worker.checkout)}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-flex items-center gap-1"
                              >
                                <span className="text-gray-900">{worker.checkout}</span>
                                <Edit className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingCell?.companyName === companyName &&
                            editingCell?.workerId === worker.id &&
                            editingCell?.field === 'workContent' ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  placeholder="업무 내용 입력..."
                                  className="px-2 py-1 border border-duru-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-duru-orange-500 w-full"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveEdit(companyName, worker.id, 'workContent')}
                                  className="p-1 hover:bg-green-100 rounded flex-shrink-0"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 hover:bg-red-100 rounded flex-shrink-0"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  startEdit(companyName, worker.id, 'workContent', worker.workContent)
                                }
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-flex items-center gap-1 min-w-[200px]"
                              >
                                <span className={cn('text-gray-600', !worker.workContent && 'italic')}>
                                  {worker.workContent || '업무 내용 없음'}
                                </span>
                                <Edit className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
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
