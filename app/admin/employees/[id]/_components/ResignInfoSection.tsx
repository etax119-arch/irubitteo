'use client';

import { UserX } from 'lucide-react';
import type { Employee } from '@/types/employee';

type ResignInfoSectionProps = {
  worker: Employee;
};

export function ResignInfoSection({ worker }: ResignInfoSectionProps) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <UserX className="w-4 h-4 text-gray-500" />
        퇴사 정보
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">퇴사일</span>
          <span className="font-bold text-gray-700">{worker.resignDate?.substring(0, 10) ?? '-'}</span>
        </div>
        {worker.resignReason && (
          <div className="text-xs">
            <span className="text-gray-600">비고</span>
            <p className="mt-1 p-2 bg-white rounded border border-gray-200 text-gray-700">
              {worker.resignReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
