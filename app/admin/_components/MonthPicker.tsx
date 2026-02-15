'use client';

import { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover } from '@/components/ui/Popover';
import { cn } from '@/lib/cn';
import { formatDateAsKST } from '@/lib/kst';

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

interface ParsedMonth {
  year: number;
  month: number;
}

const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function parseMonth(value: string): ParsedMonth | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(year) || month < 1 || month > 12) return null;

  return { year, month };
}

function getCurrentMonth(): ParsedMonth {
  const [year, month] = formatDateAsKST(new Date()).substring(0, 7).split('-').map(Number);
  return { year, month };
}

function formatDisplay(value: string): string {
  const parsed = parseMonth(value);
  if (!parsed) return value;
  return `${parsed.year}.${String(parsed.month).padStart(2, '0')}`;
}

export function MonthPicker({
  value,
  onChange,
  className,
  inputClassName,
  disabled = false,
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = useMemo(() => parseMonth(value) ?? getCurrentMonth(), [value]);
  const [displayYear, setDisplayYear] = useState(selected.year);

  const handleSelectMonth = (month: number) => {
    onChange(`${displayYear}-${String(month).padStart(2, '0')}`);
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    if (disabled) return;
    setDisplayYear(selected.year);
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn('w-full', className)}>
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="min-w-[280px]"
        trigger={
          <button
            type="button"
            onClick={handleToggleOpen}
            disabled={disabled}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 text-left',
              'focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-transparent',
              'border-gray-300 bg-white hover:border-gray-400',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
              inputClassName
            )}
          >
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="flex-1">{formatDisplay(value)}</span>
          </button>
        }
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDisplayYear((prev) => prev - 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="이전 연도"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-base font-bold text-gray-900">{displayYear}년</span>
            <button
              type="button"
              onClick={() => setDisplayYear((prev) => prev + 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="다음 연도"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTH_LABELS.map((label, idx) => {
              const month = idx + 1;
              const isSelected = selected.year === displayYear && selected.month === month;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSelectMonth(month)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-duru-orange-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-duru-orange-50 hover:text-duru-orange-700'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </Popover>
    </div>
  );
}
