'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAttendance } from '@/hooks/useAttendance';
import { attendanceApi } from '@/lib/api/attendance';
import type { AttendanceWithEmployee } from '@/types/attendance';

export function useWorkRecords() {
  const { fetchAttendances, isLoading } = useAttendance();
  const [isOpen, setIsOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const { year, month } = yearMonth;
  const [workRecords, setWorkRecords] = useState<AttendanceWithEmployee[]>([]);
  const localBlobUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = localBlobUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // 아코디언 열릴 때 또는 연도/월 변경 시 fetch (lazy loading)
  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;

    const loadWorkRecords = async () => {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

      const attendances = await fetchAttendances({ startDate, endDate });
      if (attendances && !ignore) {
        setWorkRecords(attendances);
      }
    };

    loadWorkRecords();
    return () => { ignore = true; };
  }, [isOpen, year, month, fetchAttendances]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleYearChange = useCallback((direction: 'prev' | 'next') => {
    setYearMonth((prev) => ({
      ...prev,
      year: direction === 'prev' ? prev.year - 1 : prev.year + 1,
    }));
  }, []);

  const handleMonthChange = useCallback((direction: 'prev' | 'next') => {
    setYearMonth((prev) => {
      if (direction === 'prev') {
        return prev.month === 1
          ? { year: prev.year - 1, month: 12 }
          : { ...prev, month: prev.month - 1 };
      }
      return prev.month === 12
        ? { year: prev.year + 1, month: 1 }
        : { ...prev, month: prev.month + 1 };
    });
  }, []);

  // 업무 기록에 사진 추가 (로컬 상태만 - 서버 반영 안됨)
  const addPhotoToRecord = useCallback(
    (recordId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const newPhotoUrls = files.map((file) => URL.createObjectURL(file));
      localBlobUrls.current.push(...newPhotoUrls);

      setWorkRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, photoUrls: [...record.photoUrls, ...newPhotoUrls] }
            : record
        )
      );
    },
    []
  );

  // 서버에서 사진 삭제 후 로컬 state 반영
  const deletePhotoFromRecord = useCallback(
    async (recordId: string, photoUrl: string): Promise<boolean> => {
      try {
        const updated = await attendanceApi.deletePhoto(recordId, photoUrl);
        setWorkRecords((prev) =>
          prev.map((record) =>
            record.id === recordId ? updated : record
          )
        );
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  return {
    isOpen,
    year,
    month,
    workRecords,
    isLoading,
    toggleOpen,
    handleYearChange,
    handleMonthChange,
    addPhotoToRecord,
    deletePhotoFromRecord,
  };
}
