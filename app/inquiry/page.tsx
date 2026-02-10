'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  Phone,
  Mail,
  CheckCircle2,
  User,
  Building2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface FormData {
  companyName: string;
  ceoName: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  companyName?: string;
  ceoName?: string;
  phone?: string;
  email?: string;
  message?: string;
}

interface TouchedFields {
  companyName?: boolean;
  ceoName?: boolean;
  phone?: boolean;
  email?: boolean;
  message?: boolean;
}

const fieldLabels: Record<keyof FormData, string> = {
  companyName: '기업명',
  ceoName: '대표자명',
  phone: '전화번호',
  email: '이메일',
  message: '문의 내용',
};

export default function InquiryPage() {
  const router = useRouter();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    ceoName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name: keyof FormData, value: string): string => {
    let error = '';
    if (!value.trim()) {
      error = `${fieldLabels[name]}을(를) 입력해주세요.`;
    } else if (name === 'phone') {
      const phoneRegex = /^(0[2-9]\d?)-?(\d{3,4})-?(\d{4})$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        error = '올바른 전화번호 형식을 입력해주세요.';
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = '올바른 이메일 형식을 입력해주세요.';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const isAllFilled =
    formData.companyName.trim() &&
    formData.ceoName.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    formData.message.trim();

  const isSubmitEnabled = isAllFilled && agreePrivacy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: (keyof FormData)[] = [
      'companyName',
      'ceoName',
      'phone',
      'email',
      'message',
    ];
    const newTouched: TouchedFields = {};
    let hasError = false;

    fields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) hasError = true;
    });
    setTouched(newTouched);

    if (!hasError && agreePrivacy) {
      setShowCompleteModal(true);
    }
  };

  const getInputClass = (name: keyof FormData) => {
    const base =
      'w-full px-4 py-3.5 border rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-transparent placeholder:text-gray-400';
    if (touched[name] && errors[name]) {
      return `${base} border-red-400 bg-red-50/50`;
    }
    return `${base} border-gray-200 bg-white hover:border-gray-300`;
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-duru-ivory">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-duru-orange-600">
            두루빛터
          </Link>
          <Link
            href="/"
            className="p-2.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="메인으로 이동"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-12 pb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-[2px] bg-duru-orange-400"></span>
            <span className="text-duru-orange-500 font-bold tracking-widest text-xs uppercase">
              신규 기업 문의
            </span>
            <span className="w-10 h-[2px] bg-duru-orange-400"></span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug mb-5 break-keep">
            <span className="text-duru-orange-500">장애인 고용</span>을<br />
            <span className="text-duru-orange-500">따뜻한 동행</span>으로
            시작하세요
          </h1>

          <p className="text-base sm:text-lg text-gray-500 leading-relaxed break-keep max-w-lg mx-auto">
            간단한 정보만 남겨주시면
            <br />
            두루빛터 담당 전문가가 직접 연락드려
            <br />
            기업에 맞는 고용 방향을 함께 고민해드립니다.
          </p>
        </section>

        {/* Form Section */}
        <section className="pb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* 기업명 */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  기업명 <span className="text-duru-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('companyName')}
                  placeholder="(주)회사명"
                  className={getInputClass('companyName')}
                />
                {touched.companyName && errors.companyName && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* 대표자명 */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  대표자명 <span className="text-duru-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="ceoName"
                  value={formData.ceoName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('ceoName')}
                  placeholder="홍길동"
                  className={getInputClass('ceoName')}
                />
                {touched.ceoName && errors.ceoName && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.ceoName}</p>
                )}
              </div>

              {/* 전화번호 · 이메일 (2열) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    전화번호 <span className="text-duru-orange-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    placeholder="02-1234-5678"
                    className={getInputClass('phone')}
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    이메일 <span className="text-duru-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="example@company.com"
                    className={getInputClass('email')}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  문의 내용 <span className="text-duru-orange-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                  rows={5}
                  placeholder={`장애인 고용 의무 비율 상담,\n제조·사무·물류 등 직무 배치 가능 여부,\n현재 고민 중인 내용을 자유롭게 작성해주세요.\n\n두루빛터 담당자가 내용을 확인 후 직접 연락드립니다.`}
                  className={`${getInputClass('message')} resize-none`}
                />
                {touched.message && errors.message && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* 신뢰 강화 안내 */}
              <div className="flex items-start gap-3 bg-duru-orange-50 rounded-xl px-5 py-4">
                <ShieldCheck className="w-5 h-5 text-duru-orange-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  문의 내용을 확인한 후,{' '}
                  <span className="font-semibold text-gray-800">
                    두루빛터 담당 전문가가 직접 연락
                  </span>
                  드립니다.
                  <br />
                  자동 응답이 아닌, 기업 상황에 맞는 1:1 상담을 제공합니다.
                </p>
              </div>

              {/* 개인정보 동의 체크박스 */}
              <div className="flex justify-center">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="w-[18px] h-[18px] rounded border-gray-300 text-duru-orange-500 focus:ring-duru-orange-400 accent-duru-orange-500 cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    상담을 위한{' '}
                    <span className="font-semibold text-gray-700 underline underline-offset-2 decoration-gray-300">
                      개인정보 수집 및 이용
                    </span>
                    에 동의합니다.
                  </span>
                </label>
              </div>

              {/* CTA 버튼 */}
              <button
                type="submit"
                disabled={!isSubmitEnabled}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isSubmitEnabled
                    ? 'bg-duru-orange-500 text-white hover:bg-duru-orange-600 active:scale-[0.99]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                두루빛터 상담 신청하기
              </button>

              {/* 개인정보 안내 */}
              <p className="text-center text-xs text-gray-400 leading-relaxed">
                입력하신 정보는 상담 목적 외에는 사용되지 않으며,
                <br />
                두루빛터 담당자가 직접 상담을 위해 연락드립니다.
              </p>
            </form>
          </div>
        </section>

        {/* 하단 여백 */}
        <div className="pb-16"></div>
      </div>

      {/* 상담 신청 완료 모달 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <div
            className="bg-white rounded-2xl w-full max-w-md p-10 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
              <CheckCircle2 className="w-9 h-9 text-green-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
              상담 신청이
              <br />
              성공적으로 완료되었습니다!
            </h2>

            <p className="text-base text-gray-500 mb-8 leading-relaxed">
              곧 두루빛터 담당자가
              <br />
              직접 연락드리겠습니다.
            </p>

            <button
              onClick={handleGoHome}
              className="w-full py-3.5 bg-duru-orange-500 text-white rounded-xl font-bold text-base hover:bg-duru-orange-600 transition-colors"
            >
              메인으로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
