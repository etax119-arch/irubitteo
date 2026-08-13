/**
 * 국가 공휴일 (빨간날). 회사별 휴일(Schedule.isHoliday)과 별개인 전역 데이터.
 *
 * 관리자 설정 화면에서 관리하며, 기업 달력은 GET /schedules/monthly 응답으로
 * 함께 받는다(types/schedule.ts의 PublicHoliday).
 */
export type Holiday = {
  id: string;
  date: string; // "YYYY-MM-DD"
  name: string; // 예: "설날", "대체공휴일", "임시공휴일"
};

/** 연도별 공휴일 조회 응답 */
export type YearlyHolidays = {
  year: number;
  holidays: Holiday[];
};

export type HolidayCreateInput = {
  date: string; // "YYYY-MM-DD"
  name: string;
};

export type HolidayUpdateInput = {
  date?: string; // "YYYY-MM-DD"
  name?: string;
};
