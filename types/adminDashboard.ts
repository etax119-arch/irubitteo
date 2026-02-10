/**
 * @todo 관리자 API 구현 후 서버 응답에 맞게 재정의 필요 — 현재는 디자인 목업 기준
 * - 모든 id가 number (실제는 string UUID)
 * - 서버에 없는 필드 다수 포함 (industry, location, revenue, department 등)
 */

export interface AdminStats {
  totalCompanies: number;
  totalWorkers: number;
  activeWorkers: number;
  attendanceRate: number;
  expiringContracts: number;
  pendingIssues: number;
  monthlyRevenue: number;
  newInquiries: number;
  pendingConsultations: number;
}

export interface PMInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  workers: number;
  contractEnd: string;
  status: 'active' | 'expiring';
  revenue: number;
  pm: PMInfo;
}

export interface Worker {
  id: number;
  name: string;
  company: string;
  department: string;
  disabilityType: string;
  status: 'working' | 'resigned';
  phone: string;
  contractEnd: string;
  workerId: string;
  notes: string;
  isResigned: boolean;
  isWaiting: boolean;
  resignDate: string | null;
  resignReason: string | null;
}

export interface Notification {
  id: number;
  type: 'contract' | 'document' | 'attendance' | 'payment';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

export interface AbsenceAlert {
  id: number;
  name: string;
  company: string;
  date: string;
  status: string;
}

export interface Inquiry {
  id: number;
  company: string;
  ceo: string;
  date: string;
  phone: string;
  email: string;
  summary: string;
  content: string;
}

export interface DailyAttendanceWorker {
  id: number;
  name: string;
  department: string;
  checkin: string;
  checkout: string;
  workContent: string;
  needsAttention: boolean;
  phone?: string;
}

export interface CompanyAttendance {
  morning: DailyAttendanceWorker[];
  afternoon: DailyAttendanceWorker[];
}

export type DailyAttendanceData = Record<string, CompanyAttendance>;

export interface WorkStatWorker {
  id: number;
  name: string;
  department: string;
  totalHours: number;
  avgHours: number;
  workDays: number;
  lateDays: number;
  scheduledWorkDays: string[];
}

export type MonthlyWorkStats = Record<string, WorkStatWorker[]>;

export interface AddCompanyForm {
  companyName: string;
  businessNumber: string;
  address: string;
  contractStartDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  adminId: string;
}

export type WorkerFilter = 'current' | 'resigned' | 'waiting' | 'all';
