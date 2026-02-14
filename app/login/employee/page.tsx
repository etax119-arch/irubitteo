'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Hash, LogIn, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { AxiosError } from 'axios';

export default function EmployeeLoginPage() {
  const [firstPart, setFirstPart] = useState('');
  const [secondPart, setSecondPart] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  const isValidId = firstPart.length === 4 && secondPart.length === 4;

  const handleFirstPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setFirstPart(value);
    setLoginError('');

    // 4자리 입력 완료 시 자동으로 다음 입력으로 이동
    if (value.length === 4) {
      secondInputRef.current?.focus();
    }
  };

  const handleSecondPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setSecondPart(value);
    setLoginError('');
  };

  const handleSecondPartKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 백스페이스로 빈 상태에서 누르면 앞 입력으로 이동
    if (e.key === 'Backspace' && secondPart === '') {
      firstInputRef.current?.focus();
    }
    if (e.key === 'Enter' && isValidId) {
      handleLogin();
    }
  };

  const handleFirstPartKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValidId) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!isValidId || isSubmitting) return;

    const employeeId = firstPart + secondPart;
    setIsSubmitting(true);
    setLoginError('');

    try {
      await login('employee', employeeId);
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

  return (
    <div className="min-h-screen bg-duru-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-duru-orange-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-duru-orange-100 rounded-full mb-4">
              <Hash className="w-8 h-8 text-duru-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">이루빛 출퇴근</h1>
            <p className="text-gray-600">부여받은 고유 번호를 입력해주세요</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                고유 번호
              </label>
              <div
                className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg focus-within:ring-2 focus-within:ring-duru-orange-500 focus-within:border-transparent ${
                  loginError ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <div className="w-[80px]">
                  <Input
                    ref={firstInputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="1234"
                    value={firstPart}
                    onChange={handleFirstPartChange}
                    onKeyDown={handleFirstPartKeyDown}
                    maxLength={4}
                    autoFocus
                    className="w-[80px] py-2 text-2xl text-center tracking-[0.2em] font-semibold border-0 bg-transparent hover:border-0 focus:ring-0"
                  />
                </div>
                <span className="text-2xl font-bold text-gray-400">-</span>
                <div className="w-[80px]">
                  <Input
                    ref={secondInputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="5678"
                    value={secondPart}
                    onChange={handleSecondPartChange}
                    onKeyDown={handleSecondPartKeyDown}
                    maxLength={4}
                    className="w-[80px] py-2 text-2xl text-center tracking-[0.2em] font-semibold border-0 bg-transparent hover:border-0 focus:ring-0"
                  />
                </div>
              </div>
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
              {isSubmitting ? '로그인 중...' : '출퇴근 시작'}
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
