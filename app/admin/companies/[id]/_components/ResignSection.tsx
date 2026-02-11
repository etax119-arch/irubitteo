'use client';

import { Trash2, AlertTriangle } from 'lucide-react';
import type { CompanyWithEmployeeCount } from '@/types/company';

interface ResignSectionProps {
  company: CompanyWithEmployeeCount;
  onOpenResignModal: () => void;
}

export function ResignSection({ company, onOpenResignModal }: ResignSectionProps) {
  if (company.isActive) {
    return (
      <button
        onClick={onOpenResignModal}
        className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
      >
        <Trash2 className="w-5 h-5" />
        회원사 탈퇴
      </button>
    );
  }

  return (
    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
      <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5" />
        탈퇴 회원사
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-red-600">탈퇴일:</span>
          <span className="font-semibold text-red-900">{company.resignDate || '-'}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-600 shrink-0">탈퇴 사유:</span>
          <span className="font-semibold text-red-900">{company.resignReason || '(사유 없음)'}</span>
        </div>
      </div>
    </div>
  );
}
