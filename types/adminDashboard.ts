import type { Employee } from './employee';

/** 관리자 대시보드 통계 */
export interface AdminStats {
  totalCompanies: number;
  totalWorkers: number;
  activeWorkers: number;
  attendanceRate: number;
  pendingIssues: number;
}

/** 관리자 일일 출퇴근 - 직원 기록 */
export interface AdminDailyEmployee {
  employeeId: string;
  name: string;
  phone: string;
  clockIn: string | null;
  clockOut: string | null;
  workContent: string | null;
  isLate: boolean;
  status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'holiday' | 'pending' | 'dayoff';
}

/** 관리자 일일 출퇴근 - 회사별 */
export interface AdminDailyCompany {
  companyId: string;
  companyName: string;
  employees: AdminDailyEmployee[];
}

/** 결근 알림 */
export interface AbsenceAlert {
  id: string;
  employeeId: string;
  name: string;
  companyName: string;
  date: string;
  status: '결근';
}

/** 비고 업데이트 알림 */
export interface NoteUpdateAlert {
  id: string;
  employeeId: string;
  workerName: string;
  companyName: string;
  noteContent: string;
  updatedAt: string;
}

/** 월간 근무 통계 - 직원별 */
export interface WorkStatEmployee {
  id: string;
  name: string;
  workDays: number;
  totalHours: number;
  scheduledWorkDays: string[];
}

/** 월간 근무 통계 - 회사별 */
export interface MonthlyWorkStatsCompany {
  companyId: string;
  companyName: string;
  pmContactName: string | null;
  pmContactPhone: string | null;
  pmContactEmail: string | null;
  employees: WorkStatEmployee[];
}

/** 관리자 직원 (회사명 포함) */
export type EmployeeWithCompany = Employee & {
  companyName: string;
};

/** 근로자 필터 */
export type WorkerFilter = 'current' | 'resigned' | 'waiting' | 'all';
