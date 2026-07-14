'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Popover } from '@/components/ui/Popover';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear?: () => void;
}

// DayPicker를 완전히 제어형으로 쓰기 위한 no-op (선택 로직은 onDayClick에서 처리)
const noop = () => {};

function toDate(value: string): Date | undefined {
  if (!value) return undefined;
  const d = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(d) ? d : undefined;
}

function formatDisplay(value: string): string {
  if (!value) return '';
  const d = parse(value, 'yyyy-MM-dd', new Date());
  if (!isValid(d)) return value;
  return format(d, 'yyyy.MM.dd');
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 진행 중인 선택의 시작일(1차 클릭). null이면 다음 클릭이 새 시작일이 된다.
  const [pendingStart, setPendingStart] = useState<Date | undefined>(undefined);

  const from = toDate(startDate);
  const to = toDate(endDate);

  // 팝오버를 열거나 닫을 때 진행 중 선택을 초기화해, 다시 열 때 새 범위를 처음부터 고를 수 있게 한다.
  const closePopover = () => {
    setIsOpen(false);
    setPendingStart(undefined);
  };
  const togglePopover = () => {
    setPendingStart(undefined);
    setIsOpen((prev) => !prev);
  };

  const selected = pendingStart
    ? { from: pendingStart, to: undefined }
    : from
    ? { from, to }
    : undefined;

  // 호텔 예약식 2단계 선택: 1차 클릭=시작일(팝오버 유지), 2차 클릭=종료일(팝오버 닫힘).
  const handleDayClick = (day: Date) => {
    if (!pendingStart) {
      setPendingStart(day);
      onStartDateChange(format(day, 'yyyy-MM-dd'));
      onEndDateChange('');
      return;
    }
    let rangeStart = pendingStart;
    let rangeEnd = day;
    if (day.getTime() < pendingStart.getTime()) {
      rangeStart = day;
      rangeEnd = pendingStart;
    }
    onStartDateChange(format(rangeStart, 'yyyy-MM-dd'));
    onEndDateChange(format(rangeEnd, 'yyyy-MM-dd'));
    setPendingStart(undefined);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover
        isOpen={isOpen}
        onClose={closePopover}
        className="min-w-[340px]"
        trigger={
          <button
            type="button"
            onClick={togglePopover}
            className="flex items-center gap-3 px-4 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-transparent"
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className={cn(!startDate && 'text-gray-400')}>
              {startDate ? formatDisplay(startDate) : '시작일'}
            </span>
            <span className="text-gray-400">~</span>
            <span className={cn(!endDate && 'text-gray-400')}>
              {endDate ? formatDisplay(endDate) : '종료일'}
            </span>
          </button>
        }
      >
        <DayPicker
          mode="range"
          locale={ko}
          selected={selected}
          defaultMonth={from}
          onSelect={noop}
          onDayClick={handleDayClick}
          showOutsideDays
          classNames={{
            root: 'p-4',
            months: 'flex flex-col',
            month: 'space-y-3',
            month_caption: 'flex justify-center items-center h-10',
            caption_label: 'text-base font-bold text-gray-900',
            nav: 'flex items-center justify-between absolute top-4 left-4 right-4',
            button_previous: 'p-1.5 rounded-lg hover:bg-gray-100 transition-colors',
            button_next: 'p-1.5 rounded-lg hover:bg-gray-100 transition-colors',
            weekdays: 'grid grid-cols-7 gap-1',
            weekday: 'text-sm font-semibold text-gray-500 text-center py-1.5',
            weeks: 'space-y-1',
            week: 'grid grid-cols-7 gap-1',
            day: 'text-center',
            day_button:
              'w-10 h-10 text-sm rounded-lg transition-colors hover:bg-duru-orange-50 focus:outline-none',
            today: 'font-bold',
            selected:
              '[&>button]:bg-duru-orange-500 [&>button]:text-white [&>button]:hover:bg-duru-orange-600',
            range_start:
              '[&>button]:bg-duru-orange-500 [&>button]:text-white [&>button]:rounded-l-lg',
            range_end:
              '[&>button]:bg-duru-orange-500 [&>button]:text-white [&>button]:rounded-r-lg',
            range_middle: 'bg-duru-orange-50 [&>button]:text-duru-orange-700',
            outside: 'text-gray-300',
            disabled: 'text-gray-300 cursor-not-allowed',
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === 'left' ? (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ),
          }}
        />
      </Popover>
      {(startDate || endDate) && onClear && (
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          초기화
        </button>
      )}
    </div>
  );
}
