'use client';

import { Building2, Edit2, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';

type CompanyNoteSectionProps = {
  companyNote: string;
  isEditing: boolean;
  isSaving: boolean;
  tempNote: string;
  setTempNote: (v: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function CompanyNoteSection({
  companyNote,
  isEditing,
  isSaving,
  tempNote,
  setTempNote,
  onEdit,
  onSave,
  onCancel,
}: CompanyNoteSectionProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          기업 비고란
        </h3>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            수정
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={onCancel}
              className="px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-2 py-1 bg-duru-orange-500 text-white rounded text-xs font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-3 h-3" />
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>
      {!isEditing ? (
        <div className="bg-blue-50 rounded-lg p-3 min-h-[60px]">
          <p className="text-xs text-gray-700 whitespace-pre-wrap">
            {companyNote || '특이사항이 없습니다.'}
          </p>
        </div>
      ) : (
        <Textarea
          value={tempNote}
          onChange={(e) => setTempNote(e.target.value)}
          disabled={isSaving}
          placeholder="기업 비고 내용을 입력하세요..."
          rows={3}
          className="text-xs"
        />
      )}
    </div>
  );
}
