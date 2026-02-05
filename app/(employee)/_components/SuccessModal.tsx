'use client';

import { Smile } from 'lucide-react';

interface SuccessModalProps {
  type: 'checkin' | 'checkout';
  onClose: () => void;
}

export function SuccessModal({ type, onClose }: SuccessModalProps) {
  const isCheckin = type === 'checkin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-duru-orange-100 rounded-full mb-6">
          <Smile className="w-10 h-10 text-duru-orange-600" />
        </div>
        {isCheckin ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              출근이 완료되었어요!<br/>오늘도 파이팅!
            </h2>
            <p className="text-gray-500 mb-8">안전하게 근무하시길 바랍니다.</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">퇴근 완료!</h2>
            <p className="text-lg text-gray-700 mb-2">오늘도 너무 고생하셨습니다</p>
            <p className="text-gray-400 mb-8">편안한 저녁 시간 보내세요.</p>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full py-4 bg-duru-orange-500 text-white rounded-lg font-bold text-lg hover:bg-duru-orange-600 transition-colors"
        >
          메인으로 이동
        </button>
      </div>
    </div>
  );
}
