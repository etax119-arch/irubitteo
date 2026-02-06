'use client';

import { Clock, CheckCircle2 } from 'lucide-react';

interface AttendanceButtonsProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
}

export function AttendanceButtons({ onCheckIn, onCheckOut }: AttendanceButtonsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <button
        onClick={onCheckIn}
        className="p-8 bg-gradient-to-br from-duru-orange-500 to-duru-orange-600 text-white rounded-xl hover:shadow-lg transition-all group"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">출근하기</h3>
            <p className="text-white/90">오늘의 할 일을 확인하세요</p>
          </div>
        </div>
      </button>

      <button
        onClick={onCheckOut}
        className="p-8 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all group"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">퇴근하기</h3>
            <p className="text-white/90">오늘 한 일을 기록하세요</p>
          </div>
        </div>
      </button>
    </div>
  );
}
