'use client';

import { useState, useCallback } from 'react';
import { scheduleApi } from '@/lib/api/schedules';
import type {
  Schedule,
  ScheduleCreateInput,
  ScheduleUpdateInput,
} from '@/types/schedule';
import { extractErrorMessage } from '@/lib/api/error';

interface UseScheduleState {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
}

interface UseScheduleReturn extends UseScheduleState {
  fetchMonthly: (year: number, month: number) => Promise<Schedule[] | null>;
  createSchedule: (input: ScheduleCreateInput) => Promise<Schedule | null>;
  updateSchedule: (id: string, input: ScheduleUpdateInput) => Promise<Schedule | null>;
  deleteSchedule: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useSchedule(): UseScheduleReturn {
  const [state, setState] = useState<UseScheduleState>({
    schedules: [],
    isLoading: false,
    error: null,
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

  const fetchMonthly = useCallback(
    async (year: number, month: number): Promise<Schedule[] | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await scheduleApi.getMonthly(year, month);
        setState((prev) => ({ ...prev, schedules: result.schedules }));
        return result.schedules;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, handleError]
  );

  const createSchedule = useCallback(
    async (input: ScheduleCreateInput): Promise<Schedule | null> => {
      setLoading(true);
      setError(null);

      try {
        const schedule = await scheduleApi.create(input);
        setState((prev) => ({ ...prev, schedules: [...prev.schedules, schedule] }));
        return schedule;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, handleError]
  );

  const updateSchedule = useCallback(
    async (id: string, input: ScheduleUpdateInput): Promise<Schedule | null> => {
      setLoading(true);
      setError(null);

      try {
        const schedule = await scheduleApi.update(id, input);
        setState((prev) => ({
          ...prev,
          schedules: prev.schedules.map((s) => (s.id === id ? schedule : s)),
        }));
        return schedule;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, handleError]
  );

  const deleteSchedule = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await scheduleApi.remove(id);
        setState((prev) => ({
          ...prev,
          schedules: prev.schedules.filter((s) => s.id !== id),
        }));
        return true;
      } catch (err) {
        handleError(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, handleError]
  );

  return {
    ...state,
    fetchMonthly,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    clearError,
  };
}
