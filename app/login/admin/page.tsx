'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, LogIn, AlertTriangle, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  // 이메일 형식 검증
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 1;
  const isValid = isValidEmail && isValidPassword;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLoginError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLoginError('');
  };

  const handleLogin = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      await login('admin', email, password);
    } catch (error) {
      if (error instanceof AxiosError) {
        // 보안: 서버 메시지 무시, 일관된 메시지 사용 (사용자 존재 여부 식별 방지)
        setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setLoginError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-duru-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-duru-orange-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-duru-orange-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-duru-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">두루빛 관리자</h1>
            <p className="text-gray-600">관리자 계정으로 로그인하세요</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400 ${
                    loginError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full pl-12 pr-4 py-4 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400 ${
                    loginError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{loginError}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!isValid || isSubmitting}
              className="w-full py-5 bg-duru-orange-500 text-white rounded-lg font-bold text-xl hover:bg-duru-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>

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
