'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { SuccessModal } from '../_components/SuccessModal';
import { useClockIn } from '../_hooks/useMyAttendanceMutations';
import { Checkbox } from '@/components/ui/Checkbox';
import { scheduleApi } from '@/lib/api/schedules';
import { formatDateAsKST, buildKSTTimestamp } from '@/lib/kst';
import type { Schedule } from '@/types/schedule';

export default function CheckInPage() {
  const router = useRouter();
  const [confirmedTasks, setConfirmedTasks] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const clockInMutation = useClockIn();
  const isLoading = clockInMutation.isPending;
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null | undefined>(undefined);

  // 출근 시간 설정 UI 상태 - KST 현재 시간을 기본값으로
  const kstParts = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul',
  }).formatToParts(new Date());
  const kstHour = kstParts.find(p => p.type === 'hour')!.value;
  const kstMinute = kstParts.find(p => p.type === 'minute')!.value;
  const [hourInput, setHourInput] = useState(kstHour);
  const [minuteInput, setMinuteInput] = useState(kstMinute);

  useEffect(() => {
    scheduleApi.getToday()
      .then(setTodaySchedule)
      .catch(() => setTodaySchedule(null));
  }, []);

  const handleBack = () => {
    router.back();
  };

  const submittingRef = useRef(false);

  const completeCheckIn = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      const todayKST = formatDateAsKST(new Date());
      const clockInTimestamp = buildKSTTimestamp(todayKST, `${hourInput}:${minuteInput}`);

      await clockInMutation.mutateAsync({ clockIn: clockInTimestamp });
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
            <p className="text-lg text-gray-500">오늘 할 일을 확인해주세요</p>
          </div>

          {/* 오늘의 작업 내용 */}
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
                  {todaySchedule === undefined
                    ? '불러오는 중...'
                    : todaySchedule === null
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

          {/* 출근 시간 설정 섹션 */}
          <div className="mx-6 sm:mx-8 mb-6 bg-[#FFFBF7] rounded-2xl p-5 sm:p-6 border border-duru-orange-100/60 shadow-sm">
            {/* 섹션 헤더 */}
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">출근 시간 설정</h3>
              <p className="text-base text-gray-600">시와 분을 모두 선택해주세요</p>
            </div>

            {/* 시/분 드롭다운 */}
            <div className="flex items-end gap-3">
              {/* 시 선택 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">시</label>
                <select
                  value={hourInput}
                  onChange={(e) => setHourInput(e.target.value)}
                  className="w-full px-4 py-3.5 text-xl text-center font-medium border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-duru-orange-300 focus:border-duru-orange-400 transition-all appearance-none"
                >
                  <option value="">--</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              {/* 구분자 콜론 */}
              <div className="pb-3.5">
                <span className="text-3xl font-bold text-gray-400">:</span>
              </div>

              {/* 분 선택 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">분</label>
                <select
                  value={minuteInput}
                  onChange={(e) => setMinuteInput(e.target.value)}
                  className="w-full px-4 py-3.5 text-xl text-center font-medium border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-duru-orange-300 focus:border-duru-orange-400 transition-all appearance-none"
                >
                  <option value="">--</option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 출근 완료 버튼 */}
          <div className="px-6 sm:px-8 pb-8">
            <button
              onClick={completeCheckIn}
              disabled={!confirmedTasks || !hourInput || !minuteInput || isLoading}
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
