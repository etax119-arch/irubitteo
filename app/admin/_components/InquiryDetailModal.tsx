'use client';

import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import type { Inquiry } from '@/types/inquiry';

interface InquiryDetailModalProps {
  inquiry: Inquiry | null;
  onClose: () => void;
  onComplete: (inquiryId: string) => void;
}

export function InquiryDetailModal({ inquiry, onClose, onComplete }: InquiryDetailModalProps) {
  if (!inquiry) return null;

  const handleComplete = () => {
    onComplete(inquiry.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">기업 문의 상세</h3>
          <IconButton onClick={onClose} variant="ghost" size="sm" icon={<X className="w-full h-full" />} label="닫기" />
        </div>
        <div className="px-6 py-6">
          <h4 className="text-sm font-semibold text-gray-500 mb-3">기업 정보</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">기업명</p>
              <p className="text-base font-bold text-gray-900">{inquiry.companyName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">대표자</p>
              <p className="text-base text-gray-900">{inquiry.representativeName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">전화번호</p>
              <p className="text-base text-gray-900">{inquiry.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">이메일</p>
              <p className="text-base text-gray-900">{inquiry.email ?? '-'}</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">문의 내용</h4>
            <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
              {inquiry.content}
            </p>
            <p className="text-xs text-gray-400 mt-3">접수일: {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-gray-100 space-y-2">
          <button
            onClick={handleComplete}
            className="w-full py-3 bg-duru-orange-500 hover:bg-duru-orange-600 text-white rounded-lg text-base font-bold transition-colors"
          >
            상담 완료
          </button>
          <p className="text-xs text-gray-400 text-center">
            상담이 완료된 문의는 알림 센터에서 자동 제거됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
