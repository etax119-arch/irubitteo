/** 출퇴근 상태 */
export type AttendanceStatus = 'present' | 'absent';

/** 출퇴근 기록 */
export type Attendance = {
  id: string;
  employeeId: string;
  date: string; // ISO 형식 (JSON 직렬화 대응)
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  isLate: boolean;
  isEarlyLeave: boolean;
  note: string | null;
  workContent: string | null;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
};

/** 출근 처리 입력 (employeeId는 JWT에서 추출) */
export type ClockInInput = {
  note?: string;
};

/** 퇴근 처리 입력 (attendanceId는 JWT + 오늘 날짜로 조회) */
export type ClockOutInput = {
  workContent: string; // 필수
  photos?: string[];
  note?: string;
};

/** 출퇴근 수정 입력 (관리자/기업용) */
export type AttendanceUpdateInput = {
  clockIn?: string;
  clockOut?: string;
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
  date: string; // ISO 형식
  total: number;
  present: number;
  absent: number;
  late: number;
  earlyLeave: number;
};

/** 사진 표시용 (라이트박스, 기록 표시) */
export type DisplayPhoto = {
  url: string;
  name: string;
};

/** 사진 업로드용 (퇴근 사진 첨부) */
export type UploadPhoto = {
  id: number;
  name: string;
  url: string;
  file: File;
};