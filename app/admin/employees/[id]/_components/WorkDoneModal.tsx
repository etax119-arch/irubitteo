'use client';

import { X } from 'lucide-react';

type WorkDoneModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedWorkDone: { date: string; workDone: string } | null;
};

export function WorkDoneModal({
  isOpen,
  onClose,
  selectedWorkDone,
}: WorkDoneModalProps) {
  if (!isOpen || !selectedWorkDone) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">업무 내용</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">{selectedWorkDone.date}</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900">{selectedWorkDone.workDone}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
