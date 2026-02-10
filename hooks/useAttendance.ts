'use client';

import { useState, useCallback } from 'react';
import { attendanceApi } from '@/lib/api/attendance';
import type {
  Attendance,
  AttendanceWithEmployee,
  AttendanceQueryParams,
  ClockInInput,
  ClockOutInput,
} from '@/types/attendance';
import { extractErrorMessage } from '@/lib/api/error';

interface UseAttendanceState {
  isLoading: boolean;
  error: string | null;
  todayAttendance: AttendanceWithEmployee | null;
}

interface UseAttendanceReturn extends UseAttendanceState {
  clockIn: (input?: ClockInInput) => Promise<Attendance | null>;
  clockOut: (input: ClockOutInput) => Promise<Attendance | null>;
  fetchTodayAttendance: () => Promise<AttendanceWithEmployee | null>;
  fetchAttendances: (
    params?: AttendanceQueryParams
  ) => Promise<AttendanceWithEmployee[] | null>;
  clearError: () => void;
}

/**
 * 출퇴근 관련 API 호출을 위한 훅
 * - 직원: 출근/퇴근 처리, 오늘 기록 조회
 * - 기업/관리자: 출퇴근 기록 조회
 */
export function useAttendance(): UseAttendanceReturn {
  const [state, setState] = useState<UseAttendanceState>({
    isLoading: false,
    error: null,
    todayAttendance: null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const handleError = useCallback(
    (err: unknown): string => {
      const message = extractErrorMessage(err);
      setError(message);
      return message;
    },
    [setError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * 출근 처리
   */
  const clockIn = useCallback(
    async (input?: ClockInInput): Promise<Attendance | null> => {
      setLoading(true);
      setError(null);

      try {
        const attendance = await attendanceApi.clockIn(input);
        return attendance;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, handleError]
  );

  /**
   * 퇴근 처리
   */
  const clockOut = useCallback(
    async (input: ClockOutInput): Promise<Attendance | null> => {
      setLoading(true);
      setError(null);

      try {
        const attendance = await attendanceApi.clockOut(input);
        return attendance;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, handleError]
  );

  /**
   * 오늘의 출퇴근 기록 조회
   */
  const fetchTodayAttendance = useCallback(async (): Promise<AttendanceWithEmployee | null> => {
    setLoading(true);
    setError(null);

    try {
      const attendance = await attendanceApi.getTodayAttendance();
      setState((prev) => ({ ...prev, todayAttendance: attendance }));
      return attendance;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, handleError]);

  /**
   * 출퇴근 기록 목록 조회
   */
  const fetchAttendances = useCallback(
    async (params?: AttendanceQueryParams): Promise<AttendanceWithEmployee[] | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await attendanceApi.getAttendances(params);
        return response.data;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, handleError]
  );

  return {
    ...state,
    clockIn,
    clockOut,
    fetchTodayAttendance,
    fetchAttendances,
    clearError,
  };
}
