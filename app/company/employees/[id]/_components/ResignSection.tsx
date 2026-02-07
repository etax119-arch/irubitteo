import { UserX } from 'lucide-react';
import type { Employee } from '@/types/employee';

interface ResignSectionProps {
  employee: Employee;
  onOpenResignModal: () => void;
}

export function ResignSection({ employee, onOpenResignModal }: ResignSectionProps) {
  if (employee.isActive) {
    return (
      <button
        onClick={onOpenResignModal}
        className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
      >
        <UserX className="w-5 h-5" />
        퇴사 등록
      </button>
    );
  }

  return (
    <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <UserX className="w-4 h-4 text-gray-500" />
        퇴사 정보
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">퇴사일</span>
          <span className="font-bold text-gray-700">{employee.resignDate}</span>
        </div>
        {employee.resignReason && (
          <div className="text-xs">
            <span className="text-gray-600">비고</span>
            <p className="mt-1 p-2 bg-white rounded border border-gray-200 text-gray-700">
              {employee.resignReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
