/** 근무일정 (API 응답 기준 — 날짜는 ISO string) */
export type Schedule = {
  id: string;
  companyId: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

/** 근무일정 생성 입력 */
export type ScheduleCreateInput = {
  date: string; // "YYYY-MM-DD"
  content: string;
};

/** 근무일정 수정 입력 */
export type ScheduleUpdateInput = {
  content: string;
};

/** 월별 일정 조회용 */
export type MonthlySchedule = {
  year: number;
  month: number;
  schedules: Schedule[];
};
