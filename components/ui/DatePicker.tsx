'use client';

import { useState, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Popover } from '@/components/ui/Popover';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

function formatDisplay(value: string): string {
  if (!value) return '';
  const d = parse(value, 'yyyy-MM-dd', new Date());
  if (!isValid(d)) return value;
  return format(d, 'yyyy.MM.dd');
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  disabled = false,
  placeholder = '날짜 선택',
  className,
  inputClassName,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
  const defaultMonth = selected && isValid(selected) ? selected : new Date();

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onChange(format(date, 'yyyy-MM-dd'));
      }
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      )}
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="min-w-[340px]"
        trigger={
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 text-left',
              'focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-transparent',
              error
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-300 bg-white hover:border-gray-400',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
              inputClassName
            )}
          >
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={cn('flex-1', !value && 'text-gray-400')}>
              {value ? formatDisplay(value) : placeholder}
            </span>
          </button>
        }
      >
        <DayPicker
          mode="single"
          locale={ko}
          selected={selected}
          defaultMonth={defaultMonth}
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
            selected: '[&>button]:bg-duru-orange-500 [&>button]:text-white [&>button]:hover:bg-duru-orange-600',
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
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
