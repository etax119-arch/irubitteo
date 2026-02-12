'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderCard } from './_components/HeaderCard';
import { AttendanceButtons } from './_components/AttendanceButtons';
import { NoticeSection } from './_components/NoticeSection';
import { WorkRecordsSection } from './_components/WorkRecordsSection';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { useAuthStore } from '@/lib/auth/store';
import { authApi } from '@/lib/api/auth';
import { useWorkRecords } from './_hooks/useWorkRecords';
import { useEmployeeNotice } from './_hooks/useEmployeeNotice';
import { useToast } from '@/components/ui/Toast';
import type { DisplayPhoto } from '@/types/attendance';

export default function EmployeeDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const toast = useToast();
  const [showPastNotices, setShowPastNotices] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<DisplayPhoto | null>(null);

  const {
    todayNotices,
    pastNotices,
    isLoading: noticesLoading,
    fetchNotices,
  } = useEmployeeNotice();

  const {
    isOpen: showWorkRecords,
    year: selectedYear,
    month: selectedMonth,
    workRecords,
    isLoading: recordsLoading,
    toggleOpen: toggleWorkRecords,
    handleYearChange,
    handleMonthChange,
    addPhotoToRecord,
    deletePhotoFromRecord,
    isUploading,
  } = useWorkRecords();

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 로그아웃 API 실패해도 클라이언트 상태는 정리
    } finally {
      clearUser();
      router.push('/');
    }
  };

  const handleSavePhoto = useCallback(async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success('사진이 저장되었습니다.');
    } catch {
      toast.error('사진 저장에 실패했습니다.');
    }
  }, [toast]);

  const handleDeletePhoto = useCallback(async (recordId: string, photoUrl: string) => {
    if (!window.confirm('이 사진을 삭제하시겠습니까?')) return;

    const success = await deletePhotoFromRecord(recordId, photoUrl);
    if (success) {
      toast.success('사진이 삭제되었습니다.');
    } else {
      toast.error('사진 삭제에 실패했습니다.');
    }
  }, [deletePhotoFromRecord, toast]);

  const handleAddPhoto = useCallback(async (recordId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const success = await addPhotoToRecord(recordId, e);
    if (success) {
      toast.success('사진이 추가되었습니다.');
    } else if (e.target.files && e.target.files.length > 0) {
      toast.error('사진 추가에 실패했습니다.');
    }
  }, [addPhotoToRecord, toast]);

  const handleCheckIn = () => {
    router.push('/employee/checkin');
  };

  const handleCheckOut = () => {
    router.push('/employee/checkout');
  };

  return (
    <div className="min-h-screen bg-duru-ivory">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* 헤더 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-duru-orange-100 mb-6">
          <HeaderCard userName={user?.name || ''} onLogout={handleLogout} />
          <AttendanceButtons onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
        </div>

        {/* 공지 섹션 */}
        {(noticesLoading || todayNotices.length > 0 || pastNotices.length > 0) && (
          <NoticeSection
            todayNotices={todayNotices}
            pastNotices={pastNotices}
            showPastNotices={showPastNotices}
            onTogglePastNotices={() => setShowPastNotices(!showPastNotices)}
          />
        )}

        {/* 활동 기록 섹션 */}
        <WorkRecordsSection
          workRecords={workRecords}
          isOpen={showWorkRecords}
          onToggle={toggleWorkRecords}
          year={selectedYear}
          month={selectedMonth}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
          onPhotoClick={setSelectedPhoto}
          onAddPhoto={handleAddPhoto}
          onSavePhoto={handleSavePhoto}
          onDeletePhoto={handleDeletePhoto}
          isLoading={recordsLoading}
        />

        {/* 사진 확대 모달 */}
        {selectedPhoto && (
          <PhotoLightbox
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </div>
    </div>
  );
}
