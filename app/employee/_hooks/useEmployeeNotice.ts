'use client';

import { useState, useCallback } from 'react';
import { employeeNoticeApi } from '@/lib/api/employeeNotices';
import { useToast } from '@/components/ui/Toast';
import type { EmployeeNotice } from '@/types/notice';

export function useEmployeeNotice() {
  const [todayNotices, setTodayNotices] = useState<EmployeeNotice[]>([]);
  const [pastNotices, setPastNotices] = useState<EmployeeNotice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await employeeNoticeApi.getMyNotices();
      setTodayNotices(result.today);
      setPastNotices(result.past);
    } catch {
      toast.error('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const markAsRead = useCallback(async (noticeId: string) => {
    try {
      await employeeNoticeApi.markAsRead(noticeId);
      const now = new Date().toISOString();
      setTodayNotices((prev) =>
        prev.map((n) => (n.id === noticeId ? { ...n, readAt: now } : n))
      );
      setPastNotices((prev) =>
        prev.map((n) => (n.id === noticeId ? { ...n, readAt: now } : n))
      );
    } catch {
      toast.error('읽음 처리에 실패했습니다.');
    }
  }, [toast]);

  return {
    todayNotices,
    pastNotices,
    isLoading,
    fetchNotices,
    markAsRead,
  };
}
