'use client';

import { Eye } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CompanyWithEmployeeCount } from '@/types/company';

interface CompanyCardProps {
  company: CompanyWithEmployeeCount;
  onViewDetail: (company: CompanyWithEmployeeCount) => void;
}

export function CompanyCard({ company, onViewDetail }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold',
            company.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          )}
        >
          {company.isActive ? '계약중' : '비활성'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div>
            <p className="text-sm text-gray-600">위치</p>
            <p className="font-semibold text-gray-900">{company.address || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">근로자 수</p>
            <p className="font-semibold text-gray-900">{company.employeeCount}명</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">계약시작일</p>
            <p className="font-semibold text-gray-900">{company.contractStartDate || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">담당 PM</p>
            <p className="font-semibold text-gray-900">{company.pmContactName || '-'}</p>
          </div>
        </div>
        <button
          onClick={() => onViewDetail(company)}
          className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-2 shrink-0"
        >
          <Eye className="w-4 h-4" />
          상세보기
        </button>
      </div>
    </div>
  );
}
