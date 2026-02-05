'use client';

import { useState } from 'react';
import { Eye, Edit, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Company } from '@/types/adminDashboard';

interface CompanyCardProps {
  company: Company;
  onViewDetail: (company: Company) => void;
  onRevenueUpdate?: (companyId: number, newRevenue: number) => void;
}

export function CompanyCard({ company, onViewDetail, onRevenueUpdate }: CompanyCardProps) {
  const [isEditingRevenue, setIsEditingRevenue] = useState(false);
  const [revenueEditValue, setRevenueEditValue] = useState('');

  const startRevenueEdit = () => {
    setIsEditingRevenue(true);
    setRevenueEditValue((company.revenue / 10000).toString());
  };

  const saveRevenueEdit = () => {
    const newRevenue = parseFloat(revenueEditValue) * 10000;
    if (!isNaN(newRevenue) && newRevenue >= 0) {
      onRevenueUpdate?.(company.id, newRevenue);
    }
    setIsEditingRevenue(false);
    setRevenueEditValue('');
  };

  const cancelRevenueEdit = () => {
    setIsEditingRevenue(false);
    setRevenueEditValue('');
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold',
            company.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          )}
        >
          {company.status === 'active' ? '계약중' : '만료임박'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
          <div>
            <p className="text-sm text-gray-600">업종</p>
            <p className="font-semibold text-gray-900">{company.industry}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">위치</p>
            <p className="font-semibold text-gray-900">{company.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">근로자 수</p>
            <p className="font-semibold text-gray-900">{company.workers}명</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">계약만료</p>
            <p className="font-semibold text-gray-900">{company.contractEnd}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">월 정산액</p>
            {isEditingRevenue ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">₩</span>
                <input
                  type="number"
                  value={revenueEditValue}
                  onChange={(e) => setRevenueEditValue(e.target.value)}
                  placeholder="0"
                  className="w-20 px-2 py-1 border-2 border-duru-orange-500 rounded-lg text-base font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-duru-orange-500 text-right"
                  autoFocus
                />
                <span className="text-sm font-semibold text-gray-700">만</span>
                <button
                  onClick={saveRevenueEdit}
                  className="p-1 hover:bg-green-100 rounded transition-colors"
                >
                  <Check className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={cancelRevenueEdit}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ) : (
              <button
                onClick={startRevenueEdit}
                className="group flex items-center gap-1 hover:bg-gray-50 rounded transition-colors -ml-2"
              >
                <p className="font-semibold text-blue-600">
                  ₩{(company.revenue / 10000).toFixed(0)}만
                </p>
                <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
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
