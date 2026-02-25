'use client';

import { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  Hash,
  Edit3,
  Save,
  Clock,
  Copy,
  Check,
} from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { formatKSTDate } from '@/lib/kst';
import type { CompanyWithEmployeeCount } from '@/types/company';

interface EditedInfo {
  hrContactName: string;
  hrContactPhone: string;
  hrContactEmail: string;
  address: string;
}

interface CompanyProfileCardProps {
  company: CompanyWithEmployeeCount;
  isEditing: boolean;
  editedInfo: EditedInfo;
  setEditedInfo: (info: EditedInfo) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function CompanyProfileCard({
  company,
  isEditing,
  editedInfo,
  setEditedInfo,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: CompanyProfileCardProps) {
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!company.code) return;
    await navigator.clipboard.writeText(company.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{company.name}</h2>
        <p className="text-gray-600">{company.businessNumber || '-'}</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
            company.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {company.isActive ? '활성' : '탈퇴'}
        </span>
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-6">
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-600 block">주소:</span>
            {isEditing ? (
              <Textarea
                value={editedInfo.address}
                onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                rows={2}
                className="mt-1 text-sm"
              />
            ) : (
              <span className="font-semibold text-gray-900">{company.address || '-'}</span>
            )}
          </div>
        </div>

        {/* HR 담당자 */}
        <div className="border-t border-gray-200 my-3" />
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">HR 담당자</p>
        <div className="flex items-start gap-3 text-sm">
          <User className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-600 block">담당자:</span>
            {isEditing ? (
              <Input
                type="text"
                value={editedInfo.hrContactName}
                onChange={(e) => setEditedInfo({ ...editedInfo, hrContactName: e.target.value })}
                size="sm"
                className="mt-1"
              />
            ) : (
              <span className="font-semibold text-gray-900">{company.hrContactName || '-'}</span>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-600 block">담당자 연락처:</span>
            {isEditing ? (
              <Input
                type="text"
                value={editedInfo.hrContactPhone}
                onChange={(e) => setEditedInfo({ ...editedInfo, hrContactPhone: e.target.value })}
                size="sm"
                className="mt-1"
              />
            ) : (
              <span className="font-semibold text-gray-900">{company.hrContactPhone || '-'}</span>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-600 block">담당자 이메일:</span>
            {isEditing ? (
              <Input
                type="email"
                value={editedInfo.hrContactEmail}
                onChange={(e) => setEditedInfo({ ...editedInfo, hrContactEmail: e.target.value })}
                size="sm"
                className="mt-1"
              />
            ) : (
              <span className="font-semibold text-gray-900">{company.hrContactEmail || '-'}</span>
            )}
          </div>
        </div>

        {/* 계약 정보 */}
        <div className="border-t border-gray-200 my-3" />
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <span className="text-gray-600 block">계약 시작일:</span>
            <span className="font-semibold text-gray-900">
              {company.contractStartDate || '-'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Hash className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <span className="text-gray-600 block">기업 고유 번호:</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 font-semibold text-gray-900 font-mono tracking-wide hover:text-blue-600 transition-colors cursor-pointer"
              title="클릭하여 복사"
            >
              {company.code}
              {codeCopied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <span className="text-gray-600 block">등록일:</span>
            <span className="font-semibold text-gray-900">
              {formatKSTDate(company.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={onCancelEdit}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSaveEdit}
              className="flex-1 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          </div>
        ) : (
          <button
            onClick={onStartEdit}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            정보 수정
          </button>
        )}
      </div>
    </div>
  );
}
