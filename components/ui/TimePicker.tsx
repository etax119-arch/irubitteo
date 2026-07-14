'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Popover } from '@/components/ui/Popover';
import { useMaskedDraft } from '@/components/ui/useMaskedDraft';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  minuteStep?: number;
  /** true면 시계 팝오버와 함께 텍스트 직접 입력(HH:mm)도 허용 */
  allowManualInput?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

/** 숫자만 입력받아 HH:mm 형태로 콜론을 자동 삽입 (예: 0900 → 09:00) */
function maskTimeInput(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  const hour = digits.slice(0, 2);
  const minute = digits.slice(2, 4);
  let out = hour;
  if (digits.length > 2) out += `:${minute}`;
  return out;
}

/** 직접입력 확정: 빈 값은 해제(''), 유효한 HH:mm은 정규화, 그 외는 null(복원) */
function normalizeTime(draft: string): string | null {
  if (draft === '') return '';
  const m = draft.match(/^(\d{1,2}):(\d{1,2})$/);
  if (m) {
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
      return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
  }
  return null;
}

export function TimePicker({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className,
  inputClassName,
  minuteStep = 1,
  allowManualInput = false,
}: TimePickerProps) {
  const minutes = useMemo(
    () => Array.from({ length: Math.floor(60 / minuteStep) }, (_, i) =>
      (i * minuteStep).toString().padStart(2, '0')
    ),
    [minuteStep]
  );
  const [isOpen, setIsOpen] = useState(false);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const { draft, handleChange, commit } = useMaskedDraft(value, onChange, maskTimeInput, normalizeTime);

  const [hour, minute] = (value || '').split(':');

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      if (hourRef.current && hour) {
        const idx = HOURS.indexOf(hour);
        if (idx >= 0) {
          hourRef.current.scrollTop = idx * 36 - 72;
        }
      }
      if (minuteRef.current && minute) {
        const idx = minutes.indexOf(minute);
        if (idx >= 0) {
          minuteRef.current.scrollTop = idx * 36 - 72;
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleHourClick = (h: string) => {
    const m = minute || '00';
    onChange(`${h}:${m}`);
  };

  const handleMinuteClick = (m: string) => {
    const h = hour || '09';
    onChange(`${h}:${m}`);
    setIsOpen(false);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      )}
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
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
                placeholder="HH:mm"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-label="시간 선택 열기"
                className="flex-shrink-0 disabled:cursor-not-allowed"
              >
                <Clock className="w-4 h-4 text-gray-400" />
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
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className={cn('flex-1', !value && 'text-gray-400')}>
                {value || '시간 선택'}
              </span>
            </button>
          )
        }
        className="w-[200px]"
      >
        <div className="flex divide-x divide-gray-200" style={{ height: '216px' }}>
          <div
            ref={hourRef}
            className="flex-1 overflow-y-auto scrollbar-light"
          >
            <div className="py-1">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleHourClick(h)}
                  className={cn(
                    'w-full h-9 text-sm transition-colors',
                    h === hour
                      ? 'bg-duru-orange-500 text-white font-bold'
                      : 'text-gray-700 hover:bg-duru-orange-50'
                  )}
                >
                  {h}시
                </button>
              ))}
            </div>
          </div>
          <div
            ref={minuteRef}
            className="flex-1 overflow-y-auto scrollbar-light"
          >
            <div className="py-1">
              {minutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMinuteClick(m)}
                  className={cn(
                    'w-full h-9 text-sm transition-colors',
                    m === minute
                      ? 'bg-duru-orange-500 text-white font-bold'
                      : 'text-gray-700 hover:bg-duru-orange-50'
                  )}
                >
                  {m}분
                </button>
              ))}
            </div>
          </div>
        </div>
      </Popover>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
