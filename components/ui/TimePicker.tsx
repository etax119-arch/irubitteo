'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Popover } from '@/components/ui/Popover';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export function TimePicker({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className,
  inputClassName,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const [hour, minute] = (value || '').split(':');

  const scrollToSelected = useCallback(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      if (hourRef.current && hour) {
        const idx = HOURS.indexOf(hour);
        if (idx >= 0) {
          hourRef.current.scrollTop = idx * 36 - 72;
        }
      }
      if (minuteRef.current && minute) {
        const idx = MINUTES.indexOf(minute);
        if (idx >= 0) {
          minuteRef.current.scrollTop = idx * 36 - 72;
        }
      }
    });
  }, [isOpen, hour, minute]);

  useEffect(() => {
    scrollToSelected();
  }, [scrollToSelected]);

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
              {MINUTES.map((m) => (
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
