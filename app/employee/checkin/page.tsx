'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, Loader2, Check } from 'lucide-react';
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

  // 출근 시간 설정 UI 상태
  const [timePeriod, setTimePeriod] = useState<'AM' | 'PM'>('AM');
  const [hourInput, setHourInput] = useState('');
  const [minuteInput, setMinuteInput] = useState('');

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
          <div className="mx-6 sm:mx-8 mb-4">
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

          {/* 출근 시간 설정 섹션 */}
          <div className="mx-6 sm:mx-8 mb-6 bg-[#FFFBF7] rounded-2xl p-5 sm:p-6 border border-duru-orange-100/60 shadow-sm">
            {/* 섹션 헤더 */}
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">출근 시간 설정</h3>
              <p className="text-base text-gray-600">오늘 출근 시간을 직접 입력해주세요</p>
            </div>

            {/* 오전/오후 선택 */}
            <div className="mb-5">
              <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                <button
                  type="button"
                  onClick={() => setTimePeriod('AM')}
                  className={`flex-1 py-3.5 px-6 text-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    timePeriod === 'AM'
                      ? 'bg-duru-orange-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {timePeriod === 'AM' && <Check className="w-5 h-5" />}
                  <span className={timePeriod === 'AM' ? 'font-bold' : ''}>오전</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimePeriod('PM')}
                  className={`flex-1 py-3.5 px-6 text-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    timePeriod === 'PM'
                      ? 'bg-duru-orange-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {timePeriod === 'PM' && <Check className="w-5 h-5" />}
                  <span className={timePeriod === 'PM' ? 'font-bold' : ''}>오후</span>
                </button>
              </div>
            </div>

            {/* 시/분 입력 */}
            <div className="flex items-end gap-3 mb-4">
              {/* 시 입력 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">시</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={hourInput}
                  onChange={(e) => setHourInput(e.target.value)}
                  placeholder="예: 9"
                  className="w-full px-4 py-3.5 text-xl text-center font-medium border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-duru-orange-300 focus:border-duru-orange-400 transition-all"
                />
              </div>

              {/* 구분자 콜론 */}
              <div className="pb-3.5">
                <span className="text-3xl font-bold text-gray-400">:</span>
              </div>

              {/* 분 입력 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">분</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={minuteInput}
                  onChange={(e) => setMinuteInput(e.target.value)}
                  placeholder="예: 30"
                  className="w-full px-4 py-3.5 text-xl text-center font-medium border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-duru-orange-300 focus:border-duru-orange-400 transition-all"
                />
              </div>
            </div>

            {/* 안내 문구 */}
            <p className="text-sm text-gray-500">예) 오전 9:30</p>
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
