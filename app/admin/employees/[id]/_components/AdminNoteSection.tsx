'use client';

import { MessageSquare, Edit2, Check, Loader2 } from 'lucide-react';

type AdminNoteSectionProps = {
  notes: string;
  isEditingNotes: boolean;
  tempNotes: string;
  setTempNotes: (value: string) => void;
  savingNotes: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function AdminNoteSection({
  notes,
  isEditingNotes,
  tempNotes,
  setTempNotes,
  savingNotes,
  onEdit,
  onSave,
  onCancel,
}: AdminNoteSectionProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-duru-orange-600" />
          비고란
        </h3>
        {!isEditingNotes ? (
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
              disabled={savingNotes}
              className="px-2 py-1 bg-duru-orange-500 text-white rounded text-xs font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              저장
            </button>
          </div>
        )}
      </div>
      {!isEditingNotes ? (
        <div className="bg-gray-50 rounded-lg p-3 min-h-[60px]">
          <p className="text-xs text-gray-700 whitespace-pre-wrap">
            {notes || '특이사항이 없습니다.'}
          </p>
        </div>
      ) : (
        <textarea
          value={tempNotes}
          onChange={(e) => setTempNotes(e.target.value)}
          placeholder="근로자 특징이나 특이사항을 입력하세요..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-duru-orange-500 resize-none"
        />
      )}
    </div>
  );
}
