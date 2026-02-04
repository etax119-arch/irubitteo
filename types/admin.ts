/** 두르비터 관리자 */
export type Admin = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

/** 관리자 생성 입력 */
export type AdminCreateInput = {
  email: string;
  password: string;
  name: string;
};

/** 플랫폼 전체 통계 */
export type AdminStats = {
  totalCompanies: number;
  activeCompanies: number;
  totalEmployees: number;
  activeEmployees: number;
  todayAttendances: number;
  todayAbsences: number;
  newCompaniesThisMonth: number;
  newEmployeesThisMonth: number;
  urgentNotificationCount: number;
};

/** 월간 통계 직원별 데이터 */
export type MonthlyStatsEmployee = {
  id: string;
  name: string;
  phone: string;
  workDays: number;
  totalWorkHours: number;
};

/** 월간 통계 회사별 데이터 */
export type MonthlyStatsCompany = {
  id: string;
  name: string;
  employees: MonthlyStatsEmployee[];
  averageWorkDays: number;
  averageWorkHours: number;
};

/** 월간 통계 응답 */
export type MonthlyStatsResponse = {
  year: number;
  month: number;
  companies: MonthlyStatsCompany[];
};

/** 월간 통계 수정 입력 */
export type MonthlyStatsUpdateInput = {
  year: number;
  month: number;
  workDays: number;
  totalWorkHours: number;
};

/** 감사 로그 액션 유형 */
export type AuditAction = 'login' | 'logout' | 'create' | 'update' | 'delete';

/** 감사 로그 사용자 유형 */
export type AuditUserType = 'admin' | 'company' | 'employee';

/** 감사 로그 */
export type AuditLog = {
  id: string;
  userId: string | null;
  userType: AuditUserType;
  action: AuditAction;
  targetType: string | null;
  targetId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
};