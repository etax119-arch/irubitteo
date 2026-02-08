'use client';

import { useState, useCallback } from 'react';
import { employeeNoticeApi } from '@/lib/api/employeeNotices';
import type { EmployeeNotice } from '@/types/notice';

export function useEmployeeNotice() {
  const [todayNotices, setTodayNotices] = useState<EmployeeNotice[]>([]);
  const [pastNotices, setPastNotices] = useState<EmployeeNotice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await employeeNoticeApi.getMyNotices();
      setTodayNotices(result.today);
      setPastNotices(result.past);
    } catch {
      // silently fail - notices are non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      // silently fail
    }
  }, []);

  return {
    todayNotices,
    pastNotices,
    isLoading,
    fetchNotices,
    markAsRead,
  };
}
