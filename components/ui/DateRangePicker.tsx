'use client';

import { useState, useCallback } from 'react';
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

  const from = toDate(startDate);
  const to = toDate(endDate);

  const selected = from ? (to ? { from, to } : { from, to: from }) : undefined;

  const handleSelect = useCallback(
    (range: { from?: Date; to?: Date } | undefined) => {
      if (!range) {
        onStartDateChange('');
        onEndDateChange('');
        return;
      }
      if (range.from) {
        onStartDateChange(format(range.from, 'yyyy-MM-dd'));
      }
      if (range.to) {
        onEndDateChange(format(range.to, 'yyyy-MM-dd'));
        if (range.from && range.to) {
          setIsOpen(false);
        }
      } else {
        onEndDateChange('');
      }
    },
    [onStartDateChange, onEndDateChange]
  );

  return (
    <div className="flex items-center gap-2">
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="min-w-[340px]"
        trigger={
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
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
          onSelect={handleSelect}
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
