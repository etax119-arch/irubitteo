'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, Loader2, Mail, User } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAdminAccounts } from '../_hooks/useAdminAccountQuery';
import { authApi } from '@/lib/api/auth';
import { createAdminAccount } from '@/lib/api/admin';
import { extractErrorMessage } from '@/lib/api/error';
import { useAuthStore } from '@/lib/auth/store';
import { formatKSTDateTime } from '@/lib/kst';
import { adminKeys } from '@/lib/query/keys';

export default function AdminSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const clearUser = useAuthStore((s) => s.clearUser);
  const {
    data: adminAccounts,
    isLoading: isAdminAccountsLoading,
    isError: isAdminAccountsError,
    refetch: refetchAdminAccounts,
  } = useAdminAccounts();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      clearUser();
      toast.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      router.replace('/login/admin');
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: createAdminAccount,
    onSuccess: () => {
      toast.success('관리자 계정이 생성되었습니다.');
      setAdminEmail('');
      setAdminName('');
      setAdminPassword('');
      setConfirmAdminPassword('');
      void queryClient.invalidateQueries({ queryKey: adminKeys.accounts() });
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('모든 항목을 입력해주세요.');
      return false;
    }

    if (newPassword.length < 8) {
      toast.error('새 비밀번호는 8자 이상이어야 합니다.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호 확인이 일치하지 않습니다.');
      return false;
    }

    if (newPassword === currentPassword) {
      toast.error('현재 비밀번호와 다른 비밀번호를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (changePasswordMutation.isPending) return;
    if (!validateForm()) return;

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  const validateAdminCreateForm = () => {
    const normalizedEmail = adminEmail.trim();
    const normalizedName = adminName.trim();

    if (!normalizedEmail || !normalizedName || !adminPassword || !confirmAdminPassword) {
      toast.error('모든 항목을 입력해주세요.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      toast.error('유효한 이메일 형식을 입력해주세요.');
      return false;
    }

    if (adminPassword.length < 8) {
      toast.error('초기 비밀번호는 8자 이상이어야 합니다.');
      return false;
    }

    if (adminPassword !== confirmAdminPassword) {
      toast.error('초기 비밀번호 확인이 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleCreateAdmin = () => {
    if (createAdminMutation.isPending) return;
    if (!validateAdminCreateForm()) return;

    createAdminMutation.mutate({
      email: adminEmail.trim(),
      name: adminName.trim(),
      password: adminPassword,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">관리자 계정 설정</h2>
          <p className="text-sm text-gray-600 mt-1">
            비밀번호를 변경하면 현재 세션이 종료되고 다시 로그인해야 합니다.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="password"
            label="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="현재 비밀번호를 입력하세요"
          />

          <Input
            type="password"
            label="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="8자 이상 입력하세요"
          />

          <Input
            type="password"
            label="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="새 비밀번호를 다시 입력하세요"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={changePasswordMutation.isPending}
              leftIcon={
                changePasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : undefined
              }
            >
              {changePasswordMutation.isPending ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">관리자 계정 추가</h2>
          <p className="text-sm text-gray-600 mt-1">
            새로운 관리자 로그인 계정을 생성합니다.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="email"
            label="이메일"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="admin@example.com"
          />

          <Input
            type="text"
            label="이름"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            autoComplete="name"
            leftIcon={<User className="w-4 h-4" />}
            placeholder="관리자 이름을 입력하세요"
          />

          <Input
            type="password"
            label="초기 비밀번호"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="8자 이상 입력하세요"
          />

          <Input
            type="password"
            label="초기 비밀번호 확인"
            value={confirmAdminPassword}
            onChange={(e) => setConfirmAdminPassword(e.target.value)}
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="초기 비밀번호를 다시 입력하세요"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateAdmin();
              }
            }}
          />

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleCreateAdmin}
              disabled={createAdminMutation.isPending}
              leftIcon={
                createAdminMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : undefined
              }
            >
              {createAdminMutation.isPending ? '생성 중...' : '관리자 계정 생성'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">관리자 계정 리스트</h2>
          <p className="text-sm text-gray-600 mt-1">
            현재 등록된 관리자 계정 목록입니다.
          </p>
        </CardHeader>

        <CardContent>
          {isAdminAccountsLoading && (
            <p className="text-sm text-gray-600">불러오는 중...</p>
          )}

          {isAdminAccountsError && (
            <div className="space-y-3">
              <p className="text-sm text-red-600">
                관리자 계정 목록을 불러오지 못했습니다.
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetchAdminAccounts()}>
                다시 시도
              </Button>
            </div>
          )}

          {!isAdminAccountsLoading && !isAdminAccountsError && (
            <>
              {adminAccounts && adminAccounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">이름</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">이메일</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">생성일시</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminAccounts.map((account) => (
                        <tr key={account.id} className="border-b border-gray-100 last:border-0">
                          <td className="px-3 py-3 text-gray-900">{account.name}</td>
                          <td className="px-3 py-3 text-gray-700">{account.email}</td>
                          <td className="px-3 py-3 text-gray-700">{formatKSTDateTime(account.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-600">등록된 관리자 계정이 없습니다.</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
