'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { SuccessModal } from '../_components/SuccessModal';
import { useClockIn } from '../_hooks/useMyAttendanceMutations';
import { Checkbox } from '@/components/ui/Checkbox';
import { useMyScheduleToday } from '../_hooks/useMyScheduleToday';
import { PublicHolidayNotice } from '../_components/PublicHolidayNotice';

function formatNowClock(date: Date): { date: string; time: string } {
  return {
    date: date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
    time: date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

export default function CheckInPage() {
  const router = useRouter();
  const [confirmedTasks, setConfirmedTasks] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const clockInMutation = useClockIn();
  const isLoading = clockInMutation.isPending;
  const [now, setNow] = useState(() => new Date());

  // 홈 화면(app/employee/page.tsx)이 이미 채워둔 캐시를 그대로 쓴다
  const { data: today, isLoading: scheduleLoading } = useMyScheduleToday();
  const todaySchedule = today?.schedule;
  // 회사 휴일이면 이미 휴일 안내가 뜨므로 공휴일 안내는 겹쳐 띄우지 않는다
  const publicHolidayName = todaySchedule?.isHoliday
    ? undefined
    : today?.publicHoliday?.name;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clock = formatNowClock(now);

  const handleBack = () => {
    router.back();
  };

  const submittingRef = useRef(false);

  const completeCheckIn = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      await clockInMutation.mutateAsync(undefined);
      setShowModal(true);
    } catch {
      // 글로벌 토스트에서 에러 처리
    } finally {
      submittingRef.current = false;
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
            <p className="text-lg text-gray-500 mb-5">오늘 할 일을 확인해주세요</p>

            {/* 실시간 현재 시각 (읽기 전용) */}
            <div className="inline-flex flex-col items-center gap-1 px-8 py-4 bg-duru-orange-50 border border-duru-orange-100 rounded-2xl">
              <span className="text-sm font-medium text-gray-500">{clock.date}</span>
              <span
                className="text-4xl sm:text-5xl font-bold text-duru-orange-600 tabular-nums tracking-tight"
                aria-live="off"
              >
                {clock.time}
              </span>
            </div>
          </div>

          {/* 오늘의 작업 내용 */}
          {publicHolidayName && (
            <div className="mx-6 sm:mx-8 mb-4">
              <PublicHolidayNotice name={publicHolidayName} />
            </div>
          )}

          <div className={`mx-6 sm:mx-8 mb-6 rounded-2xl p-6 sm:p-8 border ${
            todaySchedule?.isHoliday
              ? 'bg-red-50 border-red-200'
              : 'bg-[#FFF4EC] border-duru-orange-100'
          }`}>
            {todaySchedule?.isHoliday ? (
              <>
                <h3 className="text-xl font-bold text-red-600 mb-5">오늘은 휴일입니다</h3>
                <p className="text-xl font-medium text-gray-900 leading-loose whitespace-pre-line break-words [overflow-wrap:anywhere]">
                  {todaySchedule.content || '휴일입니다.'}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-duru-orange-600 mb-5">오늘의 작업 내용</h3>
                <p className="text-xl font-medium text-gray-900 leading-loose whitespace-pre-line break-words [overflow-wrap:anywhere]">
                  {scheduleLoading
                    ? '불러오는 중...'
                    : !todaySchedule
                    ? '등록된 작업 내용이 없습니다.'
                    : todaySchedule.content}
                </p>
              </>
            )}
          </div>

          {/* 확인 체크 영역 */}
          <div className="mx-6 sm:mx-8 mb-4">
            <div className="p-5 border-2 border-duru-orange-200 rounded-xl hover:bg-duru-orange-50 transition-colors">
              <Checkbox
                checked={confirmedTasks}
                onChange={(e) => setConfirmedTasks(e.target.checked)}
                label={<span className="text-xl font-semibold text-gray-800">오늘 할 일을 확인했어요!</span>}
                size="lg"
              />
            </div>
          </div>

          {/* 출근 완료 버튼 */}
          <div className="px-6 sm:px-8 pb-8 pt-2">
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
