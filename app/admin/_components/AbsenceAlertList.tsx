'use client';

import { AlertCircle } from 'lucide-react';
import type { AbsenceAlert } from '@/types/adminDashboard';

interface AbsenceAlertListProps {
  alerts: AbsenceAlert[];
  onDismiss: (alertId: string, employeeId: string) => void;
}

export function AbsenceAlertList({ alerts, onDismiss }: AbsenceAlertListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[480px] flex flex-col">
      {/* 상단 오렌지 포인트 라인 */}
      <div className="h-1 bg-gradient-to-r from-duru-orange-400 to-duru-orange-500 shrink-0" />
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-duru-orange-500" />
          장애인 근로자 결근 알림
        </h3>
        <p className="text-sm text-gray-400 mt-1">현재 출근 하지 않은 근로자들에 대한 정보 입니다.</p>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 scrollbar-light">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-3.5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{alert.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-600">
                    결근
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {alert.companyName} · {alert.date}
                </p>
              </div>
              <button
                onClick={() => onDismiss(alert.id, alert.employeeId)}
                className="px-4 py-2 rounded-lg border border-duru-orange-300 bg-duru-orange-50 text-duru-orange-600 hover:bg-duru-orange-100 text-sm font-semibold whitespace-nowrap transition-colors"
              >
                확인하기
              </button>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-400 text-sm">현재 확인할 알림이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
