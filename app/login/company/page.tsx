'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { AxiosError } from 'axios';

export default function CompanyLoginPage() {
  const [companyId, setCompanyId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const isValidId = companyId.length >= 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 영숫자만 허용 (포맷 제한 없음)
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setCompanyId(value);
    setLoginError('');
  };

  const handleLogin = async () => {
    if (!isValidId || isSubmitting) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      await login('company', companyId);
    } catch (error) {
      if (error instanceof AxiosError) {
        // 보안: 서버 메시지 무시, 일관된 메시지 사용 (코드 존재 여부 식별 방지)
        setLoginError('유효하지 않은 고유 번호입니다.');
      } else {
        setLoginError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValidId) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-duru-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-duru-orange-100">
          <div className="text-center mb-8">
            <Image
              src="/images/landing_logo_tran_1.png"
              alt="이루빛터"
              width={1563}
              height={1563}
              className="h-[250px] w-auto mx-auto -my-[40px]"
            />
            <p className="text-gray-600">부여받은 고유 번호를 입력해주세요</p>
          </div>

          <div className="space-y-5">
            <div>
              <Input
                type="text"
                label="고유 번호"
                placeholder="예) COMPANY123"
                value={companyId}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                size="lg"
                className={`text-2xl text-center tracking-[0.3em] font-semibold placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-500 placeholder:text-center ${
                  loginError ? 'border-red-500' : ''
                }`}
              />
              {loginError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={!isValidId || isSubmitting}
              className="w-full py-5 bg-duru-orange-500 text-white rounded-lg font-bold text-xl hover:bg-duru-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>

            <p className="text-center text-sm text-gray-400">
              고유 번호를 모르시나요?{' '}
              <span className="text-gray-500 underline underline-offset-2">
                관리자에게 문의해주세요
              </span>
            </p>

            <Link
              href="/"
              className="block w-full py-3 text-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
