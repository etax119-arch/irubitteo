'use client';

import { User, Phone, Mail, Edit3, Save, X, Copy, Check } from 'lucide-react';

interface PMInfo {
  name: string;
  phone: string;
  email: string;
}

interface PMInfoCardProps {
  pmInfo: PMInfo;
  isEditingPm: boolean;
  editedPm: PMInfo;
  setEditedPm: (pm: PMInfo) => void;
  copiedEmail: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCopyEmail: () => void;
}

export function PMInfoCard({
  pmInfo,
  isEditingPm,
  editedPm,
  setEditedPm,
  copiedEmail,
  onEdit,
  onSave,
  onCancel,
  onCopyEmail,
}: PMInfoCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-duru-orange-600" />
          영업 담당자
        </h3>
        {!isEditingPm ? (
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={onSave}
              className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 text-green-600" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 w-12">이름:</span>
          {isEditingPm ? (
            <input
              type="text"
              value={editedPm.name}
              onChange={(e) => setEditedPm({ ...editedPm, name: e.target.value })}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          ) : (
            <span className="font-semibold text-gray-900">{pmInfo.name || '-'}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 w-12">연락처:</span>
          {isEditingPm ? (
            <input
              type="text"
              value={editedPm.phone}
              onChange={(e) => setEditedPm({ ...editedPm, phone: e.target.value })}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          ) : (
            <span className="font-semibold text-gray-900">{pmInfo.phone || '-'}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 w-12">이메일:</span>
          {isEditingPm ? (
            <input
              type="email"
              value={editedPm.email}
              onChange={(e) => setEditedPm({ ...editedPm, email: e.target.value })}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{pmInfo.email || '-'}</span>
              {pmInfo.email && (
                <button
                  onClick={onCopyEmail}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="이메일 복사"
                >
                  {copiedEmail ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
