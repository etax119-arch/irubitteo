'use client';

import { FileText } from 'lucide-react';
import type { Inquiry } from '@/types/adminDashboard';

interface InquiryListProps {
  inquiries: Inquiry[];
  onViewDetail: (inquiry: Inquiry) => void;
}

export function InquiryList({ inquiries, onViewDetail }: InquiryListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          신규 기업 문의 알림
        </h3>
        <p className="text-sm text-gray-400 mt-1">홈페이지를 통해 접수된 신규 기업 문의입니다.</p>
      </div>
      <div className="divide-y divide-gray-100">
        {inquiries.length > 0 ? (
          inquiries.map((inq) => (
            <div key={inq.id} className="px-6 py-3.5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{inq.company}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                    신규 문의
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  대표: {inq.ceo} · {inq.date}
                </p>
                <p className="text-sm text-gray-400 mt-0.5 truncate">{inq.summary}</p>
              </div>
              <button
                onClick={() => onViewDetail(inq)}
                className="px-4 py-2 rounded-lg bg-duru-orange-500 hover:bg-duru-orange-600 text-white text-sm font-semibold whitespace-nowrap transition-colors"
              >
                문의 확인
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
