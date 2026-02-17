import type { Employee } from './employee';

/** 출퇴근 상태 */
export type AttendanceStatus = 'checkin' | 'checkout' | 'absent' | 'leave';

/** 일별 출퇴근 현황에서 사용하는 직원 상태 (Employee.status에서 resigned 제외) */
export type EmployeeDailyStatus = Exclude<Employee['status'], 'resigned'>;

/** 출퇴근 표시 상태 (기업 대시보드용) */
export type DisplayStatus = '정상' | '지각' | '결근' | '휴가';

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
  clockIn?: string;
};

/** 퇴근 처리 입력 (attendanceId는 JWT + 오늘 날짜로 조회) */
export type ClockOutInput = {
  workContent: string; // 필수
  photos?: Blob[];
  note?: string;
};

/** 출퇴근 수정 입력 (관리자/기업용) */
export type AttendanceUpdateInput = {
  clockIn?: string;
  clockOut?: string;
  workContent?: string;
  note?: string;
  status?: AttendanceStatus;
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
  id: string;
  name: string;
  url: string;
  file: File | Blob;
};

/** 출퇴근 기록 조회 파라미터 */
export type AttendanceQueryParams = {
  employeeId?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
};

/** 기업 대시보드 일별 출퇴근 기록 (개별 직원) */
export interface DailyAttendanceRecord {
  employeeId: string;
  name: string;
  phone: string;
  profileImage: string | null;
  clockIn: string | null;
  clockOut: string | null;
  status: EmployeeDailyStatus;
  workContent: string | null;
}

/** 기업 대시보드 일별 출퇴근 통계 */
export interface CompanyDailyStats {
  total: number;
  checkedIn: number;
  checkedOut: number;
  attendanceRate: number;
}

/** 기업 대시보드 일별 출퇴근 응답 */
export interface CompanyDailyResponse {
  date: string;
  isHoliday: boolean;
  stats: CompanyDailyStats;
  records: DailyAttendanceRecord[];
}
