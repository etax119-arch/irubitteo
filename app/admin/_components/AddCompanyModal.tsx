'use client';

import { useState } from 'react';
import { X, Building2, User, Phone, Mail, MapPin, Lock, CheckCircle2, Check } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker';
import type { CompanyCreateInput } from '@/types/company';

type AddCompanyForm = {
  companyName: string;
  businessNumber: string;
  address: string;
  contractStartDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyCode: string;
};

type PMInfo = {
  name: string;
  phone: string;
  email: string;
};

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyCreateInput) => void;
  isSubmitting?: boolean;
}

const initialForm: AddCompanyForm = {
  companyName: '',
  businessNumber: '',
  address: '',
  contractStartDate: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  companyCode: '',
};

const initialPmInfo: PMInfo = {
  name: '',
  phone: '',
  email: '',
};

export function AddCompanyModal({ isOpen, onClose, onSubmit, isSubmitting }: AddCompanyModalProps) {
  const [form, setForm] = useState<AddCompanyForm>(initialForm);
  const [pmInfo, setPmInfo] = useState<PMInfo>(initialPmInfo);
  const [complete, setComplete] = useState<Record<string, boolean>>({});

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(isOpen);
    setForm(initialForm);
    setPmInfo(initialPmInfo);
    setComplete({});
  }
  if (!isOpen && prevIsOpen) {
    setPrevIsOpen(isOpen);
  }

  const updateForm = (field: keyof AddCompanyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setComplete((prev) => ({
      ...prev,
      [field]: value.trim() !== '',
    }));
  };

  const updatePmInfo = (field: keyof PMInfo, value: string) => {
    setPmInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setForm(initialForm);
    setPmInfo(initialPmInfo);
    setComplete({});
    onClose();
  };

  const handleSubmit = () => {
    const required: (keyof AddCompanyForm)[] = [
      'companyName',
      'businessNumber',
      'contractStartDate',
      'contactName',
      'contactPhone',
      'companyCode',
    ];
    const allFilled = required.every((f) => form[f].trim());
    const pmValid = pmInfo.name.trim() && pmInfo.phone.trim() && pmInfo.email.trim();

    if (!allFilled || !pmValid) return;

    const data: CompanyCreateInput = {
      code: form.companyCode,
      name: form.companyName,
      businessNumber: form.businessNumber || undefined,
      address: form.address || undefined,
      contractStartDate: form.contractStartDate || undefined,
      hrContactName: form.contactName || undefined,
      hrContactPhone: form.contactPhone || undefined,
      hrContactEmail: form.contactEmail || undefined,
      pmContactName: pmInfo.name || undefined,
      pmContactPhone: pmInfo.phone || undefined,
      pmContactEmail: pmInfo.email || undefined,
    };

    onSubmit(data);
  };

  const isSubmitDisabled = isSubmitting || !(
    ['companyName', 'businessNumber', 'contractStartDate', 'contactName', 'contactPhone', 'companyCode'].every(
      (f) => form[f as keyof AddCompanyForm].trim()
    ) &&
    pmInfo.name.trim() &&
    pmInfo.phone.trim() &&
    pmInfo.email.trim()
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        {/* 모달 헤더 */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">회원사 추가</h2>
            <p className="text-xs text-gray-500 mt-0.5">새로운 회원사 정보를 입력해주세요</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 섹션 1: 회사 기본 정보 */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-duru-orange-500" />
              회사 기본 정보
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  회사명 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="예: (주)이루빛 제조"
                    value={form.companyName}
                    onChange={(e) => updateForm('companyName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {complete.companyName && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  사업자등록번호 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="000-00-00000"
                    value={form.businessNumber}
                    onChange={(e) => updateForm('businessNumber', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {complete.businessNumber && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">주소</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="사업장 주소 입력"
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {complete.address && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  계약 시작일 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <DatePicker
                    value={form.contractStartDate}
                    onChange={(v) => updateForm('contractStartDate', v)}
                  />
                  {complete.contractStartDate && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 섹션 2: 인사 담당자 정보 */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-duru-orange-500" />
              인사 담당자 정보
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  담당자명 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="담당자 이름"
                    value={form.contactName}
                    onChange={(e) => updateForm('contactName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {complete.contactName && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  연락처 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={form.contactPhone}
                    onChange={(e) => updateForm('contactPhone', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {complete.contactPhone && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="email@company.com"
                    value={form.contactEmail}
                    onChange={(e) => updateForm('contactEmail', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {complete.contactEmail && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 섹션 3: 영업 담당자 (PM) 정보 */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-duru-orange-500" />
              영업 담당자 (PM) 정보
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  담당자 이름 <span className="text-duru-orange-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={pmInfo.name}
                  onChange={(e) => updatePmInfo('name', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  담당자 연락처 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={pmInfo.phone}
                    onChange={(e) => updatePmInfo('phone', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  담당자 이메일 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="pm@duruviter.com"
                    value={pmInfo.email}
                    onChange={(e) => updatePmInfo('email', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 섹션 4: 기업 관리자 계정 설정 */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-duru-orange-500" />
              기업 관리자 계정 설정
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  기업 고유번호 <span className="text-duru-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="예: C001"
                    value={form.companyCode}
                    onChange={(e) => updateForm('companyCode', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {complete.companyCode && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 border border-gray-200">
                <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                초기 비밀번호는 자동 생성되어 담당자 이메일로 발송됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-[2] py-3 bg-duru-orange-500 text-white rounded-xl font-semibold hover:bg-duru-orange-600 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? '추가 중...' : '회원사 추가 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
