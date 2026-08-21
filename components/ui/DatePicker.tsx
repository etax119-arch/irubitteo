'use client';

import { useState, useCallback, useEffect } from 'react';
import { DayPicker, type Matcher } from 'react-day-picker';
import { format, parse, isValid, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Popover } from '@/components/ui/Popover';
import { useMaskedDraft } from '@/components/ui/useMaskedDraft';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  minDate?: string;
  maxDate?: string;
  /** true면 달력 팝오버와 함께 텍스트 직접 입력(yyyy-MM-dd)도 허용 */
  allowManualInput?: boolean;
}

function formatDisplay(value: string): string {
  if (!value) return '';
  const d = parse(value, 'yyyy-MM-dd', new Date());
  if (!isValid(d)) return value;
  return format(d, 'yyyy.MM.dd');
}

/** 숫자만 입력받아 yyyy-MM-dd 형태로 하이픈을 자동 삽입 (예: 20260207 → 2026-02-07) */
function maskDateInput(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const day = digits.slice(6, 8);
  let out = year;
  if (digits.length > 4) out += `-${month}`;
  if (digits.length > 6) out += `-${day}`;
  return out;
}

/** 직접입력 확정: 빈 값은 해제(''), 유효한 yyyy-MM-dd는 정규화, 그 외는 null(복원) */
function normalizeDate(draft: string): string | null {
  if (draft === '') return '';
  const parsed = parse(draft, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : null;
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
  minDate,
  maxDate,
  allowManualInput = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { draft, handleChange, commit } = useMaskedDraft(value, onChange, maskDateInput, normalizeDate);

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
  const initialMonth = selected && isValid(selected) ? selected : new Date();
  const [month, setMonth] = useState(initialMonth);

  // 값이 밖에서 바뀌면(직접입력 확정 등) 달력이 그 달을 보여주도록 맞춘다.
  // 달력 안에서 월을 넘기는 것은 value를 바꾸지 않으므로 이 효과가 방해하지 않는다.
  useEffect(() => {
    if (!value) return;
    const parsed = parse(value, 'yyyy-MM-dd', new Date());
    if (isValid(parsed)) setMonth(parsed);
  }, [value]);

  const disabledMatchers: Matcher[] = [];
  if (minDate) {
    const min = parse(minDate, 'yyyy-MM-dd', new Date());
    if (isValid(min)) disabledMatchers.push({ before: min });
  }
  if (maxDate) {
    const max = parse(maxDate, 'yyyy-MM-dd', new Date());
    if (isValid(max)) disabledMatchers.push({ after: max });
  }

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
        className="min-w-[300px] sm:min-w-[340px]"
        trigger={
          allowManualInput ? (
            <div
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-all duration-200',
                'focus-within:ring-2 focus-within:ring-duru-orange-400 focus-within:border-transparent',
                error
                  ? 'border-red-400 bg-red-50/50'
                  : 'border-gray-300 bg-white hover:border-gray-400',
                disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
                inputClassName
              )}
            >
              <input
                type="text"
                inputMode="numeric"
                value={draft}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commit();
                  }
                }}
                disabled={disabled}
                placeholder={placeholder === '날짜 선택' ? 'yyyy-MM-dd' : placeholder}
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-label="달력 열기"
                className="flex-shrink-0 disabled:cursor-not-allowed"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ) : (
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
          )
        }
      >
        <DayPicker
          mode="single"
          locale={ko}
          selected={selected}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleSelect}
          disabled={disabledMatchers.length > 0 ? disabledMatchers : undefined}
          showOutsideDays
          classNames={{
            root: 'p-3 sm:p-4',
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
              'w-9 h-9 sm:w-10 sm:h-10 text-sm rounded-lg transition-colors hover:bg-duru-orange-50 focus:outline-none',
            today: 'font-bold',
            selected: '[&>button]:bg-duru-orange-500 [&>button]:text-white [&>button]:hover:bg-duru-orange-600',
            outside: 'text-gray-300',
            disabled: 'text-gray-300 cursor-not-allowed',
          }}
          components={{
            Nav: () => (
              <div className="flex items-center justify-between absolute top-4 left-4 right-4">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setMonth(prev => subYears(prev, 1))}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonth(prev => subMonths(prev, 1))}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setMonth(prev => addMonths(prev, 1))}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonth(prev => addYears(prev, 1))}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronsRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ),
          }}
        />
      </Popover>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
