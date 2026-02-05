import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { ScheduleEntry } from '@/types/companyDashboard';

interface CalendarGridProps {
  currentMonth: Date;
  schedules: Record<string, ScheduleEntry>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date) => void;
  getActiveWorkersCount: (year: number, month: number, day: number) => number;
}

export function CalendarGrid({
  currentMonth,
  schedules,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  getActiveWorkersCount,
}: CalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const renderCells = () => {
    const cells = [];

    // 이전 달 빈 셀
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[120px]"></div>);
    }

    // 현재 달 날짜
    for (let date = 1; date <= lastDate; date++) {
      const dayOfWeek = new Date(year, month, date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = date === 28 && month === 0 && year === 2026;
      const schedule = schedules[date.toString()];

      cells.push(
        <div
          key={date}
          onClick={() => onDateClick(new Date(year, month, date))}
          className={`min-h-[120px] border-2 rounded-lg p-3 transition-all hover:shadow-lg cursor-pointer ${
            isToday ? 'ring-2 ring-duru-orange-500' : ''
          } ${
            isWeekend
              ? 'bg-gray-50 border-gray-200'
              : schedule
              ? schedule.color
              : 'bg-white border-gray-200 hover:border-duru-orange-300'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-lg font-bold ${
                  dayOfWeek === 0
                    ? 'text-red-600'
                    : dayOfWeek === 6
                    ? 'text-blue-600'
                    : 'text-gray-900'
                }`}
              >
                {date}
              </span>
              {!isWeekend && (
                <span className="text-xs bg-white px-2 py-0.5 rounded-full font-semibold text-gray-700 border">
                  {getActiveWorkersCount(year, month, date)}명
                </span>
              )}
            </div>

            {schedule && (
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-900 line-clamp-2">
                  {schedule.workType}
                </p>
              </div>
            )}

            {!schedule && !isWeekend && (
              <div className="flex-1 flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">근무 일정 관리</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
            {year}년 {month + 1}월
          </span>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-3">
        {/* 요일 헤더 */}
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <div
            key={day}
            className={`text-center font-bold py-3 text-base ${
              idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-900'
            }`}
          >
            {day}
          </div>
        ))}

        {/* 날짜 셀 */}
        {renderCells()}
      </div>
    </div>
  );
}
