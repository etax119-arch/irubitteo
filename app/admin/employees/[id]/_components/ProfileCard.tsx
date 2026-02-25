'use client';

import { useState } from 'react';
import {
  Building2,
  Phone,
  Heart,
  Users as UserIcon,
  Briefcase,
  IdCard,
  Shield,
  Hash,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '@/lib/status';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import type { Employee } from '@/types/employee';

type ProfileCardProps = {
  worker: Employee;
  isUploadingImage?: boolean;
  onUploadImage?: (blob: Blob) => void;
  onDeleteImage?: () => void;
};

export function ProfileCard({
  worker,
  isUploadingImage = false,
  onUploadImage,
  onDeleteImage,
}: ProfileCardProps) {
  const [codeCopied, setCodeCopied] = useState(false);
  const statusLabel = getEmployeeStatusLabel(worker.status, worker.isActive);
  const statusClass = getEmployeeStatusStyle(worker.status, worker.isActive);

  const handleCopyCode = async () => {
    if (!worker.uniqueCode) return;
    await navigator.clipboard.writeText(worker.uniqueCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <>
      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center mb-6">
          <ProfileImageUpload
            src={worker.profileImage}
            name={worker.name}
            isUploading={isUploadingImage}
            onUpload={onUploadImage ?? (() => {})}
            onDelete={onDeleteImage ?? (() => {})}
            editable={!!onUploadImage}
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{worker.name}</h2>
          <p className="text-gray-600">{worker.disability ?? '-'}</p>
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2',
              statusClass
            )}
          >
            {statusLabel}
          </span>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">소속 회사:</span>
            <span className="font-semibold text-gray-900">
              {(worker as Employee & { companyName?: string }).companyName ?? '-'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <IdCard className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">주민번호:</span>
            <span className="font-semibold text-gray-900">{worker.ssn ?? '-'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">핸드폰번호:</span>
            <span className="font-semibold text-gray-900">{worker.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Heart className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">비상연락처:</span>
            <span className="font-semibold text-gray-900">
              {worker.emergencyContactPhone
                ? `${worker.emergencyContactPhone} (${worker.emergencyContactRelation ?? ''})`
                : '-'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <UserIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">성별:</span>
            <span className="font-semibold text-gray-900">{worker.gender ?? '-'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">입사일:</span>
            <span className="font-semibold text-gray-900">{worker.hireDate?.substring(0, 10) ?? '-'}</span>
          </div>
        </div>
      </div>

      {/* 근로자 고유번호 */}
      <div className="bg-duru-orange-50 rounded-xl p-6 border border-duru-orange-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5 text-duru-orange-600" />
          근로자 고유번호
        </h3>
        <button
          type="button"
          onClick={handleCopyCode}
          className="w-full bg-white rounded-lg p-4 border border-duru-orange-300 hover:bg-duru-orange-50 transition-colors cursor-pointer"
          title="클릭하여 복사"
        >
          <p className="text-2xl font-bold text-duru-orange-600 text-center tracking-wider flex items-center justify-center gap-2">
            {worker.uniqueCode}
            {codeCopied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-duru-orange-400" />
            )}
          </p>
        </button>
      </div>

      {/* 장애 정보 */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-duru-orange-600" />
          장애 정보
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">유형</span>
            <span className="font-bold text-gray-900">{worker.disabilityType ?? worker.disability ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">중증/경증</span>
            <span className={cn(
              'inline-block px-2 py-0.5 rounded-full text-xs font-bold',
              worker.disabilitySeverity === '중증'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            )}>
              {worker.disabilitySeverity ?? '-'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">인정일</span>
            <span className="font-bold text-gray-900">
              {worker.disabilityRecognitionDate?.substring(0, 10) ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
