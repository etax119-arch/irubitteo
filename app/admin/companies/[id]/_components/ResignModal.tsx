'use client';

import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker';

interface ResignForm {
  date: string;
  reason: string;
}

interface ResignModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  resignForm: ResignForm;
  setResignForm: (form: ResignForm) => void;
  onSubmit: () => void;
}

export function ResignModal({
  isOpen,
  onClose,
  companyName,
  resignForm,
  setResignForm,
  onSubmit,
}: ResignModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            회원사 탈퇴
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">
            <strong>{companyName}</strong> 회원사를 탈퇴 처리합니다.
            <br />
            탈퇴 처리 후 해당 회원사와 소속 근로자는 서비스에 접속할 수 없습니다.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              탈퇴일 <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={resignForm.date}
              onChange={(v) => setResignForm({ ...resignForm, date: v })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              비고 (탈퇴 사유 등)
            </label>
            <textarea
              value={resignForm.reason}
              onChange={(e) => setResignForm({ ...resignForm, reason: e.target.value })}
              placeholder="탈퇴 사유나 특이사항을 입력해주세요..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSubmit}
              disabled={!resignForm.date}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              회원사 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
