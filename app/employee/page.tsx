'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderCard } from './_components/HeaderCard';
import { AttendanceButtons } from './_components/AttendanceButtons';
import { PublicHolidayNotice } from './_components/PublicHolidayNotice';
import { NoticeSection } from './_components/NoticeSection';
import { WorkRecordsSection } from './_components/WorkRecordsSection';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/auth/store';
import { authApi } from '@/lib/api/auth';
import { useWorkRecords } from './_hooks/useWorkRecords';
import { useEmployeeNotice } from './_hooks/useEmployeeNotice';
import { useMyTodayAttendance } from './_hooks/useMyAttendanceQuery';
import { useMyScheduleToday } from './_hooks/useMyScheduleToday';
import { useMyProfile } from './_hooks/useMyProfile';
import { useToast } from '@/components/ui/Toast';
import { formatDateAsKST } from '@/lib/kst';
import { dateStringToWorkDay } from '@/lib/workDays';
import type { DisplayPhoto } from '@/types/attendance';
import type { AttendanceMode } from './_components/AttendanceButtons';
import type { WorkDay } from '@/types/employee';
import type { AttendanceWithEmployee } from '@/types/attendance';
import type { Schedule } from '@/types/schedule';

function getAttendanceMode(params: {
  isLoading: boolean;
  isError: boolean;
  todaySchedule: Schedule | null | undefined;
  workDays: WorkDay[] | undefined;
  todayWorkDay: WorkDay;
  todayAttendance: AttendanceWithEmployee | null | undefined;
  hireDate: string | undefined;
}): AttendanceMode {
  const { isLoading, isError, todaySchedule, workDays, todayWorkDay, todayAttendance, hireDate } = params;

  if (isLoading) return 'loading';
  if (isError) return 'error';

  if (hireDate && formatDateAsKST(new Date()) < hireDate) return 'beforeHire';

  // 회사가 직접 등록한 휴일만 출근을 막는다.
  // 국가 공휴일은 여기서 걸러내지 않는다 — 공휴일에도 출근은 가능해야 하고,
  // 출근하지 않으면 서버가 결근 대신 '공휴'로 남긴다.
  if (todaySchedule?.isHoliday) return 'holiday';
  if (workDays && !workDays.includes(todayWorkDay)) return 'dayoff';

  if (
    !todayAttendance ||
    todayAttendance.status === 'pending' ||
    todayAttendance.status === 'absent' ||
    todayAttendance.status === 'public_holiday'
  )
    return 'checkin';
  if (todayAttendance.status === 'checkin') return 'checkout';
  return 'completed';
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const toast = useToast();
  const [showPastNotices, setShowPastNotices] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<DisplayPhoto | null>(null);
  const [deletePhotoTarget, setDeletePhotoTarget] = useState<{ recordId: string; photoUrl: string } | null>(null);

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
    currentPage,
    pagination,
    goToNextPage,
    goToPrevPage,
  } = useWorkRecords();

  const { data: todayAttendance, isLoading: attendanceLoading, isError: attendanceError } = useMyTodayAttendance();
  const { data: todaySchedule, isLoading: scheduleLoading, isError: scheduleError } = useMyScheduleToday();
  const { data: myProfile, isLoading: profileLoading, isError: profileError } = useMyProfile();

  const isLoading = attendanceLoading || scheduleLoading || profileLoading;
  const isError = attendanceError || scheduleError || profileError;
  const todayWorkDay = dateStringToWorkDay(formatDateAsKST(new Date()));

  // 회사 휴일이면 이미 출근 버튼이 없으니 공휴일 안내는 겹쳐 띄우지 않는다
  const publicHolidayName = todaySchedule?.schedule?.isHoliday
    ? undefined
    : todaySchedule?.publicHoliday?.name;

  const mode = getAttendanceMode({
    isLoading,
    isError,
    todaySchedule: todaySchedule?.schedule ?? null,
    workDays: myProfile?.workDays,
    todayWorkDay,
    todayAttendance: todayAttendance ?? null,
    hireDate: myProfile?.hireDate,
  });

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

  const handleDeletePhoto = useCallback((recordId: string, photoUrl: string) => {
    setDeletePhotoTarget({ recordId, photoUrl });
  }, []);

  const handleConfirmDeletePhoto = useCallback(async () => {
    if (!deletePhotoTarget) return;
    const { recordId, photoUrl } = deletePhotoTarget;
    setDeletePhotoTarget(null);

    const success = await deletePhotoFromRecord(recordId, photoUrl);
    if (success) {
      toast.success('사진이 삭제되었습니다.');
    } else {
      toast.error('사진 삭제에 실패했습니다.');
    }
  }, [deletePhotoTarget, deletePhotoFromRecord, toast]);

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
          {publicHolidayName && mode === 'checkin' && (
            <div className="mb-4">
              <PublicHolidayNotice name={publicHolidayName} />
            </div>
          )}
          <AttendanceButtons
            mode={mode}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            holidayContent={
              todaySchedule?.schedule?.isHoliday ? todaySchedule.schedule.content : undefined
            }
            clockIn={todayAttendance?.clockIn}
            clockOut={todayAttendance?.clockOut}
            hireDate={myProfile?.hireDate}
          />
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
          currentPage={currentPage}
          pagination={pagination}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
        />

        {/* 사진 확대 모달 */}
        {selectedPhoto && (
          <PhotoLightbox
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}

        {/* 사진 삭제 확인 모달 */}
        <Modal isOpen={!!deletePhotoTarget} onClose={() => setDeletePhotoTarget(null)} title="삭제 확인" size="sm">
          <p className="text-gray-600 mb-6">이 사진을 삭제하시겠습니까?</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setDeletePhotoTarget(null)}>취소</Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDeletePhoto}>삭제</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
