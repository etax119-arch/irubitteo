'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle2, Home } from 'lucide-react';
import { NoticeSection } from './_components/NoticeSection';
import { WorkRecordsSection } from './_components/WorkRecordsSection';
import { PhotoLightbox } from './_components/PhotoLightbox';
import { useAuth } from '@/hooks/useAuth';

interface Photo {
  id: number;
  url: string;
  name: string;
}

interface Notice {
  id: number;
  date: string;
  content: string;
  sender: string;
}

interface WorkRecord {
  id: number;
  date: string;
  type: 'checkin' | 'checkout';
  workDone?: string;
  photos?: Photo[];
  confirmedTask?: string;
  timestamp: string;
}

// 더미 데이터
const todayNotices: Notice[] = [
  {
    id: 1,
    date: '2026.02.02',
    content: '폭설로 인해 금일 출근이 제한됩니다.\n안전을 위해 자택 대기 바랍니다.',
    sender: '두루빛터 관리자'
  }
];

const pastNotices: Notice[] = [
  {
    id: 2,
    date: '2026.01.28',
    content: '2월 근무 일정표가 변경되었습니다.\n기업 관리자에게 확인 바랍니다.',
    sender: '두루빛터 관리자'
  },
  {
    id: 3,
    date: '2025.08.17',
    content: '폭염 예보로 인해 금일 자택 대기 바랍니다.',
    sender: '두루빛터 관리자'
  }
];

const initialWorkRecords: WorkRecord[] = [
  {
    id: 1,
    date: '2026-02-03',
    type: 'checkout',
    workDone: '제품 포장 작업 50개 완료, 부품 조립 30개 완료, 작업장 정리정돈',
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', name: 'work1.jpg' },
      { id: 2, url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400', name: 'work2.jpg' }
    ],
    timestamp: '2026-02-03T18:30:00'
  },
  {
    id: 2,
    date: '2026-02-03',
    type: 'checkin',
    confirmedTask: '오늘은 제품 포장 작업과\n부품 조립 작업을 진행할 예정입니다.',
    timestamp: '2026-02-03T09:00:00'
  },
  {
    id: 3,
    date: '2026-02-01',
    type: 'checkout',
    workDone: '재고 정리 및 창고 정돈, 제품 검수 작업',
    photos: [
      { id: 3, url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400', name: 'work3.jpg' }
    ],
    timestamp: '2026-02-01T17:45:00'
  },
  {
    id: 4,
    date: '2026-01-30',
    type: 'checkout',
    workDone: '신제품 포장 작업, 라벨 부착 작업',
    photos: [],
    timestamp: '2026-01-30T18:00:00'
  },
  {
    id: 5,
    date: '2026-01-28',
    type: 'checkin',
    confirmedTask: '창고 정리 및 재고 정리 작업을 진행합니다.',
    timestamp: '2026-01-28T09:15:00'
  },
  {
    id: 6,
    date: '2025-12-20',
    type: 'checkout',
    workDone: '연말 재고 조사, 불량품 분류 작업',
    photos: [
      { id: 4, url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400', name: 'work4.jpg' }
    ],
    timestamp: '2025-12-20T18:30:00'
  }
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [showPastNotices, setShowPastNotices] = useState(false);
  const [showWorkRecords, setShowWorkRecords] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>(initialWorkRecords);

  const handleGoHome = async () => {
    await logout();
  };

  const handleCheckIn = () => {
    router.push('/employee/checkin');
  };

  const handleCheckOut = () => {
    router.push('/employee/checkout');
  };

  // 연도 변경 핸들러
  const handlePrevYear = () => {
    setSelectedYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prev => prev + 1);
  };

  // 월 변경 핸들러
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // 사진 저장 (다운로드)
  const savePhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('사진 저장 실패:', error);
    }
  };

  // 업무 기록에서 사진 삭제
  const deletePhotoFromRecord = (recordId: number) => {
    setWorkRecords((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? { ...record, photos: [] }
          : record
      )
    );
  };

  // 업무 기록에 사진 추가
  const addPhotoToRecord = (recordId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    setWorkRecords((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? { ...record, photos: [...(record.photos || []), ...newPhotos] }
          : record
      )
    );
  };

  // 로딩 중일 때 스피너 표시
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || ''}님, 환영합니다!</h2>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </p>
            </div>
            <button
              onClick={handleGoHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* 출근/퇴근 버튼 그리드 */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleCheckIn}
              className="p-8 bg-gradient-to-br from-duru-orange-500 to-duru-orange-600 text-white rounded-xl hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">출근하기</h3>
                  <p className="text-white/90">오늘의 할 일을 확인하세요</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleCheckOut}
              className="p-8 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">퇴근하기</h3>
                  <p className="text-white/90">오늘 한 일을 기록하세요</p>
                </div>
              </div>
            </button>
          </div>
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
          showWorkRecords={showWorkRecords}
          onToggleWorkRecords={() => setShowWorkRecords(!showWorkRecords)}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onPhotoClick={setSelectedPhoto}
          onSavePhoto={savePhoto}
          onDeletePhoto={deletePhotoFromRecord}
          onAddPhoto={addPhotoToRecord}
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
