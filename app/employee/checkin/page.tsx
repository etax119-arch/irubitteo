'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { SuccessModal } from '../_components/SuccessModal';
import { useAttendance } from '@/hooks/useAttendance';
import { scheduleApi } from '@/lib/api/schedules';
import type { Schedule } from '@/types/schedule';

export default function CheckInPage() {
  const router = useRouter();
  const [confirmedTasks, setConfirmedTasks] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { clockIn, isLoading, error } = useAttendance();
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null | undefined>(undefined);

  useEffect(() => {
    scheduleApi.getToday()
      .then(setTodaySchedule)
      .catch(() => setTodaySchedule(null));
  }, []);

  const handleBack = () => {
    router.back();
  };

  const completeCheckIn = async () => {
    const result = await clockIn();
    if (result) {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setConfirmedTasks(false);
    router.push('/employee');
  };

  return (
    <div className="min-h-screen bg-duru-ivory">
      <div className="max-w-3xl mx-auto p-4 sm:p-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로가기
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-duru-orange-100 overflow-hidden">
          {/* 상단 타이틀 */}
          <div className="text-center pt-8 pb-6 px-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-duru-orange-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-duru-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">출근하기</h1>
            <p className="text-lg text-gray-500">오늘 할 일을 확인해주세요</p>
          </div>

          {/* 오늘의 작업 내용 */}
          <div className="mx-6 sm:mx-8 mb-6 bg-[#FFF4EC] rounded-2xl p-6 sm:p-8 border border-duru-orange-100">
            <h3 className="text-xl font-bold text-duru-orange-600 mb-5">오늘의 작업 내용</h3>
            <p className="text-xl font-medium text-gray-900 leading-loose whitespace-pre-line">
              {todaySchedule === undefined
                ? '불러오는 중...'
                : todaySchedule === null
                ? '등록된 작업 내용이 없습니다.'
                : todaySchedule.content}
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mx-6 sm:mx-8 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-center font-medium">{error}</p>
            </div>
          )}

          {/* 확인 체크 영역 */}
          <div className="mx-6 sm:mx-8 mb-6">
            <label className="flex items-center gap-4 p-5 border-2 border-duru-orange-200 rounded-xl cursor-pointer hover:bg-duru-orange-50 transition-colors">
              <input
                type="checkbox"
                checked={confirmedTasks}
                onChange={(e) => setConfirmedTasks(e.target.checked)}
                className="w-7 h-7 text-duru-orange-600 rounded focus:ring-duru-orange-500 shrink-0"
              />
              <span className="text-xl font-semibold text-gray-800">오늘 할 일을 확인했어요!</span>
            </label>
          </div>

          {/* 출근 완료 버튼 */}
          <div className="px-6 sm:px-8 pb-8">
            <button
              onClick={completeCheckIn}
              disabled={!confirmedTasks || isLoading}
              className="w-full py-5 bg-duru-orange-500 text-white rounded-xl font-bold text-xl hover:bg-duru-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  출근 완료
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 출근 완료 모달 */}
      {showModal && (
        <SuccessModal type="checkin" onClose={handleModalClose} />
      )}
    </div>
  );
}
