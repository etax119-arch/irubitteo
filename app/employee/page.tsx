'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderCard } from './_components/HeaderCard';
import { AttendanceButtons } from './_components/AttendanceButtons';
import { NoticeSection } from './_components/NoticeSection';
import { WorkRecordsSection } from './_components/WorkRecordsSection';
import { PhotoLightbox } from './_components/PhotoLightbox';
import { useAuth } from '@/hooks/useAuth';
import { useWorkRecords } from './_hooks/useWorkRecords';
import type { DisplayPhoto } from '@/types/attendance';

interface Notice {
  id: number;
  date: string;
  content: string;
  sender: string;
}

// 더미 데이터
const todayNotices: Notice[] = [
  {
    id: 1,
    date: '2026.02.02',
    content: '폭설로 인해 금일 출근이 제한됩니다.\n안전을 위해 자택 대기 바랍니다.',
    sender: '두루빛터 관리자',
  },
];

const pastNotices: Notice[] = [
  {
    id: 2,
    date: '2026.01.28',
    content: '2월 근무 일정표가 변경되었습니다.\n기업 관리자에게 확인 바랍니다.',
    sender: '두루빛터 관리자',
  },
  {
    id: 3,
    date: '2025.08.17',
    content: '폭염 예보로 인해 금일 자택 대기 바랍니다.',
    sender: '두루빛터 관리자',
  },
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [showPastNotices, setShowPastNotices] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<DisplayPhoto | null>(null);

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
  } = useWorkRecords();

  const handleLogout = async () => {
    await logout();
  };

  const handleCheckIn = () => {
    router.push('/employee/checkin');
  };

  const handleCheckOut = () => {
    router.push('/employee/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-duru-ivory flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duru-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-duru-ivory">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* 헤더 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-duru-orange-100 mb-6">
          <HeaderCard userName={user?.name || ''} onLogout={handleLogout} />
          <AttendanceButtons onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
        </div>

        {/* 공지 섹션 */}
        <NoticeSection
          todayNotices={todayNotices}
          pastNotices={pastNotices}
          showPastNotices={showPastNotices}
          onTogglePastNotices={() => setShowPastNotices(!showPastNotices)}
        />

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
          onAddPhoto={addPhotoToRecord}
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
