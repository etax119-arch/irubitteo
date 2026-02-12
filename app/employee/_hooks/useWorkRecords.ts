'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAttendance } from './useAttendance';
import { attendanceApi } from '@/lib/api/attendance';
import { isHeicFile, isHeicFileByContent, convertHeicToJpeg, compressImage, filesToBase64 } from '@/lib/file';
import type { AttendanceWithEmployee } from '@/types/attendance';

export function useWorkRecords() {
  const { fetchAttendances, isLoading } = useAttendance();
  const [isOpen, setIsOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const { year, month } = yearMonth;
  const [workRecords, setWorkRecords] = useState<AttendanceWithEmployee[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  // 업무 기록에 사진 추가 (서버 업로드)
  const addPhotoToRecord = useCallback(
    async (recordId: string, e: React.ChangeEvent<HTMLInputElement>): Promise<boolean> => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return false;

      setIsUploading(true);
      try {
        // HEIC 감지/변환 + 압축
        const processedBlobs = await Promise.all(
          files.map(async (file) => {
            let blob: File | Blob = file;

            const isHeic = isHeicFile(file) || (await isHeicFileByContent(file));
            if (isHeic) {
              try {
                blob = await convertHeicToJpeg(file);
              } catch {
                // 변환 실패 시 원본 사용
              }
            }

            return compressImage(blob);
          })
        );

        // base64 변환 → API 호출
        const base64Photos = await filesToBase64(processedBlobs);
        const updated = await attendanceApi.addPhotos(recordId, base64Photos);

        setWorkRecords((prev) =>
          prev.map((record) =>
            record.id === recordId ? updated : record
          )
        );
        return true;
      } catch {
        return false;
      } finally {
        setIsUploading(false);
      }
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
    isUploading,
    toggleOpen,
    handleYearChange,
    handleMonthChange,
    addPhotoToRecord,
    deletePhotoFromRecord,
  };
}
