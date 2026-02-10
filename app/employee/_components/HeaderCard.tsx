'use client';

import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface HeaderCardProps {
  userName: string;
  onLogout: () => void;
}

function getFormattedToday() {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });
}

export function HeaderCard({ userName, onLogout }: HeaderCardProps) {
  const [today, setToday] = useState(() => getFormattedToday());

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getFormattedToday();
      setToday(prev => prev !== newDate ? newDate : prev);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {userName}님, 환영합니다!
        </h2>
        <p className="text-gray-600 mt-1">
          {today}
        </p>
      </div>
      <button
        onClick={onLogout}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="로그아웃"
      >
        <LogOut className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}
