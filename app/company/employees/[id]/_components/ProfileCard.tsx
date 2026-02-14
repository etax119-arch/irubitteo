'use client';

import { Phone, Heart, User, Briefcase, MapPin, IdCard, Edit2, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '@/lib/status';
import { CITY_OPTIONS, getDistrictOptions } from '@/lib/address';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/Input';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import type { Employee } from '@/types/employee';
import type { ProfileFormState } from '../../_hooks/useEmployeeEditForm';

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

interface ProfileCardProps {
  employee: Employee;
  isEditing: boolean;
  isSaving: boolean;
  profileForm: ProfileFormState;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdateForm: <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => void;
  isUploadingImage?: boolean;
  onUploadImage?: (base64: string) => void;
  onDeleteImage?: () => void;
}

export function ProfileCard({
  employee,
  isEditing,
  isSaving,
  profileForm,
  onEdit,
  onSave,
  onCancel,
  onUpdateForm,
  isUploadingImage = false,
  onUploadImage,
  onDeleteImage,
}: ProfileCardProps) {
  const emergencyContact =
    employee.emergencyContactName && employee.emergencyContactPhone
      ? `${employee.emergencyContactName} (${employee.emergencyContactRelation ?? '-'}) ${employee.emergencyContactPhone}`
      : '-';

  const districtOptions = getDistrictOptions(profileForm.addressCity);

  return (
    <>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center mb-6">
          <ProfileImageUpload
            src={employee.profileImage}
            name={employee.name}
            isUploading={isUploadingImage}
            onUpload={onUploadImage ?? (() => {})}
            onDelete={onDeleteImage ?? (() => {})}
            editable={isEditing && !!onUploadImage}
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{employee.name}</h2>
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2',
              getEmployeeStatusStyle(employee.status, employee.isActive)
            )}
          >
            {getEmployeeStatusLabel(employee.status, employee.isActive)}
          </span>
        </div>

        <div className="flex justify-end mb-2">
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
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 text-sm">
              <IdCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">주민번호:</span>
              <span className="font-semibold text-gray-900">{employee.ssn ?? '-'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">핸드폰번호:</span>
              <span className="font-semibold text-gray-900">{employee.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">주소:</span>
              <span className="font-semibold text-gray-900">
                {employee.addressCity
                  ? `${employee.addressCity} ${employee.addressDistrict ?? ''}${employee.addressDetail ? ` ${employee.addressDetail}` : ''}`.trim()
                  : '-'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Heart className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">비상연락처:</span>
              <span className="font-semibold text-gray-900">{emergencyContact}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">성별:</span>
              <span className="font-semibold text-gray-900">{employee.gender ?? '-'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">입사일:</span>
              <span className="font-semibold text-gray-900">{employee.hireDate}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <Input
              label="이름"
              type="text"
              size="sm"
              value={profileForm.name}
              onChange={(e) => onUpdateForm('name', e.target.value)}
              className="py-1.5"
            />
            <Input
              label="주민번호"
              type="text"
              size="sm"
              value={profileForm.ssn}
              onChange={(e) => onUpdateForm('ssn', formatSSN(e.target.value))}
              placeholder="000000-0000000"
              className="py-1.5"
            />
            <Input
              label="핸드폰번호"
              type="text"
              size="sm"
              value={profileForm.phone}
              onChange={(e) => onUpdateForm('phone', formatPhoneNumber(e.target.value))}
              placeholder="010-0000-0000"
              className="py-1.5"
            />
            <div>
              <label className="block text-xs text-gray-600 mb-1">성별</label>
              <div className="flex gap-2">
                {['남', '여'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onUpdateForm('gender', g)}
                    className={cn(
                      'flex-1 py-1.5 rounded text-xs font-semibold transition-colors border',
                      profileForm.gender === g
                        ? 'bg-duru-orange-500 text-white border-duru-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">입사일</label>
              <DatePicker
                value={profileForm.hireDate}
                onChange={(v) => onUpdateForm('hireDate', v)}
                inputClassName="py-1.5"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">주소 (시/도)</label>
              <select
                value={profileForm.addressCity}
                onChange={(e) => {
                  onUpdateForm('addressCity', e.target.value);
                  onUpdateForm('addressDistrict', '');
                }}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
              >
                <option value="">선택</option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">주소 (시/군/구)</label>
              <select
                value={profileForm.addressDistrict}
                onChange={(e) => onUpdateForm('addressDistrict', e.target.value)}
                disabled={!profileForm.addressCity}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 disabled:bg-gray-100"
              >
                <option value="">선택</option>
                {districtOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <Input
              label="상세 주소"
              type="text"
              size="sm"
              value={profileForm.addressDetail}
              onChange={(e) => onUpdateForm('addressDetail', e.target.value)}
              className="py-1.5"
            />
            <Input
              label="비상연락처 이름"
              type="text"
              size="sm"
              value={profileForm.emergencyContactName}
              onChange={(e) => onUpdateForm('emergencyContactName', e.target.value)}
              className="py-1.5"
            />
            <Input
              label="비상연락처 관계"
              type="text"
              size="sm"
              value={profileForm.emergencyContactRelation}
              onChange={(e) => onUpdateForm('emergencyContactRelation', e.target.value)}
              className="py-1.5"
            />
            <Input
              label="비상연락처 전화"
              type="text"
              size="sm"
              value={profileForm.emergencyContactPhone}
              onChange={(e) => onUpdateForm('emergencyContactPhone', formatPhoneNumber(e.target.value))}
              placeholder="010-0000-0000"
              className="py-1.5"
            />
          </div>
        )}
      </div>

      <div className="bg-duru-orange-50 rounded-xl p-6 border border-duru-orange-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-duru-orange-600 text-lg">#</span>
          근로자 고유번호
        </h3>
        {isEditing ? (
          <div className="bg-white rounded-lg p-4 border border-duru-orange-300">
            <Input
              type="text"
              value={profileForm.uniqueCode}
              onChange={(e) => onUpdateForm('uniqueCode', e.target.value)}
              maxLength={20}
              className="text-2xl font-bold text-duru-orange-600 text-center tracking-wider bg-transparent border-0 border-b-2 border-duru-orange-300 rounded-none focus:ring-0 focus:border-duru-orange-500"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 border border-duru-orange-300">
            <p className="text-2xl font-bold text-duru-orange-600 text-center tracking-wider">
              {employee.uniqueCode}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
