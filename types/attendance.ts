/** 출퇴근 상태 */
export type AttendanceStatus = 'present' | 'absent';

/** 출퇴근 기록 */
export type Attendance = {
  id: string;
  employeeId: string;
  date: Date;
  clockIn: Date | null;
  clockOut: Date | null;
  status: AttendanceStatus;
  isLate: boolean;
  isEarlyLeave: boolean;
  note: string | null;
  workContent: string | null;
  photoUrls: string[];
  createdAt: Date;
  updatedAt: Date;
};

/** 출근 처리 입력 (employeeId는 JWT에서 추출) */
export type ClockInInput = {
  note?: string;
};

/** 퇴근 처리 입력 (attendanceId는 JWT + 오늘 날짜로 조회) */
export type ClockOutInput = {
  workContent?: string;
  photos?: string[];
  note?: string;
};

/** 출퇴근 수정 입력 (관리자/기업용) */
export type AttendanceUpdateInput = {
  clockIn?: Date;
  clockOut?: Date;
  workContent?: string;
  note?: string;
  // status, isLate, isEarlyLeave는 clockIn/clockOut 기준 자동 계산
};

/** 출퇴근 현황 조회용 (직원 정보 포함) */
export type AttendanceWithEmployee = Attendance & {
  employee: {
    id: string;
    name: string;
    phone: string;
    uniqueCode: string;
  };
};

/** 일별 출퇴근 통계 */
export type DailyAttendanceStats = {
  date: Date;
  total: number;
  present: number;
  absent: number;
  late: number;
  earlyLeave: number;
};