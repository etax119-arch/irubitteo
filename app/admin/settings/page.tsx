'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Lock, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { authApi } from '@/lib/api/auth';
import { extractErrorMessage } from '@/lib/api/error';
import { useAuthStore } from '@/lib/auth/store';

export default function AdminSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const clearUser = useAuthStore((s) => s.clearUser);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  return (
    <div className="max-w-2xl mx-auto">
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
    </div>
  );
}
