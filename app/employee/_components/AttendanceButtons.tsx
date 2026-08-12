'use client';

import { CalendarClock, CheckCircle2, Coffee } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatUtcTimestampAsKST } from '@/lib/kst';

export type AttendanceMode = 'loading' | 'error' | 'beforeHire' | 'holiday' | 'dayoff' | 'checkin' | 'checkout' | 'completed';

interface AttendanceButtonsProps {
  mode: AttendanceMode;
  onCheckIn: () => void;
  onCheckOut: () => void;
  holidayContent?: string;
  clockIn?: string | null;
  clockOut?: string | null;
  hireDate?: string;
}

export function AttendanceButtons({ mode, onCheckIn, onCheckOut, holidayContent, clockIn, clockOut, hireDate }: AttendanceButtonsProps) {
  if (mode === 'loading') {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (mode === 'error') {
    return (
      <div className="bg-red-50 rounded-xl p-8 text-center">
        <p className="text-red-600 font-medium">출퇴근 정보를 불러올 수 없습니다</p>
        <p className="text-red-400 text-sm mt-1">페이지를 새로고침해 주세요</p>
      </div>
    );
  }

  if (mode === 'beforeHire') {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <CalendarClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium text-lg">아직 출근 전이에요</p>
        {hireDate && (
          <p className="text-gray-500 text-sm mt-1">입사일({hireDate})부터 출근할 수 있습니다</p>
        )}
      </div>
    );
  }

  if (mode === 'holiday') {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium text-lg">오늘은 휴일입니다</p>
        {holidayContent && <p className="text-gray-500 text-sm mt-1">{holidayContent}</p>}
      </div>
    );
  }

  if (mode === 'dayoff') {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium text-lg">오늘은 근무일이 아닙니다</p>
        <p className="text-gray-500 text-sm mt-1">편안한 하루 보내세요</p>
      </div>
    );
  }

  if (mode === 'completed') {
    return (
      <div className="bg-duru-orange-50 rounded-xl p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-duru-orange-500 mx-auto mb-3" />
        <p className="text-duru-orange-700 font-medium text-lg mb-4">오늘 근무를 완료했습니다</p>
        <div className="flex justify-center items-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-500">출근</span>
            <span className="text-3xl sm:text-4xl font-bold text-duru-orange-600 tabular-nums tracking-tight">
              {clockIn ? formatUtcTimestampAsKST(clockIn) : '--:--'}
            </span>
          </div>
          <span className="text-2xl text-gray-200">|</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-gray-500">퇴근</span>
            <span className="text-3xl sm:text-4xl font-bold text-duru-orange-600 tabular-nums tracking-tight">
              {clockOut ? formatUtcTimestampAsKST(clockOut) : '--:--'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'checkin') {
    return (
      <button
        onClick={onCheckIn}
        className="w-full p-8 bg-gradient-to-br from-duru-orange-500 to-duru-orange-600 text-white rounded-xl hover:shadow-lg transition-all group"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Image src="/images/attendance/sun3.png" alt="출근" width={100} height={100} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">출근하기</h3>
            <p className="text-white/90">오늘의 할 일을 확인하세요</p>
          </div>
        </div>
      </button>
    );
  }

  // mode === 'checkout'
  return (
    <button
      onClick={onCheckOut}
      className="w-full p-8 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all group"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Image src="/images/attendance/moon3.png" alt="퇴근" width={100} height={100} />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">퇴근하기</h3>
          {clockIn ? (
            <p className="text-white/90 flex items-baseline justify-center gap-2">
              <span className="text-base">출근 시간</span>
              <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                {formatUtcTimestampAsKST(clockIn)}
              </span>
            </p>
          ) : (
            <p className="text-white/90">오늘 한 일을 기록하세요</p>
          )}
        </div>
      </div>
    </button>
  );
}
