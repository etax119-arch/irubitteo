'use client';

import { Home } from 'lucide-react';

interface HeaderCardProps {
  userName: string;
  onLogout: () => void;
}

export function HeaderCard({ userName, onLogout }: HeaderCardProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {userName}님, 환영합니다!
        </h2>
        <p className="text-gray-600 mt-1">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </p>
      </div>
      <button
        onClick={onLogout}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Home className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}
