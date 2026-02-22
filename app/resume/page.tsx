'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Home, CheckCircle2, Loader2 } from 'lucide-react';
import { DISABILITY_TYPES } from '@/types/employee';
import { createResume } from '@/lib/api/resumes';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import { Checkbox } from '@/components/ui/Checkbox';
import { DatePicker } from '@/components/ui/DatePicker';
import { generateResumePdf } from './_utils/generateResumePdf';

interface FormData {
  name: string;
  birthDate: string;
  zipCode: string;
  address: string;
  phone: string;
  mobile: string;
  guardianPhone: string;
  smsConsent: boolean;
  email: string;
  emailConsent: boolean;
  schoolName: string;
  major: string;
  enrollmentPeriod: string;
  educationStatus: string;
  privacyConsent: boolean;
  careers: Array<{ companyName: string; period: string; duties: string }>;
  disabilityTypes: string[];
  disabilityDetail: string;
  disabilitySeverity: string;
  workType: string;
}

interface FormErrors {
  name?: string;
  birthDate?: string;
  phone?: string;
  privacyConsent?: string;
}

interface TouchedFields {
  name?: boolean;
  birthDate?: boolean;
  phone?: boolean;
  privacyConsent?: boolean;
}

const requiredFieldLabels: Record<string, string> = {
  name: '성명',
  birthDate: '생년월일',
  phone: '전화번호',
  privacyConsent: '개인정보 조회 동의',
};

export default function ResumePage() {
  const router = useRouter();
  const toast = useToast();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    zipCode: '',
    address: '',
    phone: '',
    mobile: '',
    guardianPhone: '',
    smsConsent: true,
    email: '',
    emailConsent: true,
    schoolName: '',
    major: '',
    enrollmentPeriod: '',
    educationStatus: '',
    privacyConsent: false,
    careers: [{ companyName: '', period: '', duties: '' }],
    disabilityTypes: [],
    disabilityDetail: '',
    disabilitySeverity: '',
    workType: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const validateField = (name: keyof FormErrors): string => {
    let error = '';
    if (name === 'privacyConsent') {
      if (!formData.privacyConsent) {
        error = '개인정보 조회에 동의해주세요.';
      }
    } else {
      const value = formData[name];
      if (!value.trim()) {
        error = `${requiredFieldLabels[name]}을(를) 입력해주세요.`;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleDisabilityTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      disabilityTypes: prev.disabilityTypes.includes(type)
        ? prev.disabilityTypes.filter((t) => t !== type)
        : [...prev.disabilityTypes, type],
    }));
  };

  const isSubmitEnabled =
    formData.name.trim() &&
    formData.birthDate.trim() &&
    formData.phone.trim() &&
    formData.privacyConsent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields: (keyof FormErrors)[] = [
      'name',
      'birthDate',
      'phone',
      'privacyConsent',
    ];
    const newTouched: TouchedFields = {};
    let hasError = false;

    requiredFields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field);
      if (error) hasError = true;
    });
    setTouched(newTouched);

    if (hasError) return;

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('birthDate', formData.birthDate);
      fd.append('phone', formData.phone);
      fd.append('privacyConsent', String(formData.privacyConsent));
      fd.append('smsConsent', String(formData.smsConsent));
      fd.append('emailConsent', String(formData.emailConsent));
      if (formData.zipCode) fd.append('zipCode', formData.zipCode);
      if (formData.address) fd.append('address', formData.address);
      if (formData.mobile) fd.append('mobile', formData.mobile);
      if (formData.guardianPhone) fd.append('guardianPhone', formData.guardianPhone);
      if (formData.email) fd.append('email', formData.email);
      if (formData.schoolName) fd.append('schoolName', formData.schoolName);
      if (formData.major) fd.append('major', formData.major);
      if (formData.enrollmentPeriod) fd.append('enrollmentPeriod', formData.enrollmentPeriod);
      if (formData.educationStatus) fd.append('educationStatus', formData.educationStatus);
      const filledCareers = formData.careers.filter(
        (c) => c.companyName || c.period || c.duties
      );
      if (filledCareers.length > 0) {
        fd.append('careers', JSON.stringify(filledCareers));
      }
      if (formData.disabilityTypes.length > 0) {
        fd.append('disabilityTypes', JSON.stringify(formData.disabilityTypes));
      }
      if (formData.disabilityDetail) fd.append('disabilityDetail', formData.disabilityDetail);
      if (formData.disabilitySeverity) fd.append('disabilitySeverity', formData.disabilitySeverity);
      if (formData.workType) fd.append('workType', formData.workType);

      const pdfBlob = await generateResumePdf(formData);
      fd.append('pdf', pdfBlob, `${formData.name}_이력서.pdf`);

      await createResume(fd);
      setShowCompleteModal(true);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Shared input styles
  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-duru-orange-400';
  const thClass =
    'bg-orange-50 text-duru-orange-700 font-semibold text-sm px-4 py-3 border border-gray-200 text-left whitespace-nowrap';
  const tdClass = 'px-4 py-3 border border-gray-200';

  return (
    <div className="min-h-screen bg-duru-ivory">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo_tran.png"
              alt="이루빛터"
              width={1563}
              height={1563}
              className="h-[220px] w-auto -my-[40px] -ml-[30px]"
            />
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

      <div className="max-w-[210mm] mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 sm:p-10">
          <form onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-[12px] border-b-4 border-duru-orange-500 pb-4 inline-block">
                이 력 서
              </h1>
            </div>

            {/* Section: 개인정보 */}
            <div className="mb-6">
              <div className="bg-duru-orange-500 text-white text-sm font-bold px-4 py-2 rounded-t-lg">
                개인정보
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th className={thClass} style={{ width: '15%' }}>
                      성명 <span className="text-red-500">*</span>
                    </th>
                    <td className={tdClass} style={{ width: '35%' }}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="홍길동"
                        className={inputClass}
                      />
                      {touched.name && errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </td>
                    <th className={thClass} style={{ width: '15%' }}>
                      생년월일 <span className="text-red-500">*</span>
                    </th>
                    <td className={tdClass} style={{ width: '35%' }}>
                      <DatePicker
                        value={formData.birthDate}
                        onChange={(val) => {
                          setFormData((prev) => ({ ...prev, birthDate: val }));
                          if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: '' }));
                        }}
                        placeholder="생년월일 선택"
                        error={touched.birthDate && errors.birthDate ? errors.birthDate : undefined}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className={thClass}>우편번호</th>
                    <td className={tdClass}>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="12345"
                        className={inputClass}
                      />
                    </td>
                    <th className={thClass}>주소</th>
                    <td className={tdClass}>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="서울시 강남구 ..."
                        className={inputClass}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className={thClass}>
                      전화번호 <span className="text-red-500">*</span>
                    </th>
                    <td className={tdClass}>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        placeholder="010-1234-5678"
                        className={inputClass}
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </td>
                    <th className={thClass}>휴대전화</th>
                    <td className={tdClass}>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="010-0000-0000"
                        className={inputClass}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className={thClass}>보호자전화</th>
                    <td className={tdClass}>
                      <input
                        type="tel"
                        name="guardianPhone"
                        value={formData.guardianPhone}
                        onChange={handleChange}
                        placeholder="010-0000-0000"
                        className={inputClass}
                      />
                    </td>
                    <th className={thClass}>문자서비스</th>
                    <td className={tdClass}>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="smsConsent"
                            checked={formData.smsConsent === true}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, smsConsent: true }))
                            }
                            className="accent-duru-orange-500"
                          />
                          동의
                        </label>
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="smsConsent"
                            checked={formData.smsConsent === false}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, smsConsent: false }))
                            }
                            className="accent-duru-orange-500"
                          />
                          비동의
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className={thClass}>전자우편</th>
                    <td className={tdClass}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className={inputClass}
                      />
                    </td>
                    <th className={thClass}>수신동의</th>
                    <td className={tdClass}>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="emailConsent"
                            checked={formData.emailConsent === true}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, emailConsent: true }))
                            }
                            className="accent-duru-orange-500"
                          />
                          동의
                        </label>
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="emailConsent"
                            checked={formData.emailConsent === false}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, emailConsent: false }))
                            }
                            className="accent-duru-orange-500"
                          />
                          비동의
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section: 최종 학력사항 */}
            <div className="mb-6">
              <div className="bg-duru-orange-500 text-white text-sm font-bold px-4 py-2 rounded-t-lg">
                최종 학력사항
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th className={thClass} style={{ width: '15%' }}>
                      학교명
                    </th>
                    <td className={tdClass} style={{ width: '35%' }}>
                      <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        placeholder="OO학교"
                        className={inputClass}
                      />
                    </td>
                    <th className={thClass} style={{ width: '15%' }}>
                      전공
                    </th>
                    <td className={tdClass} style={{ width: '35%' }}>
                      <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        placeholder="전공명"
                        className={inputClass}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className={thClass}>재학기간</th>
                    <td className={tdClass}>
                      <input
                        type="text"
                        name="enrollmentPeriod"
                        value={formData.enrollmentPeriod}
                        onChange={handleChange}
                        placeholder="2020.03 ~ 2024.02"
                        className={inputClass}
                      />
                    </td>
                    <th className={thClass}>상태</th>
                    <td className={tdClass}>
                      <select
                        name="educationStatus"
                        value={formData.educationStatus}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">선택</option>
                        <option value="졸업">졸업</option>
                        <option value="재학">재학</option>
                        <option value="수료">수료</option>
                        <option value="휴학">휴학</option>
                        <option value="중퇴">중퇴</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section: 경력사항 */}
            <div className="mb-6">
              <div className="bg-duru-orange-500 text-white text-sm font-bold px-4 py-2 rounded-t-lg">
                경력사항
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={thClass} style={{ width: '30%' }}>회사명</th>
                    <th className={thClass} style={{ width: '25%' }}>재직기간</th>
                    <th className={thClass} style={{ width: '35%' }}>담당업무</th>
                    <th className={thClass} style={{ width: '10%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.careers.map((career, idx) => (
                    <tr key={idx}>
                      <td className={tdClass}>
                        <input
                          type="text"
                          value={career.companyName}
                          onChange={(e) => {
                            const updated = [...formData.careers];
                            updated[idx] = { ...updated[idx], companyName: e.target.value };
                            setFormData((prev) => ({ ...prev, careers: updated }));
                          }}
                          placeholder="OO회사"
                          className={inputClass}
                        />
                      </td>
                      <td className={tdClass}>
                        <input
                          type="text"
                          value={career.period}
                          onChange={(e) => {
                            const updated = [...formData.careers];
                            updated[idx] = { ...updated[idx], period: e.target.value };
                            setFormData((prev) => ({ ...prev, careers: updated }));
                          }}
                          placeholder="2020.03~2023.02"
                          className={inputClass}
                        />
                      </td>
                      <td className={tdClass}>
                        <input
                          type="text"
                          value={career.duties}
                          onChange={(e) => {
                            const updated = [...formData.careers];
                            updated[idx] = { ...updated[idx], duties: e.target.value };
                            setFormData((prev) => ({ ...prev, careers: updated }));
                          }}
                          placeholder="담당업무"
                          className={inputClass}
                        />
                      </td>
                      <td className={`${tdClass} text-center`}>
                        {formData.careers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                careers: prev.careers.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="text-red-400 hover:text-red-600 text-sm"
                          >
                            삭제
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    careers: [...prev.careers, { companyName: '', period: '', duties: '' }],
                  }))
                }
                className="mt-2 text-sm text-duru-orange-500 hover:text-duru-orange-600 font-medium"
              >
                + 경력 추가
              </button>
            </div>

            {/* Section: 추가정보 - 장애사항 */}
            <div className="mb-8">
              <div className="bg-duru-orange-500 text-white text-sm font-bold px-4 py-2 rounded-t-lg">
                추가정보 - 장애사항
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th
                      className={thClass}
                      style={{ width: '15%', verticalAlign: 'top', paddingTop: '16px' }}
                    >
                      장애유형
                    </th>
                    <td className={tdClass} colSpan={3}>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {DISABILITY_TYPES.map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-1.5 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.disabilityTypes.includes(type)}
                              onChange={() => handleDisabilityTypeToggle(type)}
                              className="w-4 h-4 rounded border-gray-300 text-duru-orange-600 accent-duru-orange-500 cursor-pointer shrink-0"
                            />
                            <span className="text-gray-700 text-xs sm:text-sm">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className={thClass}>구체적 장애내용</th>
                    <td className={tdClass} colSpan={3}>
                      <textarea
                        name="disabilityDetail"
                        value={formData.disabilityDetail}
                        onChange={handleChange}
                        rows={3}
                        placeholder="장애 내용을 구체적으로 기재해주세요."
                        className={`${inputClass} resize-none`}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className={thClass}>장애정도</th>
                    <td className={tdClass}>
                      <select
                        name="disabilitySeverity"
                        value={formData.disabilitySeverity}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">선택</option>
                        <option value="중증">중증</option>
                        <option value="경증">경증</option>
                      </select>
                    </td>
                    <th className={thClass}>근무형태</th>
                    <td className={tdClass}>
                      <select
                        name="workType"
                        value={formData.workType}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">선택</option>
                        <option value="전일제">전일제</option>
                        <option value="시간제">시간제</option>
                        <option value="재택근무">재택근무</option>
                        <option value="기타">기타</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Privacy consent checkbox */}
            <div className="mb-6">
              <Checkbox
                label="개인정보 수집·이용에 동의합니다. (필수)"
                checked={formData.privacyConsent}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({ ...prev, privacyConsent: checked }));
                  if (checked) setErrors((prev) => ({ ...prev, privacyConsent: '' }));
                }}
              />
              {touched.privacyConsent && errors.privacyConsent && (
                <p className="text-xs text-red-500 mt-1">{errors.privacyConsent}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isSubmitEnabled || submitting}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isSubmitEnabled && !submitting
                  ? 'bg-duru-orange-500 text-white hover:bg-duru-orange-600 active:scale-[0.99]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitting ? '제출 중...' : '이력서 제출하기'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              입력하신 정보는 취업 알선 및 직업 재활 서비스 목적으로만 사용됩니다.
            </p>
          </form>
        </div>
      </div>

      {/* Success Modal */}
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
              이력서가
              <br />
              성공적으로 제출되었습니다!
            </h2>

            <p className="text-base text-gray-500 mb-8 leading-relaxed">
              이루빛터에서 확인 후
              <br />
              연락드리겠습니다.
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
