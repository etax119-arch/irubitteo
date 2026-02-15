'use client';

import { useState, useCallback } from 'react';
import { useMyAttendanceHistory } from './useMyAttendanceQuery';
import { useAddPhotos, useDeletePhoto } from './useMyAttendanceMutations';
import { isHeicFile, isHeicFileByContent, convertHeicToJpeg, compressImage } from '@/lib/file';
import type { Pagination } from '@/types/api';

const PAGE_LIMIT = 20;

export function useWorkRecords() {
  const [isOpen, setIsOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const { year, month } = yearMonth;
  const [page, setPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  const { data, isLoading } = useMyAttendanceHistory({
    page,
    limit: PAGE_LIMIT,
    startDate,
    endDate,
    enabled: isOpen,
  });

  const workRecords = data?.records ?? [];
  const pagination: Pagination = data?.pagination ?? { page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 };

  const addPhotosMutation = useAddPhotos();
  const deletePhotoMutation = useDeletePhoto();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleYearChange = useCallback((direction: 'prev' | 'next') => {
    setYearMonth((prev) => ({
      ...prev,
      year: direction === 'prev' ? prev.year - 1 : prev.year + 1,
    }));
    setPage(1);
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
    setPage(1);
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));
  }, [pagination.totalPages]);

  const goToPrevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const addPhotoToRecord = useCallback(
    async (recordId: string, e: React.ChangeEvent<HTMLInputElement>): Promise<boolean> => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return false;

      setIsUploading(true);
      try {
        const rawBlobs = await Promise.all(
          files.map(async (file) => {
            let blob: File | Blob = file;

            const isHeic = isHeicFile(file) || (await isHeicFileByContent(file));
            if (isHeic) {
              try {
                blob = await convertHeicToJpeg(file);
              } catch {
                return null;
              }
            }

            return compressImage(blob);
          })
        );

        const processedBlobs = rawBlobs.filter((b): b is Blob => b !== null);
        if (processedBlobs.length === 0) return false;

        await addPhotosMutation.mutateAsync({ attendanceId: recordId, photos: processedBlobs });
        return true;
      } catch {
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [addPhotosMutation]
  );

  const deletePhotoFromRecord = useCallback(
    async (recordId: string, photoUrl: string): Promise<boolean> => {
      try {
        await deletePhotoMutation.mutateAsync({ attendanceId: recordId, photoUrl });
        return true;
      } catch {
        return false;
      }
    },
    [deletePhotoMutation]
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
    currentPage: page,
    pagination,
    goToNextPage,
    goToPrevPage,
  };
}
