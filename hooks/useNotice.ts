'use client';

import { useState, useCallback } from 'react';
import { noticeApi } from '@/lib/api/notices';
import type { NoticeResponse, NoticeCreateInput } from '@/types/notice';
import type { Pagination } from '@/types/api';
import { AxiosError } from 'axios';

interface UseNoticeState {
  notices: NoticeResponse[];
  pagination: Pagination | null;
  isLoading: boolean;
  isSending: boolean;
  isDeleting: boolean;
  error: string | null;
}

interface UseNoticeReturn extends UseNoticeState {
  fetchNotices: (page?: number, limit?: number) => Promise<void>;
  sendNotice: (input: NoticeCreateInput) => Promise<NoticeResponse | null>;
  deleteNotice: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useNotice(): UseNoticeReturn {
  const [state, setState] = useState<UseNoticeState>({
    notices: [],
    pagination: null,
    isLoading: false,
    isSending: false,
    isDeleting: false,
    error: null,
  });

  const handleError = useCallback((err: unknown): string => {
    let message = '알 수 없는 오류가 발생했습니다.';
    if (err instanceof AxiosError) {
      const responseMessage = err.response?.data?.message;
      if (typeof responseMessage === 'string') {
        message = responseMessage;
      } else if (err.message) {
        message = err.message;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }
    setState((prev) => ({ ...prev, error: message }));
    return message;
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const fetchNotices = useCallback(async (page?: number, limit?: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await noticeApi.getList(page, limit);
      setState((prev) => ({ ...prev, notices: result.data, pagination: result.pagination }));
    } catch (err) {
      handleError(err);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [handleError]);

  const sendNotice = useCallback(async (input: NoticeCreateInput): Promise<NoticeResponse | null> => {
    setState((prev) => ({ ...prev, isSending: true, error: null }));
    try {
      const notice = await noticeApi.create(input);
      setState((prev) => ({ ...prev, notices: [notice, ...prev.notices] }));
      return notice;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setState((prev) => ({ ...prev, isSending: false }));
    }
  }, [handleError]);

  const deleteNotice = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isDeleting: true, error: null }));
    try {
      await noticeApi.delete(id);
      setState((prev) => ({
        ...prev,
        notices: prev.notices.filter((n) => n.id !== id),
      }));
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setState((prev) => ({ ...prev, isDeleting: false }));
    }
  }, [handleError]);

  return { ...state, fetchNotices, sendNotice, deleteNotice, clearError };
}
