/** 근무일정 (API 응답 기준 — 날짜는 ISO string) */
export type Schedule = {
  id: string;
  companyId: string;
  date: string;
  content: string;
  isHoliday: boolean;
  createdAt: string;
  updatedAt: string;
};

/** 근무일정 생성 입력 */
export type ScheduleCreateInput = {
  date: string; // "YYYY-MM-DD"
  content?: string;
  isHoliday?: boolean;
};

/** 근무일정 수정 입력 */
export type ScheduleUpdateInput = {
  content?: string;
  isHoliday?: boolean;
};

/** 국가 공휴일 (빨간날). 회사별 휴일(Schedule.isHoliday)과 별개인 전역 데이터 */
export type PublicHoliday = {
  date: string; // "YYYY-MM-DD"
  name: string; // 예: "설날", "대체공휴일"
};

/** 월별 일정 조회용 */
export type MonthlySchedule = {
  year: number;
  month: number;
  schedules: Schedule[];
  holidays: PublicHoliday[];
};

/**
 * 오늘의 일정 조회용.
 *
 * 공휴일을 schedule.isHoliday에 섞지 않는다 — 근로자 앱은 그 값으로 출근 버튼을
 * 숨기므로, 공휴일에도 출근할 수 있어야 한다는 요건과 충돌한다.
 */
export type TodayScheduleResponse = {
  schedule: Schedule | null;
  publicHoliday: PublicHoliday | null;
};
